import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '@/utils/api';

// GET Hooks
export function useGetAllReports(page: number) {
    return useQuery({
        queryKey: ['reports', 'all', page],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.reports.all, {
                params: { page },
                withCredentials: true,
            });
            return response.data;
        },
        retry: 1,
    });
}

export function useGetMyReports(page: number) {
    return useQuery({
        queryKey: ['reports', 'my-reports', page],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.reports.myReports, {
                params: { page },
                withCredentials: true,
            });
            return response.data;
        },
        retry: 1,
    });
}

export function useGetReportById(reportId: string) {
    return useQuery({
        queryKey: ['reports', 'detail', reportId],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.reports.getById(reportId), {
                withCredentials: true,
            });
            return response.data;
        },
        enabled: !!reportId,
        retry: 1,
    });
}

export function useGetReportsByProgram(programId: string) {
    return useQuery({
        queryKey: ['reports', 'program', programId],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.reports.getByProgram(programId), {
                withCredentials: true,
            });
            return response.data;
        },
        enabled: !!programId,
        retry: 1,
    });
}

export function useGetReportsBySubmission(submissionId: string) {
    return useQuery({
        queryKey: ['reports', 'submission', submissionId],
        queryFn: async () => {
            const response = await api.get(endpoints.researcher.reports.getBySubmission(submissionId), {
                withCredentials: true,
            });
            return response.data;
        },
        enabled: !!submissionId,
        retry: 1,
    });
}

// POST/CREATE Hooks
export function useCreateReport() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reportData: any) => {
            const response = await api.post(endpoints.researcher.reports.create, reportData, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

export function useSubmitReport() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reportId: string) => {
            const response = await api.post(endpoints.researcher.reports.submitted(reportId), {}, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

// PUT/UPDATE Hooks
export function useUpdateReport() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await api.put(endpoints.researcher.reports.update(id), data, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            // Invalidate specific report and all reports queries
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

// DELETE Hooks
export function useDeleteReport() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reportId: string) => {
            const response = await api.delete(endpoints.researcher.reports.delete(reportId), {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

// FILE UPLOAD Hooks
export function useUploadProof() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, file }: { id: string; file: File }) => {
            const formData = new FormData();
            formData.append('proof', file);
            
            const response = await api.post(endpoints.researcher.reports.uploadProof(id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

export function useAddComment() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, comment }: { id: string; comment: string }) => {
            const response = await api.post(endpoints.researcher.reports.addComment(id), { comment }, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}