import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Copy,
  ExternalLink,
  MoreVertical,
  Eye,
  MessageSquare,
  Flag,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../../../context/index";
import { Link } from 'react-router-dom';
import { 
  useGetAllReports,
  useGetReportsByProgram,
  useUpdateReport,
  useAddComment,
  useDeleteReport,
  usePublishReport,
  useAssignSeverity,
  useApproveReport,
  useRejectReport,
  useMarkDuplicate,
  useAssignReward
} from '@/api/reports';
import OrganizerLayout from '@/components/OrganizationLayout';

const OrganizerReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSeverityOpen, setIsSeverityOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');

  const { user } = useAuth();
  const isOrganizer = user?.role === 'ORGANIZATION';
  

// Add this detailed logging right after the useGetAllReports call
const { data: reportsData, isLoading, error } = useGetAllReports(page);

// Detailed structure logging
console.log('=== API RESPONSE DEBUG ===');
console.log('Full reportsData object:', reportsData);
console.log('reportsData keys:', reportsData ? Object.keys(reportsData) : 'No data');
console.log('reportsData type:', typeof reportsData);
console.log('Is reportsData an array?', Array.isArray(reportsData));
console.log('reportsData.reports:', reportsData?.reports);
console.log('reportsData.data:', reportsData?.data);
console.log('reportsData.items:', reportsData?.items);
console.log('reportsData.results:', reportsData?.results);
console.log('Error:', error);
console.log('Is Loading:', isLoading);
console.log('=== END DEBUG ===');

// Try different possible data structures
const getReportsArray = () => {
  if (!reportsData) return [];
  
  // Try different possible structures
  if (Array.isArray(reportsData)) {
    console.log('Data is direct array');
    return reportsData;
  }
  
  if (reportsData.reports && Array.isArray(reportsData.reports)) {
    console.log('Data is in reports property');
    return reportsData.reports;
  }
  
  if (reportsData.data && Array.isArray(reportsData.data)) {
    console.log('Data is in data property');
    return reportsData.data;
  }
  
  if (reportsData.items && Array.isArray(reportsData.items)) {
    console.log('Data is in items property');
    return reportsData.items;
  }
  
  if (reportsData.results && Array.isArray(reportsData.results)) {
    console.log('Data is in results property');
    return reportsData.results;
  }
  
  console.log('Could not find reports array in data structure');
  return [];
};

