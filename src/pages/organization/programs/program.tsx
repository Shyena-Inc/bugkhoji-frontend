import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  BarChart3, 
  FileText, 
  Calendar,
  DollarSign,
  Globe,
  Play,
  Pause,
  Archive,
  Trash2,
  UserPlus,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from "../../../context/index";
import { 
  useGetOrganizationProgram,
  useGetProgramStats,
  useGetProgramParticipants,
  usePublishProgram,
  usePauseProgram,
  useResumeProgram,
  useArchiveProgram,
  useDeleteProgram,
  useRemoveParticipant,
  useUploadProgramLogoFromUrl
} from '@/api/programs';
import OrganizerLayout from '@/components/OrganizationLayout';
import LogoUpload from '@/components/LogoUpload';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const Program = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [logoUrlInput, setLogoUrlInput] = useState<string>('');
  const [fetchingLogo, setFetchingLogo] = useState<boolean>(false);

  const { user } = useAuth();
  const isOrganizer = user?.role === 'ORGANIZATION';
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // API calls
  const { data: program, isLoading: programLoading, error: programError } = useGetOrganizationProgram(id!);
  const { data: stats, isLoading: statsLoading } = useGetProgramStats(id!);
  const { data: participants, isLoading: participantsLoading } = useGetProgramParticipants(id!);

  // Extract stats from program data since separate stats endpoint doesn't exist yet
  const actualStats = program ? {
    participants: program._count?.participants || 0,
    submissions: program._count?.submissions || 0,
    validReports: program._count?.reports || 0,
    totalRewards: 0 // This would need to be calculated on backend
  } : null;

  // Mutations
  const publishProgram = usePublishProgram();
  const pauseProgram = usePauseProgram();
  const resumeProgram = useResumeProgram();
  const archiveProgram = useArchiveProgram();
  const deleteProgram = useDeleteProgram();
  const removeParticipant = useRemoveParticipant();
  const uploadLogoFromUrl = useUploadProgramLogoFromUrl(id!);

  // Status badge styling
  const getStatusStyle = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      paused: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    };
    return styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Program actions
  const handleProgramAction = async (action: string, programId: string) => {
    try {
      switch (action) {
        case 'publish':
          await publishProgram.mutateAsync(programId);
          toast({
            title: 'Success',
            description: 'Program published successfully',
          });
          queryClient.invalidateQueries({ queryKey: ['organization-program', programId] });
          break;
        case 'pause':
          await pauseProgram.mutateAsync(programId);
          toast({
            title: 'Success',
            description: 'Program paused successfully',
          });
          queryClient.invalidateQueries({ queryKey: ['organization-program', programId] });
          break;
        case 'resume':
          await resumeProgram.mutateAsync(programId);
          toast({
            title: 'Success',
            description: 'Program resumed successfully',
          });
          queryClient.invalidateQueries({ queryKey: ['organization-program', programId] });
          break;
        case 'archive':
          await archiveProgram.mutateAsync(programId);
          toast({
            title: 'Success',
            description: 'Program archived successfully',
          });
          queryClient.invalidateQueries({ queryKey: ['organization-program', programId] });
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
            await deleteProgram.mutateAsync(programId);
            toast({
              title: 'Success',
              description: 'Program deleted successfully',
            });
            navigate('/organization/programs');
          }
          break;
      }
    } catch (error: any) {
      console.error('Program action failed:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || `Failed to ${action} program`,
        variant: 'destructive',
      });
    }
  };

  // Remove participant
  const handleRemoveParticipant = async (userId: string) => {
    if (confirm('Are you sure you want to remove this participant?')) {
      try {
        await removeParticipant.mutateAsync({ programId: id!, userId });
      } catch (error) {
        console.error('Failed to remove participant:', error);
      }
    }
  };

  // Fetch logo from URL
  const handleFetchLogoFromUrl = async () => {
    if (!logoUrlInput.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to fetch the logo",
        variant: "destructive"
      });
      return;
    }

    setFetchingLogo(true);
    try {
      await uploadLogoFromUrl.mutateAsync({ websiteUrl: logoUrlInput });
      toast({
        title: "Success",
        description: "Logo fetched successfully from website",
      });
      setLogoUrlInput('');
      // Refetch program data to show new logo
      queryClient.invalidateQueries({ queryKey: ['organization-program', id] });
    } catch (error: any) {
      toast({
        title: "Failed to Fetch Logo",
        description: error?.response?.data?.message || "Could not fetch logo from the website. Please upload manually.",
        variant: "destructive"
      });
    } finally {
      setFetchingLogo(false);
    }
  };

  // Handle logo upload success
  const handleLogoUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['organization-program', id] });
  };

  // Loading state
  if (!user?.id || !isOrganizer || programLoading) {
    return (
      <OrganizerLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="bg-gray-200 w-full h-32" />
            ))}
          </div>
        </div>
      </OrganizerLayout>
    );
  }

  // Error state
  if (programError || !isOrganizer || !program) {
    return (
      <OrganizerLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600">
            {!isOrganizer ? 'Access Denied' : 'Program Not Found'}
          </h2>
          <p className="text-slate-600 mt-2">
            {!isOrganizer 
              ? 'This page is only accessible to organization members.' 
              : 'The program you are looking for does not exist or has been deleted.'
            }
          </p>
          <Link to="/organization/programs" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Programs
            </Button>
          </Link>
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/organization/programs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                {program.logo ? (
                  <img 
                    src={program.logo} 
                    alt="Program logo"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                ) : (
                  <span className="text-xl">🛡️</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{program.title}</h1>
                <p className="text-slate-600">{program.websiteName}</p>
              </div>
              <Badge className={getStatusStyle(program.status)}>
                {program.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Status-based action buttons */}
            {program.status === 'draft' && (
              <Button 
                onClick={() => handleProgramAction('publish', program.id)}
                disabled={publishProgram.isPending}
              >
                <Play className="mr-2 h-4 w-4" />
                Publish
              </Button>
            )}
            
            {program.status === 'active' && (
              <Button 
                variant="outline"
                onClick={() => handleProgramAction('pause', program.id)}
                disabled={pauseProgram.isPending}
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
            
            {program.status === 'paused' && (
              <Button 
                onClick={() => handleProgramAction('resume', program.id)}
                disabled={resumeProgram.isPending}
              >
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
            )}
            
            <Link to={`/organization/programs/${program.id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            
            {['paused', 'draft'].includes(program.status) && (
              <Button 
                variant="destructive"
                onClick={() => handleProgramAction('delete', program.id)}
                disabled={deleteProgram.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {programLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  actualStats?.participants || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Active researchers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {programLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  actualStats?.submissions || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total reports submitted
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valid Reports</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {programLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  actualStats?.validReports || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted vulnerabilities
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {programLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  `${actualStats?.totalRewards || '0'}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Paid to researchers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Program Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Program Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-slate-600 mb-2">Description</h4>
                    <p className="text-slate-900">{program.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-slate-600 mb-1">Website</h4>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <a 
                          href={program.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {program.websiteName}
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-slate-600 mb-1">Created</h4>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>
                          {program.createdAt ? new Date(program.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {program.scope && (
                    <div>
                      <h4 className="font-medium text-sm text-slate-600 mb-2">Scope</h4>
                      <div className="bg-slate-50 p-3 rounded-md">
                        <pre className="text-sm text-slate-700 whitespace-pre-wrap">{program.scope}</pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Invite researchers feature will be available soon",
                      });
                    }}
                    title="Invite researchers to this program"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Researchers
                  </Button>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Export reports feature will be available soon",
                      });
                    }}
                    title="Export program reports"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Reports
                  </Button>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Analytics dashboard will be available soon",
                      });
                    }}
                    title="View program analytics"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  
                  <Link to={`/programs/${program.id}`} target="_blank">
                    <Button className="w-full" variant="outline" title="Preview how this program appears to researchers">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Public Page
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statsLoading || programLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Program Participants</CardTitle>
                <Button
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "Invite researchers feature will be available soon",
                    });
                  }}
                  title="Invite researchers to this program"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Researchers
                </Button>
              </CardHeader>
              <CardContent>
                {participantsLoading || programLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : participants && participants.length > 0 ? (
                  <div className="space-y-4">
                    {participants.map((participant: any) => (
                      <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            {participant.user?.avatar ? (
                              <img 
                                src={participant.user.avatar} 
                                alt={participant.user.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {participant.user?.name?.charAt(0) || '?'}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{participant.user?.name || 'Unknown User'}</h4>
                            <p className="text-sm text-slate-600">{participant.user?.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right text-sm">
                            <div className="font-medium">{participant._count?.submissions || 0} submissions</div>
                            <div className="text-slate-600">
                              Joined {new Date(participant.joinedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRemoveParticipant(participant.userId)}
                            disabled={removeParticipant.isPending}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium text-slate-900">No participants yet</h3>
                    <p className="text-slate-600 mt-2">
                      Invite security researchers to start finding vulnerabilities.
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "Invite researchers feature will be available soon",
                        });
                      }}
                      title="Invite researchers to this program"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Researchers
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-900">No reports yet</h3>
                  <p className="text-slate-600 mt-2">
                    Reports will appear here once researchers start submitting vulnerabilities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Logo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Upload Program Logo</h4>
                  <LogoUpload
                    currentLogo={program.logo}
                    uploadEndpoint={`/api/v1/programs/${program.id}/logo`}
                    onUploadSuccess={handleLogoUploadSuccess}
                    fallbackText="P"
                    size="lg"
                  />
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-2">Fetch Logo from Website URL</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    We'll try to automatically fetch the logo from your website
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      placeholder="https://example.com"
                      disabled={fetchingLogo}
                    />
                    <Button
                      type="button"
                      onClick={handleFetchLogoFromUrl}
                      disabled={fetchingLogo || !logoUrlInput.trim()}
                    >
                      {fetchingLogo ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Fetching...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Fetch Logo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Edit Program Details</h4>
                    <p className="text-sm text-slate-600">Update program information and scope</p>
                  </div>
                  <Link to={`/organization/programs/${program.id}/edit`}>
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                </div>
                
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600">Archive Program</h4>
                      <p className="text-sm text-slate-600">Archive this program to stop accepting new submissions</p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => handleProgramAction('archive', program.id)}
                      disabled={archiveProgram.isPending || program.status === 'archived'}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </div>
                
                {['paused', 'draft'].includes(program.status) && (
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-600">Delete Program</h4>
                        <p className="text-sm text-slate-600">Permanently delete this program and all associated data</p>
                      </div>
                      <Button 
                        variant="destructive"
                        onClick={() => handleProgramAction('delete', program.id)}
                        disabled={deleteProgram.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </OrganizerLayout>
  );
};

export default Program;