
import { useState } from 'react';
import { FileText, Search, Filter, Eye, Edit, Trash2, Calendar, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResearcherLayout from '@/components/ResearcherLayout';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const reports = [
    {
      id: 'REP-2024-001',
      title: 'SQL Injection in User Search',
      program: 'TechCorp Security Program',
      severity: 'high',
      status: 'resolved',
      submittedDate: '2024-01-10',
      resolvedDate: '2024-01-15',
      bounty: 6200
    },
    {
      id: 'REP-2024-002',
      title: 'XSS in Comment System',
      program: 'FinanceApp Bug Bounty',
      severity: 'medium',
      status: 'triaged',
      submittedDate: '2024-01-08',
      resolvedDate: null,
      bounty: 1500
    },
    {
      id: 'REP-2024-003',
      title: 'CSRF on Password Reset',
      program: 'E-commerce Platform',
      severity: 'medium',
      status: 'open',
      submittedDate: '2024-01-05',
      resolvedDate: null,
      bounty: null
    },
    {
      id: 'REP-2023-045',
      title: 'Authentication Bypass',
      program: 'TechCorp Security Program',
      severity: 'critical',
      status: 'resolved',
      submittedDate: '2023-12-20',
      resolvedDate: '2023-12-28',
      bounty: 12000
    },
    {
      id: 'REP-2023-044',
      title: 'Information Disclosure',
      program: 'FinanceApp Bug Bounty',
      severity: 'low',
      status: 'rejected',
      submittedDate: '2023-12-15',
      resolvedDate: '2023-12-18',
      bounty: null
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'bg-blue-100 text-blue-800',
      triaged: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.open;
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    return variants[severity as keyof typeof variants] || variants.low;
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const stats = {
    total: reports.length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    pending: reports.filter(r => r.status === 'open' || r.status === 'triaged').length,
    totalEarnings: reports.filter(r => r.bounty).reduce((sum, r) => sum + (r.bounty || 0), 0)
  };

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
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <div className="text-green-500">$</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
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
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="triaged">Triaged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
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
                  <TableHead>Report ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Bounty</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell className="max-w-48 truncate">{report.title}</TableCell>
                    <TableCell className="max-w-32 truncate">{report.program}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityBadge(report.severity)}>
                        {report.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(report.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {report.bounty ? (
                        <span className="font-medium text-green-600">
                          ${report.bounty.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.status === 'open' && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No reports found</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </ResearcherLayout>
  );
};

export default Reports;
