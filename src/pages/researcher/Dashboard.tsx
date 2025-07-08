import { Shield, Bug, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ResearcherLayout from "@/components/ResearcherLayout"
import { useGetProfile } from "@/api/profile"
import { useAuth } from "../../context/index"
import { ResearcherUser } from "../../types/user" 


const ResearcherDashboard = () => {
  const { user } = useAuth();
  
  // Debug logging
  console.log('User from auth:', user);
  
  const isResearcher = user?.role === 'RESEARCHER';
  
  const { data: profile, isLoading, error } = useGetProfile({
    enabled: !!user?.id && isResearcher
  });

  // Loading state
  if (!user?.id || !isResearcher || isLoading) {
    return (
      <ResearcherLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-24"></div>
              </div>
            ))}
          </div>
        </div>
      </ResearcherLayout>
    );
  }

  if (error || !isResearcher) {
    return (
      <ResearcherLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            {!isResearcher ? 'Access Denied' : 'Error loading profile'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            {!isResearcher 
              ? 'This dashboard is only accessible to researchers.' 
              : error?.message || 'Something went wrong. Please try again.'
            }
          </p>
        </div>
      </ResearcherLayout>
    );
  }

  const researcherUser = user as ResearcherUser;

  const displayName = `${researcherUser.firstName} ${researcherUser.lastName}`;
  const userInitials = `${researcherUser.firstName[0]}${researcherUser.lastName[0]}`;
  
  // Stats data
  const stats = [
    {
      title: "Reports Submitted",
      value: profile?.reportsSubmitted || "0",
      icon: Bug,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Rewards",
      value: profile?.totalRewards || "$0",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Current Rank",
      value: profile?.currentRank || "#--",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Reputation Score",
      value: profile?.reputationScore || "0",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  const recentReports = profile?.recentReports || [];

  const getStatusColor = (status) => {
    const colors = {
      "Open": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      "Triaged": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "Resolved": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "Rejected": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const getSeverityColor = (severity) => {
    const colors = {
      "Critical": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      "High": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      "Medium": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      "Low": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    };
    return colors[severity] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  return (
    <ResearcherLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Welcome back, {researcherUser.username}! Here's your security research overview.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar} alt={displayName} />
                <AvatarFallback className="text-lg font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {displayName}
                  </h2>
                  {profile?.verified && <Shield className="h-5 w-5 text-blue-600 fill-current" />}
                </div>
                <p className="text-slate-600 dark:text-slate-300">@{researcherUser.username}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Security Researcher
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {report.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Submitted on {report.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-300">No recent reports found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ResearcherLayout>
  );
};

export default ResearcherDashboard;