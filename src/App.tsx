import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import ResearcherDashboard from "./pages/researcher/Dashboard";
import Programs from "./pages/researcher/programs/Programs";
import ProgramDetail from "./pages/researcher/programs/program";
import Reports from "./pages/researcher/reports/Reports";
import SubmitReport from "./pages/researcher/SubmitReport";
import Payments from "./pages/researcher/Payments";
import Leaderboard from "./pages/researcher/Leaderboard";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePrograms from "./pages/admin/ManagePrograms";
import AdminReports from "./pages/admin/Reports";
import AdminSupport from "./pages/admin/Support";
import SiteSettings from "./pages/admin/SiteSettings";
import NotFound from "./pages/NotFound";
import ResearcherRegisterPage from "./pages/register/reseacherSignup";
import OrganizationRegisterPage from "./pages/register/organizationSignup";
import ResearcherSignupWithOTP from "./pages/register/ResearcherSignupWithOTP";
import OrganizationSignupWithOTP from "./pages/register/OrganizationSignupWithOTP";
import ResearcherLoginPage from "./pages/login/ResearcherLogin";
import OrganizationLoginPage from "./pages/login/OrganizationLogin";
import AdminLoginPage from "./pages/login/AdminLogin";
import OrganizationVerificationPage from "./pages/register/OrganizationVerificationPage";
import OrganizationVerificationPendingPage from "./pages/register/OrganizationVerificationPendingPage";
import OrganizationDashboard from "./pages/organization/Dashboard";
import ORGPrograms from "./pages/organization/programs/programs";
import OrganizerReports from "./pages/organization/reports/reports";
import OrgProgram from "./pages/organization/programs/program";
import CreateProgram from "./pages/organization/programs/create";
import EditProgram from "./pages/organization/programs/edit";
import Provider from "./Providers";
import AuthGuard from "./guards/AuthGuard";
import LoginGuard from "./guards/LoginGuard";
import ReportDetail from "./pages/researcher/reports/report";
import ResearcherProfile from "./pages/researcher/Profile";
import OrganizationSettings from "./pages/organization/Settings";
import OrganizationResearchers from "./pages/organization/Researchers";
import OrganizationVerification from "./pages/organization/Verification";
import AdminPositions from "./pages/admin/Positions";
import AdminVerifications from "./pages/admin/Verifications";
import { endpoints } from "./utils/api";

const App = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("accessToken")) {
      rotateToken();
      sessionStorage.setItem("accessToken", "true");
    }
  }, []);

  const rotateToken = async () => {
    try {
      const response = await endpoints.auth.rotateToken;
      console.log("New token from backend:", response);
      localStorage.setItem("authToken", response);
    } catch (error) {
      console.error("Failed to rotate token:", error);
    }
  };

  return (
    <ErrorBoundary>
      <Provider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support" element={<Support />} />

          <Route element={<LoginGuard />}>
            <Route path="/register/researcher" element={<ResearcherSignupWithOTP />} />
            <Route path="/researcher/login" element={<ResearcherLoginPage />} />
            <Route path="/organization/register" element={<OrganizationSignupWithOTP />} />
            <Route path="/organization/verification" element={<OrganizationVerificationPage />} />
            <Route path="/organization/login" element={<OrganizationLoginPage />} />
            <Route path="/organization/verification-pending" element={<OrganizationVerificationPendingPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>

          <Route element={<AuthGuard />}>
            <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
            <Route path="/researcher/profile" element={<ResearcherProfile />} />
            <Route path="/researcher/programs" element={<Programs />} />
            <Route path="/researcher/programs/:id" element={<ProgramDetail />} />
            <Route path="/researcher/reports" element={<Reports />} />
            <Route path="/researcher/report/:reportId" element={<ReportDetail/>} />
            <Route path="/researcher/submit" element={<SubmitReport />} />
            <Route path="/researcher/payments" element={<Payments />} />
            <Route path="/researcher/leaderboard" element={<Leaderboard />} />
            
            <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
            <Route path="/organization/settings" element={<OrganizationSettings />} />
            <Route path="/organization/researchers" element={<OrganizationResearchers />} />
            <Route path="/organization/verification-status" element={<OrganizationVerification />} />
            <Route path="/organization/programs/create" element={<CreateProgram />} />
            <Route path="/organization/programs" element={<ORGPrograms />} />
            <Route path="/organization/programs/:id/edit" element={<EditProgram />} />
            <Route path="/organization/programs/:id" element={<OrgProgram />} />
            <Route path="/organization/reports" element={<OrganizerReports />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-programs" element={<ManagePrograms />} />
            <Route path="/admin/verifications" element={<AdminVerifications />} />
            <Route path="/admin/positions" element={<AdminPositions />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/support" element={<AdminSupport />} />
            <Route path="/admin/site-settings" element={<SiteSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </TooltipProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
