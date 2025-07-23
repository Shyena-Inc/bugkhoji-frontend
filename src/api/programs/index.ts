import { useMutation, useQuery } from '@tanstack/react-query';
import api, { endpoints } from '@/utils/api';
import { AxiosError } from 'axios';
import { ErrorResponseI } from '@/types/context';

export function useGetAllPrograms(page: number) {
    return useQuery({
        queryKey: ['programs', page],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.programs.available, {
                withCredentials: true,
            });

            return response.data;
        },
        retry: 1,
    });
}

export function useGetAProgram(id: string) {
    return useQuery({
        queryKey: ['program', id],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.programs.just(id), {
                withCredentials: true,
            });
            return response.data;
        },
        retry: 1
    });
}

export function useLeavePrograms(id: string) {
    return useMutation<FormData, AxiosError<ErrorResponseI>, FormData>({
        mutationFn: async formData => {
            const response = await api.post(endpoints.researcher.programs.leave(id), formData);
            return response.data;
        },
    });
}