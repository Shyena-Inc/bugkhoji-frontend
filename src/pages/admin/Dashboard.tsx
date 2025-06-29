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
  TrendingUp,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  // Mock data
  const stats = {
    totalResearchers: 1247,
    totalOrganizations: 89,
    totalReports: 3456,
    openReports: 156,
    triagedReports: 89,
    resolvedReports: 3211,
  };

  const severityData = [
    { name: "Critical", value: 45, color: "#ef4444" },
    { name: "High", value: 123, color: "#f97316" },
    { name: "Medium", value: 234, color: "#eab308" },
    { name: "Low", value: 167, color: "#22c55e" },
    { name: "Info", value: 89, color: "#3b82f6" },
  ];

  const monthlyReports = [
    { month: "Jan", reports: 234 },
    { month: "Feb", reports: 267 },
    { month: "Mar", reports: 298 },
    { month: "Apr", reports: 334 },
    { month: "May", reports: 389 },
    { month: "Jun", reports: 445 },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New researcher registered",
      user: "john@example.com",
      time: "2 minutes ago",
    },
    {
      id: 2,
      action: "Critical vulnerability reported",
      program: "TechCorp Bug Bounty",
      time: "15 minutes ago",
    },
    {
      id: 3,
      action: "Report marked as resolved",
      reportId: "VUL-2024-001",
      time: "1 hour ago",
    },
    {
      id: 4,
      action: "New program created",
      program: "StartupX Security",
      time: "2 hours ago",
    },
    {
      id: 5,
      action: "User account suspended",
      user: "suspicious@domain.com",
      time: "3 hours ago",
    },
  ];

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

        {/* Report Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Resolved
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.resolvedReports.toLocaleString()}
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
                    Triaged
                  </p>
                  <p className="text-2xl font-bold">{stats.triagedReports}</p>
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
                    Open
                  </p>
                  <p className="text-2xl font-bold">{stats.openReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Severity Distribution</CardTitle>
              <CardDescription>
                Breakdown of reports by severity level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Reports</CardTitle>
              <CardDescription>
                Report submissions over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyReports}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest platform events and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {activity.user || activity.program || activity.id}
                    </p>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
