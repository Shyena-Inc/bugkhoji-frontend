import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Upload,
  Download,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  User,
  Shield,
  Bug
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ResearcherLayout from '@/components/ResearcherLayout';
import { useGetReportById, useAddComment, useDeleteReport } from '@/api/reports';
import { useAuth } from '../../../context/index';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const { data: report, isLoading, error } = useGetReportById(id);
  const addCommentMutation = useAddComment();
  const deleteReportMutation = useDeleteReport();

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setIsAddingComment(true);
      await addCommentMutation.mutateAsync({ id, comment });
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteReport = async () => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        await deleteReportMutation.mutateAsync(id);
        navigate('/researcher/reports');
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      DRAFT: <Edit className="h-4 w-4" />,
      SUBMITTED: <Upload className="h-4 w-4" />,
      UNDER_REVIEW: <Eye className="h-4 w-4" />,
      TRIAGED: <AlertTriangle className="h-4 w-4" />,
      RESOLVED: <CheckCircle className="h-4 w-4" />,
      REJECTED: <XCircle className="h-4 w-4" />,
      CLOSED: <FileText className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const getStatusBadge = (status) => {
    const variants = {
      DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      SUBMITTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      UNDER_REVIEW: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      TRIAGED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      CLOSED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return variants[status] || variants.DRAFT;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      CRITICAL: 'bg-red-500 text-white',
      HIGH: 'bg-orange-500 text-white',
      MEDIUM: 'bg-yellow-500 text-white',
      LOW: 'bg-green-500 text-white'
    };
    return variants[priority] || variants.LOW;
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <ResearcherLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </ResearcherLayout>
    );
  }

  if (error || !report) {
    return (
      <ResearcherLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Report Not Found
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              The report you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button 
              onClick={() => navigate('/researcher/reports')}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </div>
        </div>
      </ResearcherLayout>
    );
  }

  return (
    <ResearcherLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={() => navigate('/researcher/reports')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          
          {report.status === 'DRAFT' && (
            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate(`/reports/edit/${report.id}`)}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                onClick={handleDeleteReport}
                variant="destructive"
                size="sm"
                disabled={deleteReportMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Report Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{report.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>By {report.author?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {report.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <span>{report.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(report.status)}
                  <Badge className={getStatusBadge(report.status)}>
                    {formatStatus(report.status)}
                  </Badge>
                </div>
                <Badge className={getPriorityBadge(report.priority)}>
                  {formatPriority(report.priority)} Priority
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Report Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{report.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Steps to Reproduce */}
            {report.stepsToReproduce && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bug className="h-5 w-5" />
                    <span>Steps to Reproduce</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{report.stepsToReproduce}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Impact */}
            {report.impact && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{report.impact}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Proof of Concept */}
            {report.proofOfConcept && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Proof of Concept</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{report.proofOfConcept}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attachments */}
            {report.attachments && report.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Attachments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {report.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium">{attachment.name}</span>
                          <span className="text-xs text-slate-500">
                            ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Comments ({report.comments?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-24"
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={!comment.trim() || isAddingComment}
                    size="sm"
                  >
                    {isAddingComment ? 'Adding...' : 'Add Comment'}
                  </Button>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  {report.comments && report.comments.length > 0 ? (
                    report.comments.map((comment, index) => (
                      <div key={index} className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment.author?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {comment.author?.name || 'Unknown User'}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Info */}
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Type</label>
                  <p className="text-sm">{report.type || 'GENERAL'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300">CVSS Score</label>
                  <p className="text-sm">{report.cvssScore || 'Not calculated'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300">CWE</label>
                  <p className="text-sm">{report.cwe || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Last Updated</label>
                  <p className="text-sm">{new Date(report.updatedAt).toLocaleDateString()}</p>
                </div>

                {report.resolvedAt && (
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Resolved At</label>
                    <p className="text-sm">{new Date(report.resolvedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {report.tags && report.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="h-4 w-4" />
                    <span>Tags</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {report.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Program Info */}
            {report.program && (
              <Card>
                <CardHeader>
                  <CardTitle>Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">{report.program.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {report.program.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ResearcherLayout>
  );
};

export default ReportDetail;