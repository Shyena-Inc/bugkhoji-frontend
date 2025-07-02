
import { useState } from 'react';
import { Shield, Search, Filter, Star, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResearcherLayout from '@/components/ResearcherLayout';
import {useGetAllPrograms} from '@/api/programs'
import { Skeleton } from "@/components/ui/skeleton";

const Programs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const {data, isLoading} = useGetAllPrograms(page);

  const handlePreviousPage = ()=>{
    if(page >1){
      setPage(page - 1)
    }
  };

  const handleNextPage = () =>{
    if(data && page < Math.ceil(data?.data?.length / 8)){
      setPage(page + 1)
    }
  };

  const programs = [
    {
      id: 1,
      name: 'TechCorp Security Program',
      company: 'TechCorp Inc.',
      logo: '🏢',
      status: 'active',
      maxReward: 25000,
      minReward: 100,
      scope: ['*.techcorp.com', 'api.techcorp.com', 'mobile apps'],
      description: 'Comprehensive security testing for our web and mobile applications.',
      participants: 1250,
      reports: 342,
      rating: 4.8
    },
    {
      id: 2,
      name: 'FinanceApp Bug Bounty',
      company: 'SecureFinance',
      logo: '🏦',
      status: 'active',
      maxReward: 50000,
      minReward: 500,
      scope: ['app.securefinance.com', 'api.securefinance.com'],
      description: 'Critical security testing for financial applications.',
      participants: 890,
      reports: 156,
      rating: 4.9
    },
    {
      id: 3,
      name: 'E-commerce Platform',
      company: 'ShopSafe',
      logo: '🛒',
      status: 'paused',
      maxReward: 15000,
      minReward: 200,
      scope: ['*.shopsafe.com', 'merchant.shopsafe.com'],
      description: 'Security assessment for our e-commerce infrastructure.',
      participants: 567,
      reports: 89,
      rating: 4.6
    }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || program.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <ResearcherLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bug Bounty Programs</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Discover and participate in security programs from leading organizations.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search programs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="bg-gray-200 w-full h-48" />
                ))
              :  filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{program.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{program.company}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={program.status === 'active' ? 'default' : 'secondary'}
                    className={program.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {program.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {program.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${program.minReward.toLocaleString()} - ${program.maxReward.toLocaleString()}
                  </div>
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                    <Star className="h-4 w-4 mr-1" />
                    {program.rating}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>{program.participants} researchers</span>
                  <span>{program.reports} reports</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Scope:</h4>
                  <div className="flex flex-wrap gap-1">
                    {program.scope.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1" disabled={program.status !== 'active'}>
                    <Shield className="mr-2 h-4 w-4" />
                    {program.status === 'active' ? 'Join Program' : 'Paused'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data?.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No programs found</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </ResearcherLayout>
  );
};

export default Programs;
