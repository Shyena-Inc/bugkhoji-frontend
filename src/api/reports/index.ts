import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '@/utils/api';

// GET Hooks
export function useGetAllReports(page: number = 1) {
    return useQuery({
        queryKey: ['reports', 'all', page],
        queryFn: async () => {
            // Use the direct endpoint path instead of endpoints.organizer.reports.all(page)
            const response = await api.get(`/api/v1/reports?page=${page}`, {
                withCredentials: true,
            });
            return response.data;
        },
        retry: 1,
    });
}
export function useGetMyReports(page: number = 1) {
    return useQuery({
        queryKey: ['reports', 'my-reports', page],
        queryFn: async () => {
            const response = await api.get('/api/v1/reports/my-reports', {
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
            const response = await api.get(`/api/v1/reports/${reportId}`, {
                withCredentials: true,
            });
            return response.data;
        },
        enabled: !!reportId,
        retry: 1,
    });
}

export function useGetReportsByProgram(programId: string, page: number = 1) {
    return useQuery({
        queryKey: ['reports', 'program', programId, page],
        queryFn: async () => {
            const response = await api.get(`/api/v1/reports/program/${programId}`, {
                params: { page },
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
            const response = await api.get(`/api/v1/reports/submission/${submissionId}`, {
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
            const response = await api.post('/api/v1/reports', reportData, {
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
            const response = await api.put(`/api/v1/reports/${id}`, data, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reports', 'detail', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['reports', 'all'] });
        },
    });
}

// DELETE Hooks
export function useDeleteReport() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reportId: string) => {
            const response = await api.delete(`/api/v1/reports/${reportId}`, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports', 'all'] });
        },
    });
}

// Additional Report Actions
export function usePublishReport() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reportId: string) => {
            const response = await api.put(`/api/v1/reports/${reportId}/publish`, {}, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

export function useUpdateReportStatus() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await api.put(`/api/v1/reports/${id}`, { 
                status 
            }, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

export function useAssignSeverity() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, severity }: { id: string; severity: string }) => {
            const response = await api.put(`/api/v1/reports/${id}`, { 
                severity 
            }, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

export function useApproveReport() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reportId: string) => {
            const response = await api.put(`/api/v1/reports/${reportId}`, { 
                status: 'approved' 
            }, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

export function useRejectReport() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reportId: string) => {
            const response = await api.put(`/api/v1/reports/${reportId}`, { 
                status: 'rejected' 
            }, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

export function useMarkDuplicate() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reportId: string) => {
            const response = await api.put(`/api/v1/reports/${reportId}`, { 
                status: 'duplicate' 
            }, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}

export function useAddComment() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, comment }: { id: string; comment: string }) => {
            // Since there's no specific comment endpoint, we'll update the report
            // You might want to add this to your backend
            const response = await api.put(`/api/v1/reports/${id}`, { 
                comment 
            }, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reports', 'detail', variables.id] });
        },
    });
}

export function useAssignReward() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, rewardAmount }: { id: string; rewardAmount: number }) => {
            const response = await api.put(`/api/v1/reports/${id}`, { 
                rewardAmount,
                status: 'paid'
            }, {
                withCredentials: true,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
}