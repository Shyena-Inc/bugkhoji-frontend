import { useState } from 'react';
import { Shield, Search, Filter, Star, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResearcherLayout from '@/components/ResearcherLayout';
import { useGetAllPrograms } from '@/api/programs';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../../../context/index";
import { Link } from 'react-router-dom';

const Programs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Fix: Move useAuth hook before using user variable
  const { user } = useAuth();
  const isResearcher = user?.role === 'RESEARCHER';
  
  // Fix: Use correct API hook with proper parameters
  const { data, isLoading, error } = useGetAllPrograms(page);
  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    // Fix: Use correct data structure and pagination logic
    if (data && Array.isArray(data) && page < Math.ceil(data.length / 8)) {
      setPage(page + 1);
    }
  };

  // Helper function to get reward range from rewards object
  const getRewardRange = (rewards) => {
    if (!rewards) return { min: 0, max: 0 };
    
    const extractAmount = (range) => {
      if (!range) return 0;
      const matches = range.match(/\$(\d+)/g);
      return matches ? parseInt(matches[0].replace('$', '')) : 0;
    };
    
    const amounts = [];
    if (rewards.low) amounts.push(extractAmount(rewards.low));
    if (rewards.medium) amounts.push(extractAmount(rewards.medium));
    if (rewards.high) amounts.push(extractAmount(rewards.high));
    if (rewards.critical) amounts.push(extractAmount(rewards.critical));
  
    return {
      min: Math.min(...amounts) || 0,
      max: Math.max(...amounts) || 0
    };
  };

  // Helper function to get status badge color
  const getStatusBadgeVariant = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'paused':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  // Add access control similar to dashboard
  if (!user?.id || !isResearcher || isLoading) {
    return (
      <ResearcherLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="bg-gray-200 w-full h-48" />
            ))}
          </div>
        </div>
      </ResearcherLayout>
    );
  }

  if (error || !isResearcher) {
    return (
      <ResearcherLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            {!isResearcher ? 'Access Denied' : 'Error loading programs'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            {!isResearcher 
              ? 'This page is only accessible to researchers.' 
              : error?.message || 'Something went wrong. Please try again.'
            }
          </p>
        </div>
      </ResearcherLayout>
    );
  }

  // Filter programs based on search and status
  const filteredPrograms = (Array.isArray(data) ? data : []).filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.organization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.websiteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || program.status.toLowerCase() === filterStatus;
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPrograms.map((program) => {
            const rewardRange = getRewardRange(program.rewards);
            return (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {program.logo ? (
                          <img 
                            src={program.logo} 
                            alt={`${program.title} logo`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`text-2xl ${program.logo ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                          🏢
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{program.organization.name}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={getStatusBadgeVariant(program.status)}
                      className={getStatusBadgeClass(program.status)}
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
                      ${rewardRange.min.toLocaleString()} - ${rewardRange.max.toLocaleString()}
                    </div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {program.websiteName}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{program._count?.submissions || 0} submissions</span>
                    <span>{program._count?.reports || 0} reports</span>
                  </div>
                  
                  
                  <div className="flex space-x-2 pt-2">
                    <Link to={`/researcher/programs/${program.id}`} className="flex-1">
                      <Button className="w-full">
                        <Shield className="mr-2 h-4 w-4" />
                        Join Program
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (program.websiteUrl) {
                          window.open(program.websiteUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      disabled={!program.websiteUrl}
                      title={program.websiteUrl ? `Visit ${program.websiteName}` : 'Website URL not available'}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        {Array.isArray(data) && data.length > 8 && (
          <div className="flex justify-center space-x-2">
            <Button 
              variant="outline" 
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 py-2 text-sm text-slate-600">
              Page {page} of {Math.ceil(data.length / 8)}
            </span>
            <Button 
              variant="outline" 
              onClick={handleNextPage}
              disabled={page >= Math.ceil(data.length / 8)}
            >
              Next
            </Button>
          </div>
        )}

        {filteredPrograms.length === 0 && !isLoading && (
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