import { useState } from 'react';
import { FileText, Search, Filter, Eye, Edit, Trash2, Calendar, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResearcherLayout from '@/components/ResearcherLayout';
import { useGetAllReports } from '@/api/reports';
import { useAuth } from '../../../context/index';
import { Link } from 'react-router-dom';
const Reports = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const isResearcher = user?.role === 'RESEARCHER';
  
  const { data: reportsData, isLoading, error } = useGetAllReports(
    !!user?.id && isResearcher ? 1 : 0
  );

  // Ensure reports is always an array
  const reports = Array.isArray(reportsData) ? reportsData : 
                 (reportsData?.data && Array.isArray(reportsData.data)) ? reportsData.data :
                 (reportsData?.reports && Array.isArray(reportsData.reports)) ? reportsData.reports :
                 [];

  // Debug logging
  console.log('User from auth:', user);
  console.log('Is researcher:', isResearcher);
  console.log('Raw reports data:', reportsData);
  console.log('Processed reports array:', reports);
  console.log('Loading state:', isLoading);
  console.log('Error:', error);

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

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (report.tags && Array.isArray(report.tags) && report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate stats from actual data
  const stats = {
    total: reports.length,
    resolved: reports.filter(r => r.status === 'RESOLVED').length,
    pending: reports.filter(r => ['SUBMITTED', 'UNDER_REVIEW', 'TRIAGED'].includes(r.status)).length,
    draft: reports.filter(r => r.status === 'DRAFT').length
  };

  // Loading state - also check if user is not fully loaded
  if (!user || isLoading) {
    return (
      <ResearcherLayout>
        <div className="max-w-6xl mx-auto space-y-6">
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

  // Error state
  if (error || !isResearcher) {
    return (
      <ResearcherLayout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              {!isResearcher ? 'Access Denied' : 'Error loading reports'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              {!isResearcher 
                ? 'This page is only accessible to researchers.' 
                : error?.message || 'Something went wrong. Please try again.'
              }
            </p>
          </div>
        </div>
      </ResearcherLayout>
    );
  }

  return (
    <ResearcherLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Reports</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Track and manage your submitted vulnerability reports.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="TRIAGED">Triaged</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Public</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium max-w-48">
                      <div className="truncate" title={report.title}>
                        {report.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {report.type || 'GENERAL'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadge(report.priority)}>
                        {formatPriority(report.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(report.status)}>
                        {formatStatus(report.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${report.isPublic ? 'text-green-600' : 'text-red-600'}`}>
                        {report.isPublic ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {report.tags && Array.isArray(report.tags) && report.tags.length > 0 ? (
                          report.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                        {report.tags && Array.isArray(report.tags) && report.tags.length > 2 && (
                          <span className="text-xs text-slate-500">+{report.tags.length - 2}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {report.createdAt 
                        ? new Date(report.createdAt).toLocaleDateString()
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
  <div className="flex space-x-2">
    <Link to={`/researcher/report/${report.id}`}>
      <Button variant="ghost" size="sm" title="View Report">
        <Eye className="h-4 w-4" />
      </Button>
    </Link>
    {report.status === 'DRAFT' && (
      <>
        <Button variant="ghost" size="sm" title="Edit Report">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" title="Delete Report">
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    )}
  </div>
</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
              {reports.length === 0 ? 'No reports yet' : 'No reports found'}
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {reports.length === 0 
                ? 'Start by creating your first vulnerability report.'
                : 'Try adjusting your search terms or filters.'
              }
            </p>
          </div>
        )}
      </div>
    </ResearcherLayout>
  );
};

export default Reports;