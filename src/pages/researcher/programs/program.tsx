import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft, 
  ExternalLink, 
  DollarSign, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  Building,
  Globe,
  Target,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResearcherLayout from '@/components/ResearcherLayout';
import { useGetAProgram, useLeavePrograms } from '@/api/programs';
import { useAuth } from "../../../context/index";
import { toast } from 'sonner';

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const { data: program, isLoading, error } = useGetAProgram(id);
  const leaveProgramMutation = useLeavePrograms(id);
console.log(program)
  const isResearcher = user?.role === 'RESEARCHER';

  // Helper function to get reward range from rewards object
  const getRewardRange = (rewards) => {
    if (!rewards) return { min: 0, max: 0 };
    
    const extractAmount = (range) => {
      if (!range) return 0;
      const matches = range.match(/\$(\d+)/g);
      return matches ? parseInt(matches[0].replace('$', '')) : 0;
    };
    
    const amounts = [];
    if (rewards.low) amounts.push(extractAmount(rewards.low));
    if (rewards.medium) amounts.push(extractAmount(rewards.medium));
    if (rewards.high) amounts.push(extractAmount(rewards.high));
    if (rewards.critical) amounts.push(extractAmount(rewards.critical));
    
    return {
      min: Math.min(...amounts) || 0,
      max: Math.max(...amounts) || 0
    };
  };

  // Helper function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  const handleJoinProgram = async () => {
    setIsJoining(true);
    try {
      // Simulate joining the program
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasJoined(true);
      toast.success('Successfully joined the program!');
    } catch (error) {
      toast.error('Failed to join program. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveProgram = async () => {
    try {
      const formData = new FormData();
      await leaveProgramMutation.mutateAsync(formData);
      setHasJoined(false);
      toast.success('Successfully left the program!');
    } catch (error) {
      toast.error('Failed to leave program. Please try again.');
    }
  };

  if (!user?.id || !isResearcher) {
    return (
      <ResearcherLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            This page is only accessible to researchers.
          </p>
        </div>
      </ResearcherLayout>
    );
  }

  if (isLoading) {
    return (
      <ResearcherLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </ResearcherLayout>
    );
  }

  if (error || !program) {
    return (
      <ResearcherLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Program Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            The program you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button 
            onClick={() => navigate('/researcher/programs')} 
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Programs
          </Button>
        </div>
      </ResearcherLayout>
    );
  }

  const rewardRange = getRewardRange(program.rewards);

  return (
    <ResearcherLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/researcher/programs')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Programs
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={getStatusBadgeClass(program.status)}
            >
              {program.status}
            </Badge>
          </div>
        </div>

        {/* Program Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🏢</div>
                <div>
                  <CardTitle className="text-2xl text-black\">{program.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Building className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">{program.organization?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">{program.websiteName}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 dark:text-green-400 text-lg font-semibold">
                  <DollarSign className="h-5 w-5 mr-1" />
                  ${rewardRange.min.toLocaleString()} - ${rewardRange.max.toLocaleString()}
                </div>
                <p className="text-sm text-slate-500 mt-1">Reward Range</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{program._count?.submissions || 0} submissions</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{program._count?.reports || 0} reports</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {program?.createdAt ? new Date(program.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {hasJoined ? (
                  <Button 
                    variant="destructive" 
                    onClick={handleLeaveProgram}
                    disabled={leaveProgramMutation.isPending}
                  >
                    {leaveProgramMutation.isPending ? 'Leaving...' : 'Leave Program'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleJoinProgram}
                    disabled={isJoining || program?.status?.toLowerCase() !== 'active'}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {isJoining ? 'Joining...' : 'Join Program'}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Status Alert */}
        {program && program.status?.toLowerCase() !== 'active' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This program is currently {program.status?.toLowerCase()}. You may not be able to submit reports at this time.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="scope">Scope</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Program Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {program.description || 'No description available for this program.'}
                    </p>
                    
                    {program.guidelines && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Guidelines</h4>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {program.guidelines}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scope">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Program Scope
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">In Scope</h4>
                        <div className="flex flex-wrap gap-2">
                          {program.scope && Array.isArray(program.scope) && program.scope.length > 0 ? (
                            program.scope.map((item, index) => (
                              <Badge key={index} variant="outline" className="text-sm">
                                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                                {item.trim()}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-slate-500 text-sm">No scope items defined</p>
                          )}
                        </div>
                      </div>
                      
                      {program.outOfScope && (
                        <div>
                          <h4 className="font-medium mb-3">Out of Scope</h4>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(program.outOfScope) ? (
                              program.outOfScope.map((item, index) => (
                                <Badge key={index} variant="outline" className="text-sm border-red-200">
                                  <AlertTriangle className="mr-1 h-3 w-3 text-red-500" />
                                  {item.trim()}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-slate-500 text-sm">No out-of-scope items defined</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Reward Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {program.rewards ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {program.rewards.low && (
                          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-blue-800 dark:text-blue-300">Low Severity</span>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                {program.rewards.low}
                              </Badge>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              Minor security issues with limited impact
                            </p>
                          </div>
                        )}
                        
                        {program.rewards.medium && (
                          <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-yellow-800 dark:text-yellow-300">Medium Severity</span>
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                {program.rewards.medium}
                              </Badge>
                            </div>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">
                              Moderate security vulnerabilities
                            </p>
                          </div>
                        )}

                        {program.rewards.high && (
                          <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-orange-800 dark:text-orange-300">High Severity</span>
                              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                                {program.rewards.high}
                              </Badge>
                            </div>
                            <p className="text-sm text-orange-600 dark:text-orange-400">
                              Significant security flaws with high impact
                            </p>
                          </div>
                        )}

                        {program.rewards.critical && (
                          <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-red-800 dark:text-red-300">Critical Severity</span>
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                {program.rewards.critical}
                              </Badge>
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400">
                              Critical vulnerabilities with severe impact
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-500">No reward information available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Program Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">General Rules</h4>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <li>• No social engineering or phishing attacks</li>
                          <li>• Do not access, modify, or delete data that doesn't belong to you</li>
                          <li>• Report vulnerabilities promptly and in good faith</li>
                          <li>• Do not publicly disclose vulnerabilities until they are fixed</li>
                          <li>• Follow responsible disclosure practices</li>
                        </ul>
                      </div>
                      
                      {program.rules && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Program-Specific Rules</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {program.rules}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                  <Badge className={getStatusBadgeClass(program.status)}>
                    {program.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Submissions</span>
                  <span className="font-medium">{program._count?.submissions || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Reports</span>
                  <span className="font-medium">{program._count?.reports || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Min Reward</span>
                  <span className="font-medium text-green-600">${rewardRange.min.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Max Reward</span>
                  <span className="font-medium text-green-600">${rewardRange.max.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{program.organization?.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {program.organization?.description || 'No description available'}
                    </p>
                  </div>
                  {program.organization?.website && (
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Have questions about this program? Contact the program team for assistance.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResearcherLayout>
  );
};

export default ProgramDetail;