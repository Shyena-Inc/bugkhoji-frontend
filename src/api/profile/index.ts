import api, { endpoints } from "@/utils/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

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

export function useGetProfile(id: string | undefined, options: UseGetProfileOptions = {}) {
    return useQuery<UserProfile>({
        queryKey: ['users', id],
        queryFn: async () => {
            if (!id) {
                throw new Error('User ID is required');
            }
            
            const response = await api.get(endpoints.user.profile);
            console.log('Profile data:', response.data);
            return response.data;
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes - profile data doesn't change frequently
        // Don't run the query if no ID is provided
        enabled: !!id,
        // Allow additional options to be passed
        ...options
    });
}