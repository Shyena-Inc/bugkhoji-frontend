import api, { endpoints } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export function useGetProfile(id:string) {
    return useQuery({
        queryKey: ['users',id],
        queryFn: async () => {
            const response = await api.get(endpoints.user.profile(id));
            console.log(response.data)
            return response.data;
            
        }
        , retry: 1,
    });
}