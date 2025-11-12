import { useState } from 'react';
import { Plus, Search, Filter, Settings, Users, BarChart3, Play, Pause, Archive, Trash2, ExternalLink, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../../../context/index";
import { Link } from 'react-router-dom';
import { 
  useGetOrganizationPrograms, 
  usePublishProgram, 
  usePauseProgram, 
  useResumeProgram,
  useArchiveProgram,
  useDeleteProgram 
} from '@/api/programs';
import OrganizerLayout from '@/components/OrganizationLayout';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const ORGPrograms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);

  const { user } = useAuth();
  const isOrganizer = user?.role === 'ORGANIZATION';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useGetOrganizationPrograms(page);
  const publishProgram = usePublishProgram();
  const pauseProgram = usePauseProgram();
  const resumeProgram = useResumeProgram();
  const archiveProgram = useArchiveProgram();
  const deleteProgram = useDeleteProgram();

  // Status badge styling
  const getStatusStyle = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      paused: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    };
    return styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Program actions
  const handleProgramAction = async (action, programId) => {
    try {
      switch (action) {
        case 'publish':
          await publishProgram.mutateAsync(programId);
          queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
          toast({
            title: 'Success',
            description: 'Program published successfully',
          });
          break;
        case 'pause':
          await pauseProgram.mutateAsync(programId);
          queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
          toast({
            title: 'Success',
            description: 'Program paused successfully',
          });
          break;
        case 'resume':
          await resumeProgram.mutateAsync(programId);
          queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
          toast({
            title: 'Success',
            description: 'Program resumed successfully',
          });
          break;
        case 'archive':
          await archiveProgram.mutateAsync(programId);
          queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
          toast({
            title: 'Success',
            description: 'Program archived successfully',
          });
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
            await deleteProgram.mutateAsync(programId);
            queryClient.invalidateQueries({ queryKey: ['organization-programs'] });
            toast({
              title: 'Success',
              description: 'Program deleted successfully',
            });
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

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && (!data?.meta || newPage <= data.meta.totalPages)) {
      setPage(newPage);
    }
  };

  // Filter programs
  const filteredPrograms = (data?.programs || []).filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.organization?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || program.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Loading state
  if (!user?.id || !isOrganizer || isLoading) {
    return (
      <OrganizerLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="bg-gray-200 w-full h-64" />
            ))}
          </div>
        </div>
      </OrganizerLayout>
    );
  }

  // Error state
  if (error || !isOrganizer) {
    return (
      <OrganizerLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600">
            {!isOrganizer ? 'Access Denied' : 'Error loading programs'}
          </h2>
          <p className="text-slate-600 mt-2">
            {!isOrganizer 
              ? 'This page is only accessible to organization members.' 
              : error?.message || 'Something went wrong. Please try again.'
            }
          </p>
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Programs Management</h1>
            <p className="text-slate-600 mt-2">
              Manage your organization's bug bounty programs and track their performance.
            </p>
          </div>
          <Link to="/organization/programs/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      {program.logo ? (
                        <img 
                          src={program.logo} 
                          alt="Program logo"
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      ) : (
                        <span className="text-lg">🛡️</span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{program.title}</CardTitle>
                      <p className="text-sm text-slate-600">{program.websiteName}</p>
                    </div>
                  </div>
                  <Badge className={getStatusStyle(program.status)}>
                    {program.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2">
                  {program.description}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <Users className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                    <div className="font-medium">{program._count?.participants || 0}</div>
                    <div className="text-slate-500 text-xs">Participants</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <BarChart3 className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <div className="font-medium">{program._count?.submissions || 0}</div>
                    <div className="text-slate-500 text-xs">Submissions</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded">
                    <ExternalLink className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                    <div className="font-medium">{program._count?.reports || 0}</div>
                    <div className="text-slate-500 text-xs">Reports</div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {/* View Button */}
                  <Link to={`/organization/programs/${program.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" title="View program details">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  
                  {/* Edit Button */}
                  <Link to={`/organization/programs/${program.id}/edit`}>
                    <Button 
                      size="sm"
                      variant="outline"
                      title="Edit program"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  {/* Status Action Buttons */}
                  {program.status === 'draft' && (
                    <Button 
                      size="sm"
                      onClick={() => handleProgramAction('publish', program.id)}
                      disabled={publishProgram.isPending}
                      title="Publish program"
                    >
                      {publishProgram.isPending ? (
                        <span className="h-4 w-4 animate-spin">⏳</span>
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  
                  {program.status === 'active' && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleProgramAction('pause', program.id)}
                      disabled={pauseProgram.isPending}
                      title="Pause program"
                    >
                      {pauseProgram.isPending ? (
                        <span className="h-4 w-4 animate-spin">⏳</span>
                      ) : (
                        <Pause className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  
                  {program.status === 'paused' && (
                    <Button 
                      size="sm"
                      onClick={() => handleProgramAction('resume', program.id)}
                      disabled={resumeProgram.isPending}
                      title="Resume program"
                    >
                      {resumeProgram.isPending ? (
                        <span className="h-4 w-4 animate-spin">⏳</span>
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  
                  {/* Delete Button - only for draft/paused */}
                  {['paused', 'draft'].includes(program.status) && (
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => handleProgramAction('delete', program.id)}
                      disabled={deleteProgram.isPending}
                      title="Delete program"
                    >
                      {deleteProgram.isPending ? (
                        <span className="h-4 w-4 animate-spin">⏳</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm text-slate-600">
              Page {page} of {data.meta.totalPages}
            </span>
            <Button 
              variant="outline" 
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= data.meta.totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredPrograms.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-lg font-medium text-slate-900">No programs found</h3>
            <p className="text-slate-600 mt-2 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search terms or filters.' 
                : 'Get started by creating your first bug bounty program.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Link to="/organization/programs/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Program
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </OrganizerLayout>
  );
};

export default ORGPrograms;