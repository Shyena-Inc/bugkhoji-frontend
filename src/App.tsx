
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import Login from "./pages/Login";
import ResearcherDashboard from "./pages/researcher/Dashboard";
import Programs from "./pages/researcher/Programs";
import Reports from "./pages/researcher/Reports";
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
import ResearcherLoginPage from "./pages/login/ResearcherLogin";
import Provider from "./Providers";

const App = () => (
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
          <Route path="/login/:role" element={<Login />} />
          <Route path="/researcher/register" element={<ResearcherRegisterPage />} />
          <Route path="/researcher/login" element={<ResearcherLoginPage />} />
          <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
          <Route path="/researcher/programs" element={<Programs />} />
          <Route path="/researcher/reports" element={<Reports />} />
          <Route path="/researcher/submit" element={<SubmitReport />} />
          <Route path="/researcher/payments" element={<Payments />} />
          <Route path="/researcher/leaderboard" element={<Leaderboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-programs" element={<ManagePrograms />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/site-settings" element={<SiteSettings />} />
          <Route path="/organization/register" element={<OrganizationRegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </TooltipProvider>
  </Provider>
);

export default App;
