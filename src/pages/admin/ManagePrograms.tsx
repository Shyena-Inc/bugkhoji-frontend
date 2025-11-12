
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, XCircle, Loader2, Pause } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useGetAllPrograms, useApproveProgram, useRejectProgram, useSuspendProgram } from '@/api/admin';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ManagePrograms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | null>(null);
  const { toast } = useToast();

  const { data, isLoading, error } = useGetAllPrograms(page, {
    search: searchTerm || undefined,
  });

  const approveProgramMutation = useApproveProgram();
  const rejectProgramMutation = useRejectProgram();
  const suspendProgramMutation = useSuspendProgram();

  const handleApproveProgram = async () => {
    if (!selectedProgram) return;
    
    try {
      await approveProgramMutation.mutateAsync(selectedProgram.id);
      toast({
        title: 'Success',
        description: 'Program has been approved',
        variant: 'default',
      });
      setActionType(null);
      setSelectedProgram(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to approve program',
        variant: 'destructive',
      });
    }
  };

  const handleRejectProgram = async () => {
    if (!selectedProgram) return;
    
    try {
      await rejectProgramMutation.mutateAsync({ id: selectedProgram.id, reason: 'Admin rejection' });
      toast({
        title: 'Success',
        description: 'Program has been rejected',
        variant: 'default',
      });
      setActionType(null);
      setSelectedProgram(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to reject program',
        variant: 'destructive',
      });
    }
  };

  const handleSuspendProgram = async () => {
    if (!selectedProgram) return;
    
    try {
      await suspendProgramMutation.mutateAsync({ id: selectedProgram.id, reason: 'Admin suspension' });
      toast({
        title: 'Success',
        description: 'Program has been suspended',
        variant: 'default',
      });
      setActionType(null);
      setSelectedProgram(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to suspend program',
        variant: 'destructive',
      });
    }
  };

  const programs = data?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'DRAFT':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Draft</Badge>;
      case 'PAUSED':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Paused</Badge>;
      case 'CLOSED':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center text-red-600">
          Error loading programs: {error.message}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
            Manage Programs
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Oversee vulnerability disclosure programs on the platform
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search programs by name or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programs.map((program: any) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{program.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {program.organization?.name || 'Unknown Organization'}
                    </CardDescription>
                  </div>
                  {getStatusBadge(program.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Reports</p>
                    <p className="font-semibold text-lg">{program._count?.reports || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Participants</p>
                    <p className="font-semibold text-lg">{program._count?.participants || 0}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Description</p>
                  <p className="text-sm line-clamp-2">{program.description || 'No description'}</p>
                </div>

                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Created: {new Date(program.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t flex-wrap">
                  {program.status === 'DRAFT' && (
                    <>
                      <Button 
                        size="sm" 
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 cursor-pointer"
                        onClick={() => {
                          setSelectedProgram(program);
                          setActionType('approve');
                        }}
                        title="Approve program"
                      >
                        <CheckCircle className="h-4 w-4 cursor-pointer" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                        onClick={() => {
                          setSelectedProgram(program);
                          setActionType('reject');
                        }}
                        title="Reject program"
                      >
                        <XCircle className="h-4 w-4 cursor-pointer" />
                        Reject
                      </Button>
                    </>
                  )}
                  {program.status === 'ACTIVE' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer"
                      onClick={() => {
                        setSelectedProgram(program);
                        setActionType('suspend');
                      }}
                      title="Suspend program"
                    >
                      <Pause className="h-4 w-4 cursor-pointer" />
                      Suspend
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {programs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">No programs found matching your search.</p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {data?.pagination && programs.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {programs.length} of {data.pagination.total} programs
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={actionType === 'approve'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve "{selectedProgram?.title}"? This will make it visible to researchers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveProgram}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveProgramMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={actionType === 'reject'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject "{selectedProgram?.title}"? This action will close the program.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectProgram}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectProgramMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend Confirmation Dialog */}
      <AlertDialog open={actionType === 'suspend'} onOpenChange={(open) => !open && setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend "{selectedProgram?.title}"? This will pause the program temporarily.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspendProgram}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {suspendProgramMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suspending...
                </>
              ) : (
                'Suspend'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ManagePrograms;
