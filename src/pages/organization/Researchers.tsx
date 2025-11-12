import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Mail, Award, FileText } from 'lucide-react';
import OrganizationLayout from '@/components/OrganizationLayout';

// Mock data - replace with actual API call
const mockResearchers = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    logo: null,
    totalReports: 15,
    acceptedReports: 12,
    reputation: 850,
    lastActive: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    logo: null,
    totalReports: 23,
    acceptedReports: 20,
    reputation: 1200,
    lastActive: '2024-01-14',
  },
];

const OrganizationResearchers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredResearchers = mockResearchers.filter(researcher =>
    researcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    researcher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    researcher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Security Researchers
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            View researchers who have submitted reports to your programs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Researchers</CardTitle>
            <CardDescription>
              Researchers who have participated in your bug bounty programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search researchers by name, username, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Researcher</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Reputation</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResearchers.length > 0 ? (
                    filteredResearchers.map((researcher) => (
                      <TableRow key={researcher.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={researcher.logo || undefined} alt={researcher.name} />
                              <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                                {getInitials(researcher.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {researcher.name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                @{researcher.username}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Mail className="h-4 w-4" />
                            {researcher.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <span className="font-medium">{researcher.totalReports}</span>
                            <span className="text-sm text-slate-500">
                              ({researcher.acceptedReports} accepted)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <Award className="h-3 w-3" />
                            {researcher.reputation}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                          {new Date(researcher.lastActive).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        {searchTerm ? 'No researchers found matching your search' : 'No researchers yet'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationResearchers;
