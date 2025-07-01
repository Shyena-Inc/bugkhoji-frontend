import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '@/utils/api';


export function useGetAllOrganizers(page: number) {
    return useQuery({
        queryKey: ['problems', page],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.reports.all(page), {
                withCredentials: true,
            });

            return response.data;
        },
        retry: 1,
    });
}