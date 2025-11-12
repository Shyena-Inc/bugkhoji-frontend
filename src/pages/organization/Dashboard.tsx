import { Building2, Users, FileText, TrendingUp, Shield, AlertTriangle, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import OrganizationLayout from "@/components/OrganizationLayout";
import { useOrganizationProfile } from "@/api/profile";
import { useAuth } from "../../context/index";
import { useGetOrganizationPrograms } from "@/api/programs";

// Types
interface Program {
  id: string;
  name?: string;
  title?: string;
  status: string;
  createdAt?: string;
  created_at?: string;
  reportsCount?: number;
  reports_count?: number;
  _count?: { reports?: number };
  bountyRange?: string;
  bounty_range?: string;
  maxReward?: number;
  totalPaid?: number;
  total_paid?: string;
  activeResearchers?: number;
  researchers_count?: number;
}

interface OrganizationData {
  name: string;
  email: string;
  website: string;
  description: string;
  logo?: string;
  verified: boolean;
  verificationStatus: string;
  id?: string;
}

interface Stats {
  totalPrograms: number;
  activePrograms: number;
  totalReports: number;
  totalPaid: number;
  activeResearchers: number;
}

// Constants
const STATUS_COLORS = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  paused: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  closed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
};

// Utility Functions
const getOrganizationInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status.toLowerCase()] || STATUS_COLORS.default;
};