const actualReports = getReportsArray();
console.log('Actual reports array:', actualReports);
console.log('Reports count:', actualReports.length);  
  const updateReport = useUpdateReport();
  const addComment = useAddComment();
  const deleteReport = useDeleteReport();
  const publishReport = usePublishReport();
  const assignSeverity = useAssignSeverity();
  const approveReport = useApproveReport();
  const rejectReport = useRejectReport();
  const markDuplicate = useMarkDuplicate();
  const assignReward = useAssignReward();

  // Mock programs data - you might want to fetch this from your API
  const programs = [
    { id: '1', name: 'Web Application Security' },
    { id: '2', name: 'Mobile App Security' },
    { id: '3', name: 'API Security Testing' }
  ];
  
  
  // Severity options
  const severityOptions = [
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'info', label: 'Info', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  // Status options
  const statusOptions = [
    { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
    { value: 'under-review', label: 'Under Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'duplicate', label: 'Duplicate', color: 'bg-purple-100 text-purple-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-gray-100 text-gray-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' }
  ];

  // Get severity style
  const getSeverityStyle = (severity: string) => {
    const severityOption = severityOptions.find(s => s.value === severity?.toLowerCase());
    return severityOption?.color || 'bg-gray-100 text-gray-800';
  };

  // Get status style
  const getStatusStyle = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status?.toLowerCase());
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  // Report actions
  const handleStatusUpdate = async (reportId: string, status: string, comment?: string) => {
    try {
      await updateReport.mutateAsync({
        id: reportId,
        data: { 
          status
        }
      });
      
      if (comment) {
        await addComment.mutateAsync({
          id: reportId,
          comment: `Status changed to ${status}: ${comment}`
        });
      }
      
      setIsReviewOpen(false);
      setReviewComment('');
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleAssignSeverity = async (reportId: string, severity: string) => {
    try {
      await assignSeverity.mutateAsync({
        id: reportId,
        severity
      });
      
      await addComment.mutateAsync({
        id: reportId,
        comment: `Severity assigned: ${severity}`
      });
      
      setIsSeverityOpen(false);
      setSelectedSeverity('');
    } catch (error) {
      console.error('Severity assignment failed:', error);
    }
  };

  const handleSendEmail = async (reportId: string, content: string) => {
    try {
      // Implement email sending logic here
      console.log('Sending email for report:', reportId, content);
      setIsEmailOpen(false);
      setEmailContent('');
      
      // Add a comment about the email sent
      await addComment.mutateAsync({
        id: reportId,
        comment: `Email sent to researcher: ${content}`
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  };

  const handleProcessPayment = async (reportId: string, amount: string) => {
    try {
      await assignReward.mutateAsync({
        id: reportId,
        rewardAmount: parseFloat(amount)
      });
      
      setIsPaymentOpen(false);
      setPaymentAmount('');
    } catch (error) {
      console.error('Payment processing failed:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        await deleteReport.mutateAsync(reportId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handlePublishReport = async (reportId: string) => {
    try {
      await publishReport.mutateAsync(reportId);
      await addComment.mutateAsync({
        id: reportId,
        comment: 'Report published'
      });
    } catch (error) {
      console.error('Publish failed:', error);
    }
  };

  // Filter reports
const filteredReports = (reportsData?.data || []).filter((report: any) => {
    const matchesSearch = 
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.researcher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.program?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || report.status?.toLowerCase() === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || report.severity?.toLowerCase() === filterSeverity;
    const matchesProgram = selectedProgram === 'all' || report.programId === selectedProgram;

    return matchesSearch && matchesStatus && matchesSeverity && matchesProgram;
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
          
          {/* Filters Skeleton */}
          <div className="flex gap-4">
            <Skeleton className="h-10 bg-gray-200 flex-1" />
            <Skeleton className="h-10 bg-gray-200 w-48" />
            <Skeleton className="h-10 bg-gray-200 w-48" />
            <Skeleton className="h-10 bg-gray-200 w-48" />
          </div>
          
          {/* Table Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="bg-gray-200 w-full h-16" />
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
            {!isOrganizer ? 'Access Denied' : 'Error loading reports'}
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
            <h1 className="text-3xl font-bold text-slate-900">Reports Management</h1>
            <p className="text-slate-600 mt-2">
              Review and manage security reports from researchers.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search reports, researchers, or programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-full md:w-48">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              {severityOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programs.map(program => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Security Reports</CardTitle>
            <CardDescription>
              {filteredReports.length} reports found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Researcher</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report: any) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-xs truncate" title={report.title}>
                        {report.title}
                      </div>
                    </TableCell>
                    <TableCell>{report.program?.title}</TableCell>
                    <TableCell>{report.researcher?.name || 'Anonymous'}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityStyle(report.severity)}>
                        {report.severity || 'Not set'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusStyle(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700" title="More actions">
                            <MoreVertical className="h-4 w-4 cursor-pointer" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReport(report);
                              setIsDetailOpen(true);
                            }}
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Eye className="h-4 w-4 mr-2 cursor-pointer" />
                            View Details
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReport(report);
                              setIsReviewOpen(true);
                            }}
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <MessageSquare className="h-4 w-4 mr-2 cursor-pointer" />
                            Review Report
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReport(report);
                              setSelectedSeverity(report.severity || '');
                              setIsSeverityOpen(true);
                            }}
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2 cursor-pointer" />
                            Assign Severity
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReport(report);
                              setIsEmailOpen(true);
                            }}
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Mail className="h-4 w-4 mr-2 cursor-pointer" />
                            Send Email
                          </DropdownMenuItem>
                          
                          {report.status === 'approved' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedReport(report);
                                setPaymentAmount(report.rewardAmount?.toString() || '');
                                setIsPaymentOpen(true);
                              }}
                              className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <DollarSign className="h-4 w-4 mr-2 cursor-pointer" />
                              Process Payment
                            </DropdownMenuItem>
                          )}

                          {report.status !== 'published' && (
                            <DropdownMenuItem
                              onClick={() => handlePublishReport(report.id)}
                              className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <Send className="h-4 w-4 mr-2 cursor-pointer" />
                              Publish Report
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <XCircle className="h-4 w-4 mr-2 cursor-pointer" />
                            Delete Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Empty State */}
            {filteredReports.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-slate-900">No reports found</h3>
                <p className="text-slate-600 mt-2">
                  {searchTerm || filterStatus !== 'all' || filterSeverity !== 'all' || selectedProgram !== 'all'
                    ? 'Try adjusting your search terms or filters.' 
                    : 'No security reports have been submitted yet.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
       {reportsData?.pagination && reportsData.pagination.totalPages > 1 && (
  <div className="flex justify-center items-center space-x-2">
    <Button 
      variant="outline" 
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
    >
      Previous
    </Button>
    <span className="px-4 py-2 text-sm text-slate-600">
      Page {page} of {reportsData.pagination.totalPages}
    </span>
    <Button 
      variant="outline" 
      onClick={() => setPage(page + 1)}
      disabled={page >= reportsData.pagination.totalPages}
    >
      Next
    </Button>
  </div>
)}

        {/* Report Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedReport?.title}</DialogTitle>
              <DialogDescription>
                Report from {selectedReport?.researcher?.name || 'Anonymous'} • 
                Submitted on {selectedReport?.createdAt ? new Date(selectedReport.createdAt).toLocaleDateString() : 'N/A'}
              </DialogDescription>
            </DialogHeader>
            
            {selectedReport && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Program</h4>
                    <p>{selectedReport.program?.title}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Severity</h4>
                    <Badge className={getSeverityStyle(selectedReport.severity)}>
                      {selectedReport.severity || 'Not assigned'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Status</h4>
                    <Badge className={getStatusStyle(selectedReport.status)}>
                      {selectedReport.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Reward</h4>
                    <p>{selectedReport.rewardAmount ? `$${selectedReport.rewardAmount}` : 'Not set'}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="whitespace-pre-wrap">{selectedReport.description}</p>
                </div>

                {/* Steps to Reproduce */}
                {selectedReport.stepsToReproduce && (
                  <div>
                    <h4 className="font-semibold mb-2">Steps to Reproduce</h4>
                    <p className="whitespace-pre-wrap">{selectedReport.stepsToReproduce}</p>
                  </div>
                )}

                {/* Impact */}
                {selectedReport.impact && (
                  <div>
                    <h4 className="font-semibold mb-2">Impact</h4>
                    <p className="whitespace-pre-wrap">{selectedReport.impact}</p>
                  </div>
                )}

                {/* Proof */}
                {selectedReport.proof && (
                  <div>
                    <h4 className="font-semibold mb-2">Proof</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">
                        {selectedReport.proof}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (selectedReport.proof) {
                            window.open(selectedReport.proof, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        disabled={!selectedReport.proof}
                        title="View proof in new tab"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Proof
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsDetailOpen(false);
                setIsReviewOpen(true);
              }}>
                Review Report
              </Button>
              <Button onClick={() => {
                setIsDetailOpen(false);
                setSelectedSeverity(selectedReport?.severity || '');
                setIsSeverityOpen(true);
              }}>
                Assign Severity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Report</DialogTitle>
              <DialogDescription>
                Update the status and add comments for {selectedReport?.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Review Comment</label>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Add your review comments..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedReport?.id, 'approved', reviewComment)}
                  disabled={updateReport.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedReport?.id, 'rejected', reviewComment)}
                  disabled={updateReport.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedReport?.id, 'duplicate', reviewComment)}
                  disabled={updateReport.isPending}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Mark Duplicate
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedReport?.id, 'under-review', reviewComment)}
                  disabled={updateReport.isPending}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Under Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Severity Assignment Dialog */}
        <Dialog open={isSeverityOpen} onOpenChange={setIsSeverityOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Severity</DialogTitle>
              <DialogDescription>
                Set the severity level for {selectedReport?.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {severityOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={selectedSeverity === option.value ? "default" : "outline"}
                    className={selectedSeverity === option.value ? option.color : ''}
                    onClick={() => setSelectedSeverity(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSeverityOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleAssignSeverity(selectedReport?.id, selectedSeverity)}
                disabled={!selectedSeverity}
              >
                Assign Severity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Email Dialog */}
        <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Email to Researcher</DialogTitle>
              <DialogDescription>
                Send an email to {selectedReport?.researcher?.name || 'the researcher'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Content</label>
                <Textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Write your email content..."
                  rows={6}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmailOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleSendEmail(selectedReport?.id, emailContent)}
                disabled={!emailContent.trim()}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Payment</DialogTitle>
              <DialogDescription>
                Set the reward amount for {selectedReport?.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Reward Amount ($)</label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Severity Guidelines</h4>
                <div className="text-sm space-y-1">
                  <div>Critical: $1,000 - $5,000</div>
                  <div>High: $500 - $1,000</div>
                  <div>Medium: $100 - $500</div>
                  <div>Low: $50 - $100</div>
                  <div>Info: $0 - $50</div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleProcessPayment(selectedReport?.id, paymentAmount)}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </OrganizerLayout>
  );
};

export default OrganizerReports;