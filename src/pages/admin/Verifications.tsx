import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Loader2, FileText, ExternalLink, Building } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useGetPendingVerifications, useApproveOrganization, useRejectOrganization } from '@/api/admin';
import { useToast } from '@/hooks/use-toast';
import { ErrorHandler } from '@/utils/errorHandler';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const AdminVerifications = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  const { data, isLoading, error } = useGetPendingVerifications();
  const approveOrganizationMutation = useApproveOrganization();
  const rejectOrganizationMutation = useRejectOrganization();

  const handleApprove = async () => {
    if (!selectedOrganization) return;

    try {
      await approveOrganizationMutation.mutateAsync({
        id: selectedOrganization.id,
        notes: notes || undefined,
      });
      toast({
        title: 'Success',
        description: 'Organization has been approved',
        variant: 'default',
      });
      setActionType(null);
      setSelectedOrganization(null);
      setNotes('');
    } catch (error: any) {
      ErrorHandler.handleApiError(error, 'Failed to approve organization');
    }
  };

  const handleReject = async () => {
    if (!selectedOrganization || !reason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      await rejectOrganizationMutation.mutateAsync({
        id: selectedOrganization.id,
        reason,
      });
      toast({
        title: 'Success',
        description: 'Organization has been rejected',
        variant: 'default',
      });
      setActionType(null);
      setSelectedOrganization(null);
      setReason('');
    } catch (error: any) {
      ErrorHandler.handleApiError(error, 'Failed to reject organization');
    }
  };

  const openDocumentViewer = (documentUrl: string) => {
    window.open(documentUrl, '_blank');
  };

  const organizations = data?.data || [];

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
          Error loading verifications: {error.message}
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
            Organization Verifications
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Review and approve pending organization verification requests
          </p>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                  Pending Verifications
                </p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                  {organizations.length}
                </p>
              </div>
              <Building className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* Verifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Organizations</CardTitle>
            <CardDescription>
              Review organization details and verification documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No pending verifications at this time
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org: any) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {org.logo && (
                            <img
                              src={org.logo}
                              alt={org.name}
                              className="h-8 w-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <div>{org.name}</div>
                            {org.industry && (
                              <div className="text-xs text-slate-500">
                                {org.industry}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{org.user?.email}</div>
                          {org.user?.username && (
                            <div className="text-slate-500">
                              @{org.user.username}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {org.website ? (
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <span className="truncate max-w-[150px]">
                              {org.website}
                            </span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {org.verificationDocuments &&
                        Array.isArray(org.verificationDocuments) &&
                        org.verificationDocuments.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {org.verificationDocuments.map(
                              (doc: string, index: number) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDocumentViewer(doc)}
                                  className="text-blue-600 hover:text-blue-700 justify-start"
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  Document {index + 1}
                                </Button>
                              )
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-slate-500">
                            No documents
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(org.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => {
                              setSelectedOrganization(org);
                              setActionType('approve');
                            }}
                            disabled={
                              approveOrganizationMutation.isPending ||
                              rejectOrganizationMutation.isPending
                            }
                            title="Approve Organization"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setSelectedOrganization(org);
                              setActionType('reject');
                            }}
                            disabled={
                              approveOrganizationMutation.isPending ||
                              rejectOrganizationMutation.isPending
                            }
                            title="Reject Organization"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <AlertDialog
        open={actionType === 'approve'}
        onOpenChange={(open) => !open && setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {selectedOrganization?.name}?
              This will activate their account and allow them to create public
              programs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this approval..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveOrganizationMutation.isPending ? (
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

      {/* Reject Dialog */}
      <AlertDialog
        open={actionType === 'reject'}
        onOpenChange={(open) => !open && setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting {selectedOrganization?.name}.
              This will be sent to the organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Explain why this organization is being rejected..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectOrganizationMutation.isPending ? (
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
    </AdminLayout>
  );
};

export default AdminVerifications;
