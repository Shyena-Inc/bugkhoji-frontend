
import { useState } from 'react';
import { DollarSign, Calendar, Download, TrendingUp, Wallet, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResearcherLayout from '@/components/ResearcherLayout';

const Payments = () => {
  const [filterPeriod, setFilterPeriod] = useState('all');

  const earnings = {
    total: 45750,
    thisMonth: 8500,
    pending: 2300,
    lastPayout: 6200
  };

  const paymentHistory = [
    {
      id: 'PAY-001',
      date: '2024-01-15',
      amount: 6200,
      program: 'TechCorp Security Program',
      reportId: 'REP-2024-001',
      status: 'completed',
      method: 'Bank Transfer'
    },
    {
      id: 'PAY-002',
      date: '2024-01-10',
      amount: 1500,
      program: 'FinanceApp Bug Bounty',
      reportId: 'REP-2024-002',
      status: 'completed',
      method: 'PayPal'
    },
    {
      id: 'PAY-003',
      date: '2024-01-05',
      amount: 800,
      program: 'E-commerce Platform',
      reportId: 'REP-2024-003',
      status: 'pending',
      method: 'Bank Transfer'
    },
    {
      id: 'PAY-004',
      date: '2023-12-28',
      amount: 3200,
      program: 'TechCorp Security Program',
      reportId: 'REP-2023-045',
      status: 'completed',
      method: 'Cryptocurrency'
    },
    {
      id: 'PAY-005',
      date: '2023-12-20',
      amount: 1500,
      program: 'FinanceApp Bug Bounty',
      reportId: 'REP-2023-044',
      status: 'pending',
      method: 'Bank Transfer'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <ResearcherLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Payments & Earnings</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Track your bounty payments and earnings history.
            </p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.thisMonth.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.pending.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                2 payments processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Payout</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.lastPayout.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                January 15, 2024
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payment History</CardTitle>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-48">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Report</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-48 truncate">{payment.program}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">
                        {payment.reportId}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      ${payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">•••• •••• •••• 1234</p>
                  </div>
                </div>
                <Badge>Primary</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">user@example.com</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResearcherLayout>
  );
};

export default Payments;
