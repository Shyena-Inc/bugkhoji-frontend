
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Eye } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Mock reports data
  const reports = [
    {
      id: 'VUL-2024-001',
      title: 'SQL Injection in Login Form',
      submittedBy: 'alice@example.com',
      organization: 'TechCorp Inc.',
      severity: 'critical',
      status: 'triaged',
      submittedDate: '2024-03-15',
      reward: '$5,000'
    },
    {
      id: 'VUL-2024-002',
      title: 'XSS in User Profile Page',
      submittedBy: 'bob@security.io',
      organization: 'StartupX',
      severity: 'high',
      status: 'open',
      submittedDate: '2024-03-14',
      reward: '$2,500'
    },
    {
      id: 'VUL-2024-003',
      title: 'CSRF on Password Reset',
      submittedBy: 'charlie@example.com',
      organization: 'BigCorp Ltd.',
      severity: 'medium',
      status: 'resolved',
      submittedDate: '2024-03-12',
      reward: '$1,000'
    },
    {
      id: 'VUL-2024-004',
      title: 'Information Disclosure in API',
      submittedBy: 'diana@example.com',
      organization: 'FinanceApp',
      severity: 'low',
      status: 'rejected',
      submittedDate: '2024-03-10',
      reward: '$0'
    },
    {
      id: 'VUL-2024-005',
      title: 'Rate Limiting Bypass',
      submittedBy: 'eve@security.io',
      organization: 'TechCorp Inc.',
      severity: 'medium',
      status: 'open',
      submittedDate: '2024-03-08',
      reward: '$1,500'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || report.severity === filterSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Open</Badge>;
      case 'triaged':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Triaged</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Resolved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const exportToCSV = () => {
    // Mock CSV export functionality
    console.log('Exporting reports to CSV...');
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              All Reports
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Monitor and manage all vulnerability reports submitted to the platform
            </p>
          </div>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search reports by title, submitter, or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Status: {filterStatus === 'all' ? 'All' : filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('open')}>Open</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('triaged')}>Triaged</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('resolved')}>Resolved</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('rejected')}>Rejected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Severity: {filterSeverity === 'all' ? 'All' : filterSeverity}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterSeverity('all')}>All Severity</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSeverity('critical')}>Critical</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSeverity('high')}>High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSeverity('medium')}>Medium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterSeverity('low')}>Low</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Reports</CardTitle>
            <CardDescription>
              Comprehensive view of all vulnerability reports on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono">{report.id}</TableCell>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{report.submittedBy}</TableCell>
                    <TableCell>{report.organization}</TableCell>
                    <TableCell>{getSeverityBadge(report.severity)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>{new Date(report.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold text-green-600 dark:text-green-400">
                      {report.reward}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Reports;
