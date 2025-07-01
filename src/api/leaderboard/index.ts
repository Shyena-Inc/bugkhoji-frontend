import api, { endpoints } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export function useGetLeaderboard() {
    return useQuery({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            const response = await api.get(endpoints.user.leaderboard);
            return response.data?.data;      
        }
        , retry: 1
    });
}