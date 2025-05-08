
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ReportForm, ReportData } from "@/components/stray/ReportForm";
import { useAuth } from "@/contexts/AuthContext";

const ReportPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // If still loading or not authenticated, show nothing
  if (loading || !user) {
    return null;
  }

  const handleReportComplete = (reportData: ReportData) => {
    navigate("/dashboard");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <ReportForm onReportComplete={handleReportComplete} />
      </div>
    </MainLayout>
  );
};

export default ReportPage;
