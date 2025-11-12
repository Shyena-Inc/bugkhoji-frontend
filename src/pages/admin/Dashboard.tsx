import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Building,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminDashboard, useGetUserStats } from "@/api/admin";

const AdminDashboard = () => {
  const { data: dashboardData, isLoading: dashboardLoading } = useAdminDashboard();
  const { data: userStatsData, isLoading: userStatsLoading } = useGetUserStats();

  const isLoading = dashboardLoading || userStatsLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </AdminLayout>
    );
  }

  const stats = {
    totalResearchers: userStatsData?.data?.researchers || 0,
    totalOrganizations: userStatsData?.data?.organizations || 0,
    totalReports: dashboardData?.data?.reports?.total || 0,
    openReports: dashboardData?.data?.reports?.pending || 0,
    activeUsers: userStatsData?.data?.activeUsers || 0,
    totalUsers: userStatsData?.data?.totalUsers || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Monitor platform activity and manage Shyena-Vault operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Total Researchers
                  </p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {stats.totalResearchers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                    Organizations
                  </p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {stats.totalOrganizations}
                  </p>
                </div>
                <Building className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Total Reports
                  </p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {stats.totalReports.toLocaleString()}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                    Open Reports
                  </p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {stats.openReports}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Pending Reports
                  </p>
                  <p className="text-2xl font-bold">{stats.openReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Inactive Users
                  </p>
                  <p className="text-2xl font-bold">
                    {(stats.totalUsers - stats.activeUsers).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
