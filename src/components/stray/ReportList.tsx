
import { ReportData } from "./ReportForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPinIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ReportListProps = {
  reports: ReportData[];
  onViewDetails: (report: ReportData) => void;
};

export function ReportList({ reports, onViewDetails }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Δεν έγιναν αναφορές ακόμη</h3>
        <p className="text-muted-foreground">Οι αναφορές σου θα εμφανιστουν εδώ</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            <div className="aspect-square md:aspect-auto md:h-full">
              <img
                src={report.imageUrl}
                alt={`${report.type} - ${report.id}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      className={
                        report.urgency === "Υψηλή"
                          ? "bg-red-500"
                          : report.urgency === "Μεσαία"
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }
                    >
                      {report.urgency} Priority
                    </Badge>
                    <h3 className="text-lg font-bold mt-2">{report.type}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      <span>{report.location.address}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(report.timestamp), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 mb-3 text-muted-foreground">
                  {report.description || "No description provided"}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {report.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button
                  onClick={() => onViewDetails(report)}
                  variant="secondary"
                  className="w-full mt-2 bg-teal-600 text-white hover:bg-teal-700"
                >
                  Εμφάνισε λεπτομέρειες
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
