import api, { endpoints } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

interface LeaderboardParams {
  limit?: number;
  period?: 'week' | 'month' | 'year' | 'all';
}

interface LeaderboardEntry {
  id: string;
  username: string;
  name: string;
  logo: string | null;
  totalReports: number;
  acceptedReports: number;
  totalRewards: number;
  score: number;
  reputation: number;
  rank: number;
  joinedAt: string;
}

export function useGetLeaderboard(params?: LeaderboardParams) {
    const { limit = 50, period = 'all' } = params || {};
    
    return useQuery({
        queryKey: ['leaderboard', limit, period],
        queryFn: async () => {
            const response = await api.get(endpoints.user.leaderboard, {
                params: { limit, period }
            });
            return response.data?.data as LeaderboardEntry[];      
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    });
}