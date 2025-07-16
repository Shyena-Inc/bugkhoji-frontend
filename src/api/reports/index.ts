import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from '@/utils/api';


export function useGetAllReports(page: number) {
    return useQuery({
        queryKey: ['programs', page],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.reports.myReports, {
                withCredentials: true,
            });

            return response.data;
        },
        retry: 1,
    });
}
