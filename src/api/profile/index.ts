import api, { endpoints } from "@/utils/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import Cookies from 'js-cookie';
// Define the user profile type (adjust based on your actual data structure)
interface UserProfile {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  role?: string;
  verified?: boolean;
  type?: string;
  reportsSubmitted?: number;
  totalRewards?: string;
  currentRank?: string;
  reputationScore?: number;
  recentReports?: Array<{
    id: string;
    title: string;
    date: string;
    severity: string;
    status: string;
  }>;
}

type UseGetProfileOptions = Omit<UseQueryOptions<UserProfile>, 'queryKey' | 'queryFn'>;

export function useGetProfile(options: UseGetProfileOptions = {}) {
    return useQuery<UserProfile>({
        queryKey: ['user-profile'],
        queryFn: async () => {
            // Debug before making the call
            const token = Cookies.get("__accessToken_");
            console.log('🚀 Making API call with token:', token ? 'EXISTS' : 'MISSING');
            
            if (!token) {
                throw new Error('No authentication token found in cookies');
            }
            
            const response = await api.get(endpoints.user.profile);
            console.log('✅ Profile response:', response.data);
            return response.data.data;
        },
        retry: 1,
        staleTime: 5 * 60 * 1000,
        ...options
    });
}