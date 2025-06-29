
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Edit, Archive, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const ManagePrograms = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock program data
  const programs = [
    {
      id: 1,
      name: 'TechCorp Bug Bounty',
      organization: 'TechCorp Inc.',
      status: 'active',
      scope: 'Web application, Mobile app',
      reportsCount: 156,
      maxReward: '$10,000',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'StartupX Security Program',
      organization: 'StartupX',
      status: 'pending',
      scope: 'API endpoints, Web platform',
      reportsCount: 23,
      maxReward: '$5,000',
      createdDate: '2024-03-01'
    },
    {
      id: 3,
      name: 'Enterprise Security Initiative',
      organization: 'BigCorp Ltd.',
      status: 'active',
      scope: 'All digital assets',
      reportsCount: 89,
      maxReward: '$25,000',
      createdDate: '2023-11-20'
    },
    {
      id: 4,
      name: 'FinanceApp Vulnerability Program',
      organization: 'FinanceApp',
      status: 'archived',
      scope: 'Mobile application only',
      reportsCount: 67,
      maxReward: '$15,000',
      createdDate: '2023-08-10'
    }
  ];

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{program.name}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {program.organization}
                    </CardDescription>
                  </div>
                  {getStatusBadge(program.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Reports</p>
                    <p className="font-semibold text-lg">{program.reportsCount}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Max Reward</p>
                    <p className="font-semibold text-lg text-green-600 dark:text-green-400">{program.maxReward}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Scope</p>
                  <p className="text-sm">{program.scope}</p>
                </div>

                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Created: {new Date(program.createdDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  {program.status === 'pending' && (
                    <Button size="sm" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  {program.status === 'active' && (
                    <Button variant="outline" size="sm" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                      <Archive className="h-4 w-4" />
                      Archive
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">No programs found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManagePrograms;
