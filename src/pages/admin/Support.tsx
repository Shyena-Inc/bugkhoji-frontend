
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MessageCircle, Check, Clock } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  // Mock support tickets data
  const tickets = [
    {
      id: 'SUP-001',
      senderName: 'John Doe',
      senderEmail: 'john@example.com',
      subject: 'Unable to submit vulnerability report',
      message: 'I keep getting an error when trying to upload my proof-of-concept files. The form just shows "Upload failed" without any details.',
      status: 'new',
      createdDate: '2024-03-15T10:30:00Z',
      priority: 'high'
    },
    {
      id: 'SUP-002',
      senderName: 'Sarah Wilson',
      senderEmail: 'sarah@security.io',
      subject: 'Question about reward policy',
      message: 'Hi, I submitted a vulnerability report last week but haven\'t heard back. Can you clarify the timeline for review and reward distribution?',
      status: 'in-progress',
      createdDate: '2024-03-14T14:22:00Z',
      priority: 'medium'
    },
    {
      id: 'SUP-003',
      senderName: 'Mike Johnson',
      senderEmail: 'mike@techcorp.com',
      subject: 'Account verification issue',
      message: 'My organization account is still pending verification. We submitted all required documents two weeks ago.',
      status: 'resolved',
      createdDate: '2024-03-12T09:15:00Z',
      priority: 'low'
    },
    {
      id: 'SUP-004',
      senderName: 'Emily Chen',
      senderEmail: 'emily@startup.com',
      subject: 'Feature request - API integration',
      message: 'We would like to integrate our internal security tools with BugKhoji🔍. Do you have an API or webhook system available?',
      status: 'new',
      createdDate: '2024-03-11T16:45:00Z',
      priority: 'low'
    }
  ];

  const filteredTickets = tickets.filter(ticket =>
    ticket.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">New</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const handleReply = (ticketId: string) => {
    console.log(`Replying to ticket ${ticketId}:`, replyMessage);
    setReplyMessage('');
  };

  const markAsResolved = (ticketId: string) => {
    console.log(`Marking ticket ${ticketId} as resolved`);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
            Support Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Manage support tickets and user inquiries
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">New Tickets</p>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'new').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'in-progress').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Check className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Resolved</p>
                  <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search tickets by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>
              View and respond to user support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono">{ticket.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.senderName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{ticket.senderEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{new Date(ticket.createdDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{ticket.subject}</DialogTitle>
                              <DialogDescription>
                                From: {ticket.senderName} ({ticket.senderEmail})
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Message:</h4>
                                <p className="text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                  {ticket.message}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Reply:</h4>
                                <Textarea
                                  placeholder="Type your reply here..."
                                  value={replyMessage}
                                  onChange={(e) => setReplyMessage(e.target.value)}
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={() => handleReply(ticket.id)}>
                                  Send Reply
                                </Button>
                                {ticket.status !== 'resolved' && (
                                  <Button
                                    variant="outline"
                                    onClick={() => markAsResolved(ticket.id)}
                                  >
                                    Mark as Resolved
                                  </Button>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
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

export default Support;
