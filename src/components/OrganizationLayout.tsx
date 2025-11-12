import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Home,
  FileText,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Shield,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context";
import VerificationBanner from "@/components/VerificationBanner";

interface OrganizationLayoutProps {
  children: ReactNode;
}

const OrganizationLayout = ({ children }: OrganizationLayoutProps) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

    const onHandleSubmit = async () => {
    try {
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/organization/dashboard", icon: Home },
    { name: "Programs", href: "/organization/programs", icon: Building2 },
    { name: "Create Program", href: "/organization/programs/create", icon: Plus },
    { name: "Reports", href: "/organization/reports", icon: FileText },
    { name: "Researchers", href: "/organization/researchers", icon: Users },
    { name: "Verification", href: "/organization/verification-status", icon: Shield },
    { name: "Analytics", href: "/organization/analytics", icon: BarChart3 },
    { name: "Settings", href: "/organization/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-['Inter',sans-serif]">
      {/* Floating Sidebar */}
      <div
        className={`fixed left-4 top-4 bottom-4 z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-72"
        }`}
      >
        <div className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-purple-500/10 dark:shadow-indigo-500/10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="relative">
                  <Building2 className="h-8 w-8 text-purple-600 dark:text-indigo-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full animate-pulse"></div>
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Sheyna Vault
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <Menu className="h-4 w-4 cursor-pointer" />
              ) : (
                <X className="h-4 w-4 cursor-pointer" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:scale-105"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"} ${
                    isActive(item.href)
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-indigo-400"
                  }`}
                />
                {!isCollapsed && (
                  <span className="transition-all duration-200">
                    {item.name}
                  </span>
                )}
                {isActive(item.href) && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <Button
              variant="ghost"
              onClick={toggleDarkMode}
              className={`w-full justify-start text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer ${
                isCollapsed ? "px-3" : ""
              }`}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-4 w-4 cursor-pointer" />
              ) : (
                <Moon className="h-4 w-4 cursor-pointer" />
              )}
              {!isCollapsed && (
                <span className="ml-3">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={onHandleSubmit}
              className={`w-full justify-start text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl cursor-pointer ${
                isCollapsed ? "px-3" : ""
              }`}
              title="Logout"
            >
              <LogOut className="h-4 w-4 cursor-pointer" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-24" : "ml-80"
        } mr-4`}
      >
        <main className="p-8 min-h-screen">
          <VerificationBanner />
          {children}
        </main>
      </div>
    </div>
  );
};

export default OrganizationLayout;