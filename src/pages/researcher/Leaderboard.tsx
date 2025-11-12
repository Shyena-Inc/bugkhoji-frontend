
import { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Users, Award, Crown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ResearcherLayout from '@/components/ResearcherLayout';
import { useGetLeaderboard } from '@/api/leaderboard';
import { useAuth } from '@/context';
import { API_URL } from '@/utils/config-global';

const Leaderboard = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'all'>('all');
  const { user } = useAuth();
  
  const { data: leaderboard, isLoading, error } = useGetLeaderboard({ 
    limit: 50, 
    period 
  });

  // Helper function to get full logo URL
  const getLogoUrl = (logo: string | null): string | undefined => {
    if (!logo) return undefined;
    // If logo already starts with http, return as is
    if (logo.startsWith('http')) return logo;
    // Otherwise, prepend API_URL
    return `${API_URL}${logo}`;
  };

  // Find current user in leaderboard
  const currentUserEntry = leaderboard?.find(entry => entry.id === user?.id);
  
  const currentUser = currentUserEntry ? {
    rank: currentUserEntry.rank,
    name: currentUserEntry.name,
    points: currentUserEntry.score,
    reports: currentUserEntry.totalReports,
    earnings: currentUserEntry.totalRewards
  } : null;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-slate-600">#{rank}</span>;
  };

  const getLevel = (score: number): string => {
    if (score >= 500) return 'Legend';
    if (score >= 300) return 'Master';
    if (score >= 150) return 'Expert';
    if (score >= 50) return 'Advanced';
    return 'Intermediate';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Legend': 'bg-purple-100 text-purple-800',
      'Master': 'bg-blue-100 text-blue-800',
      'Expert': 'bg-green-100 text-green-800',
      'Advanced': 'bg-yellow-100 text-yellow-800',
      'Intermediate': 'bg-orange-100 text-orange-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSpecialBadge = (rank: number, score: number): string | null => {
    if (rank === 1) return 'Hall of Fame';
    if (score >= 500) return 'Elite Researcher';
    if (score >= 300) return 'Bug Slayer';
    if (score >= 150) return 'Critical Hunter';
    return null;
  };

  return (
    <ResearcherLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Leaderboard</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              See how you rank among the top security researchers.
            </p>
          </div>
          
          <Select value={period} onValueChange={(value) => setPeriod(value as any)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load leaderboard. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {!isLoading && !error && leaderboard && (
          <>

        {/* Your Rank Card */}
        {currentUser && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                Your Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">#{currentUser.rank}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentUser.points.toLocaleString()}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentUser.reports}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${currentUser.earnings.toLocaleString()}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Earnings</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Level</span>
                  <span>{getLevel(currentUser.points)}</span>
                </div>
                <Progress value={(currentUser.points % 100)} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Researchers */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Top Researchers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                    No researchers found for this period.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((researcher) => {
                      const level = getLevel(researcher.score);
                      const specialBadge = getSpecialBadge(researcher.rank, researcher.score);
                      
                      return (
                        <div key={researcher.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {getRankIcon(researcher.rank)}
                            </div>
                            
                            <Avatar>
                              <AvatarImage src={getLogoUrl(researcher.logo)} alt={researcher.name} />
                              <AvatarFallback>
                                {researcher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{researcher.name}</h3>
                                <Badge className={getLevelColor(level)}>
                                  {level}
                                </Badge>
                                {specialBadge && (
                                  <Badge variant="outline" className="text-xs">
                                    {specialBadge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                @{researcher.username || 'anonymous'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-lg">{researcher.score.toLocaleString()}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {researcher.totalReports} reports
                            </div>
                            {researcher.totalRewards > 0 && (
                              <div className="text-xs text-green-600 dark:text-green-400">
                                ${researcher.totalRewards.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Researchers</span>
                    <span className="font-medium">{leaderboard.length.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Top Researcher Score</span>
                    <span className="font-medium">
                      {leaderboard[0]?.score.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Reports</span>
                    <span className="font-medium">
                      {leaderboard.reduce((sum, r) => sum + r.totalReports, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Bounties</span>
                    <span className="font-medium">
                      ${leaderboard.reduce((sum, r) => sum + r.totalRewards, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Period Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Leaderboard Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    Rankings are based on report scores calculated from priority levels.
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Critical:</span>
                      <span className="font-medium">10 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Urgent:</span>
                      <span className="font-medium">8 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High:</span>
                      <span className="font-medium">7 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medium:</span>
                      <span className="font-medium">4 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Low:</span>
                      <span className="font-medium">2 points</span>
                    </div>
                  </div>
                  <p className="text-xs pt-2 border-t">
                    Auto-refreshes every 5 minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </>
        )}
      </div>
    </ResearcherLayout>
  );
};

export default Leaderboard;