const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString()}`;
};

const formatDate = (date: string | undefined): string => {
  if (!date) return 'Unknown';
  return new Date(date).toLocaleDateString();
};

const safeParseFloat = (value: string | number | undefined): number => {
  if (typeof value === 'number') return value;
  return parseFloat(value || '0') || 0;
};

// Components
const LoadingState = () => (
  <OrganizationLayout>
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-24" />
          </div>
        ))}
      </div>
    </div>
  </OrganizationLayout>
);

const ErrorState = ({ title, message }: { title: string; message: string }) => (
  <OrganizationLayout>
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
        {title}
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mt-2">
        {message}
      </p>
    </div>
  </OrganizationLayout>
);

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickActionCard = ({ to, icon: Icon, title, description, iconColor }) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = to}>
    <CardContent className="pt-6">
      <div className="text-center">
        <Icon className={`h-8 w-8 ${iconColor} mx-auto mb-2`} />
        <h3 className="font-medium text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          {description}
        </p>
      </div>
    </CardContent>
  </Card>
);

// Main Component
const OrganizationDashboard = () => {
  const { user } = useAuth();
  const isOrganization = user?.role === 'ORGANIZATION';
  
  const { data: profileResponse, isLoading: profileLoading, error: profileError } = useOrganizationProfile({
    enabled: !!user?.id && isOrganization
  });

  const { data: programsResponse, error: programsError } = useGetOrganizationPrograms(1);

  // Loading state
  if (profileLoading) return <LoadingState />;

  // Authentication checks
  if (!user?.id) {
    return <ErrorState title="Authentication Required" message="Please log in to access your organization dashboard." />;
  }

  if (!isOrganization) {
    return <ErrorState title="Access Denied" message="This dashboard is only accessible to organizations." />;
  }

  // Data processing
  const profile = profileResponse?.data || profileResponse;
  const programsData = programsResponse?.data || programsResponse;
  const programs: Program[] = programsData?.programs || programsData || [];

  const organizationData: OrganizationData = {
    name: profile?.name || user?.organizationName || 'Organization',
    email: profile?.user?.email || user?.email || 'Not available',
    website: profile?.website || 'Not provided',
    description: profile?.description || 'No description available',
    logo: profile?.logo,
    verified: profile?.verified || false,
    verificationStatus: 'pending',
    id: profile?.id
  };

  // Statistics calculation
  const calculateStats = (): Stats => {
    if (programs.length === 0) {
      const profileCounts = profile?._count || {};
      return {
        totalPrograms: profileCounts.programs || 0,
        activePrograms: 0,
        totalReports: 0,
        totalPaid: 0,
        activeResearchers: 0
      };
    }

    const activePrograms = programs.filter(program => 
      ['active', 'ACTIVE'].includes(program.status)
    ).length;

    const totalReports = programs.reduce((sum, program) => 
      sum + (program.reportsCount || program.reports_count || program._count?.reports || 0), 0
    );

    const totalPaid = programs.reduce((sum, program) => 
      sum + safeParseFloat(program.totalPaid || program.total_paid), 0
    );

    const activeResearchers = programs.reduce((sum, program) => 
      sum + (program.activeResearchers || program.researchers_count || 0), 0
    );

    return {
      totalPrograms: programs.length,
      activePrograms,
      totalReports,
      totalPaid,
      activeResearchers
    };
  };

  const stats = calculateStats();
  const organizationInitials = getOrganizationInitials(organizationData.name);
  const isVerified = organizationData.verified;
  const verificationPending = organizationData.verificationStatus === 'pending';

  // Configuration arrays
  const statsCards = [
    {
      title: "Total Programs",
      value: stats.totalPrograms.toString(),
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Active Programs",
      value: stats.activePrograms.toString(),
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Total Reports",
      value: stats.totalReports.toString(),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Total Paid",
      value: formatCurrency(stats.totalPaid),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  const recentPrograms = programs.slice(0, 5).map(program => ({
    id: program.id,
    name: program.name || program.title || 'Untitled Program',
    date: formatDate(program.createdAt || program.created_at),
    status: program.status || 'Draft',
    reportsCount: program.reportsCount || program.reports_count || program._count?.reports || 0,
    bountyRange: program.bountyRange || program.bounty_range || 
      (program.maxReward ? `Rs0 - ${formatCurrency(program.maxReward)}` : 'Rs0 - Rs1,000')
  }));

  const quickActions = [
    {
      to: "/organization/programs/create",
      icon: Building2,
      title: "Create Program",
      description: "Launch a new bug bounty program",
      iconColor: "text-blue-600"
    },
    {
      to: "/organization/reports",
      icon: FileText,
      title: "View Reports",
      description: "Review submitted vulnerability reports",
      iconColor: "text-green-600"
    },
    {
      to: "/organization/researchers",
      icon: Users,
      title: "Researchers",
      description: "Connect with security researchers",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Organization Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Welcome back! Manage your bug bounty programs and security research initiatives.
          </p>
        </div>

        {/* Verification Status Alert */}
        {!isVerified && (
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {verificationPending 
                ? "Your organization verification is pending. You'll have full access once verified."
                : "Please complete your organization verification to unlock all features and build trust with researchers."
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alerts */}
        {profileError && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error loading profile: {profileError?.message || 'Unknown error'}. Using fallback data.
            </AlertDescription>
          </Alert>
        )}

        {programsError && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to load programs data: {programsError?.message || 'API endpoint may not be configured'}.
            </AlertDescription>
          </Alert>
        )}

        {/* Organization Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={organizationData.logo} alt={organizationData.name} />
                <AvatarFallback className="text-lg font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                  {organizationInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {organizationData.name}
                  </h2>
                  {isVerified && <Shield className="h-5 w-5 text-blue-600 fill-current" />}
                  {verificationPending && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Verification Pending
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300">{organizationData.website}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200 max-w-2xl">
                  {organizationData.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {organizationData.email}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = "/organization/settings"}>
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Recent Programs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bug Bounty Programs</CardTitle>
            <Button size="sm" onClick={() => window.location.href = "/organization/programs/create"}>
              <Plus className="h-4 w-4 mr-2" />
              Create Program
            </Button>
          </CardHeader>
          <CardContent>
            {recentPrograms.length > 0 ? (
              <div className="space-y-4">
                {recentPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {program.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Created on {program.date} • {program.reportsCount} reports • {program.bountyRange}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(program.status)}`}>
                        {program.status}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => window.location.href = `/organization/programs/${program.id}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {programs.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" onClick={() => window.location.href = "/organization/programs"}>
                      View All Programs ({stats.totalPrograms})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-300">No bug bounty programs yet.</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Create your first program to start receiving security reports!
                </p>
                <Button onClick={() => window.location.href = "/organization/programs/create"}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Program
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboard;