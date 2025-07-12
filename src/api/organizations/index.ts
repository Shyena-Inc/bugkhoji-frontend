import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '@/utils/api';


export function useGetAllOrganizers(page: number) {
    return useQuery({
        queryKey: ['organizers', page],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.programs.available, {
                withCredentials: true,
            });

            return response.data;
        },
        retry: 1,
    });
}