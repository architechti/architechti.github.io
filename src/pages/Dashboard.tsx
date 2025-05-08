
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { ReportList } from "@/components/stray/ReportList";
import { ReportData } from "@/components/stray/ReportForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPinIcon, StarIcon, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileCard } from "@/components/user/UserProfileCard";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch reports from Supabase
  useEffect(() => {
    if (!user) return;

    async function fetchReports() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('stray_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform data to match ReportData type
        const formattedReports: ReportData[] = data.map(report => ({
          id: report.id,
          type: report.type as any,
          description: report.description || '',
          location: {
            latitude: report.latitude,
            longitude: report.longitude,
            address: report.address || 'Unknown location',
          },
          imageUrl: report.image_url || '',
          urgency: report.urgency as any,
          timestamp: report.created_at,
          tags: report.tags || [],
        }));

        setReports(formattedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Υπήρξε πρόβλημα στην φόρτωση των αναφορών. Παρακαλώ προσπάθησε ξανά.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, [user]);

  // If still loading or not authenticated, show nothing
  if (loading || !user) {
    return null;
  }

  const handleViewDetails = (report: ReportData) => {
    setSelectedReport(report);
  };

  // Filter reports for high priority and recent reports
  const highPriorityReports = reports.filter(r => r.urgency === "Υψηλή");
  const recentReports = reports.filter(r => {
    const reportDate = new Date(r.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return reportDate > weekAgo;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Αρχική</h1>
            <p className="text-muted-foreground">
              Εντόπισε και διαχειρίσου τις αναφορές των αδέσποτων
            </p>
          </div>
          <Button
            onClick={() => navigate("/report")}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Ανάφερε αδέσποτο
          </Button>
        </div>

        {/* User profile and stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <UserProfileCard />
          
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-6 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <StarIcon className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-medium">Συνολικές αναφορές</h3>
              </div>
              <p className="text-3xl font-bold">{reports.length}</p>
            </div>
            <div className="bg-muted/50 p-6 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-medium">Υψηλής προτεραιότητας</h3>
              </div>
              <p className="text-3xl font-bold">{highPriorityReports.length}</p>
            </div>
            <div className="bg-muted/50 p-6 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <MapPinIcon className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Αυτή την βδομάδα</h3>
              </div>
              <p className="text-3xl font-bold">{recentReports.length}</p>
            </div>
          </div>
        </div>

        {/* Report list */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Πρόσφατες αναφορές</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Φόρτωση αναφορών...</p>
            </div>
          ) : (
            <>
              <ReportList reports={reports} onViewDetails={handleViewDetails} />
              
              {reports.length === 0 && (
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Καμία αναφορά ως τώρα</h3>
                  <p className="text-muted-foreground mb-4">
                    Δεν έχεις αναφέρει κανένα αδέσποτο ακόμα.
                  </p>
                  <Button
                    onClick={() => navigate("/report")}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    Κάνε την πρώτη σου αναφορά
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Report details dialog */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        {selectedReport && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Λεπτομέρειες αναφοράς</DialogTitle>
              <DialogDescription>
                Report ID: {selectedReport.id}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img
                  src={selectedReport.imageUrl}
                  alt={`${selectedReport.type} - ${selectedReport.id}`}
                  className="w-full rounded-md aspect-square object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Είδος αδέσποτου</h3>
                  <p>{selectedReport.type}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Λεπτομέρειες</h3>
                  <p>{selectedReport.description || "No description provided"}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Τοποθεσία</h3>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{selectedReport.location.address}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Ετικέτες</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedReport.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    {selectedReport.tags.length === 0 && (
                      <span className="text-muted-foreground">Χωρίς ετικέτα</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Κρισιμότητα</h3>
                  <Badge
                    className={
                      selectedReport.urgency === "Υψηλή"
                        ? "bg-red-500"
                        : selectedReport.urgency === "Μεσαία"
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }
                  >
                    {selectedReport.urgency} Προτεραιότητα
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold">Η αναφορά ολοκληρώθηκε</h3>
                  <p>
                    {formatDistanceToNow(new Date(selectedReport.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedReport(null)}
                >
                  Κλείσιμο
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </MainLayout>
  );
};

export default Dashboard;
