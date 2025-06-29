
import { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, Users, Award, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import ResearcherLayout from '@/components/ResearcherLayout';

const Leaderboard = () => {
  const [timeFrame, setTimeFrame] = useState('all-time');

  const currentUser = {
    rank: 23,
    name: 'You',
    points: 8750,
    badges: 12,
    reports: 45,
    earnings: 15400
  };

  const topResearchers = [
    {
      rank: 1,
      name: 'Alex Thompson',
      username: 'alexsec',
      points: 45780,
      badges: 89,
      reports: 234,
      earnings: 125400,
      level: 'Legend',
      specialBadge: 'Hall of Fame'
    },
    {
      rank: 2,
      name: 'Sarah Chen',
      username: 'sarahc',
      points: 42340,
      badges: 76,
      reports: 198,
      earnings: 98750,
      level: 'Master',
      specialBadge: 'Critical Hunter'
    },
    {
      rank: 3,
      name: 'Marcus Rodriguez',
      username: 'marcusr',
      points: 38920,
      badges: 68,
      reports: 187,
      earnings: 87300,
      level: 'Master',
      specialBadge: 'Bug Slayer'
    },
    {
      rank: 4,
      name: 'Emily Watson',
      username: 'emilyw',
      points: 35670,
      badges: 61,
      reports: 156,
      earnings: 74200,
      level: 'Expert',
      specialBadge: 'Web Specialist'
    },
    {
      rank: 5,
      name: 'David Park',
      username: 'davidp',
      points: 32450,
      badges: 54,
      reports: 143,
      earnings: 68900,
      level: 'Expert',
      specialBadge: 'Mobile Master'
    }
  ];

  const achievements = [
    { name: 'First Blood', description: 'Submit your first vulnerability report', earned: true },
    { name: 'Critical Strike', description: 'Find a critical severity vulnerability', earned: true },
    { name: 'Hat Trick', description: 'Submit 3 valid reports in a week', earned: true },
    { name: 'Bounty Hunter', description: 'Earn $10,000 in bounties', earned: true },
    { name: 'Master Detective', description: 'Find 50 valid vulnerabilities', earned: false },
    { name: 'Elite Researcher', description: 'Reach top 10 on leaderboard', earned: false }
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-slate-600">#{rank}</span>;
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
          
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Your Rank Card */}
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
                <span>Progress to next rank</span>
                <span>Level 4: Expert</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
          </CardContent>
        </Card>

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
                <div className="space-y-4">
                  {topResearchers.map((researcher) => (
                    <div key={researcher.rank} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(researcher.rank)}
                        </div>
                        
                        <Avatar>
                          <AvatarFallback>
                            {researcher.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{researcher.name}</h3>
                            <Badge className={getLevelColor(researcher.level)}>
                              {researcher.level}
                            </Badge>
                            {researcher.specialBadge && (
                              <Badge variant="outline" className="text-xs">
                                {researcher.specialBadge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">@{researcher.username}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-lg">{researcher.points.toLocaleString()}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{researcher.reports} reports</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${achievement.earned ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-green-500' : 'bg-slate-300'}`}>
                          {achievement.earned ? (
                            <Award className="h-4 w-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.name}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-6">
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
                    <span className="font-medium">12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active This Month</span>
                    <span className="font-medium">3,291</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Reports Submitted</span>
                    <span className="font-medium">45,672</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Bounties Paid</span>
                    <span className="font-medium">$2.4M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResearcherLayout>
  );
};

export default Leaderboard;
