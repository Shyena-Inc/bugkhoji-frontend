import { useMutation, useQuery } from '@tanstack/react-query';
import api, { endpoints } from '@/utils/api';
import { AxiosError } from 'axios';
import { ErrorResponseI } from '@/types/context';

//researcher side 
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

// Get all organization programs with pagination
export function useGetOrganizationPrograms(page: number = 1) {
    return useQuery({
        queryKey: ['organization-programs', page],
        queryFn: async () => {
            const response = await api.get(`/api/v1/programs?page=${page}`, {
                withCredentials: true,
            });
            return response.data;
        },
        retry: 1,
    });
}

// Get a single program by ID
export function useGetOrganizationProgram(id: string) {
    return useQuery({
        queryKey: ['organization-program', id],
        queryFn: async () => {
            const response = await api.get(`/api/v1/programs/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },
        retry: 1,
        enabled: !!id,
    });
}

// Get program statistics - This endpoint doesn't exist in your backend
// You'll need to add this route or modify to use existing data
export function useGetProgramStats(id: string) {
    return useQuery({
        queryKey: ['program-stats', id],
        queryFn: async () => {
            // Since /stats endpoint doesn't exist, we'll use the main program data
            // and extract stats from the _count fields
            const response = await api.get(`/api/v1/programs/${id}`, {
                withCredentials: true,
            });
            
            // Transform the response to match expected stats format
            const program = response.data;
            return {
                participants: program._count?.participants || 0,
                submissions: program._count?.submissions || 0,
                validReports: program._count?.reports || 0,
                totalRewards: 0, // You'll need to add this to your backend
            };
        },
        retry: 1,
        enabled: !!id,
    });
}

// Get program participants - This endpoint doesn't exist in your backend
// You'll need to add this route
export function useGetProgramParticipants(id: string) {
    return useQuery({
        queryKey: ['program-participants', id],
        queryFn: async () => {
            // This endpoint doesn't exist in your backend routes
            // You'll need to add: router.get("/programs/:id/participants", ...)
            const response = await api.get(`/api/v1/programs/${id}/participants`, {
                withCredentials: true,
            });
            return response.data;
        },
        retry: 1,
        enabled: !!id,
    });
}

// Create new program
export function useCreateProgram() {
    return useMutation<any, AxiosError<ErrorResponseI>, FormData>({
        mutationFn: async (formData) => {
            const response = await api.post('/api/v1/programs', formData, {
                withCredentials: true,
            });
            return response.data;
        },
    });
}

// Update existing program
export function useUpdateProgram(id: string) {
    return useMutation<any, AxiosError<ErrorResponseI>, FormData>({
        mutationFn: async (formData) => {
            const response = await api.put(`/api/v1/programs/${id}`, formData, {
                withCredentials: true,
            });
            return response.data;
        },
    });
}

// Delete program
export function useDeleteProgram() {
    return useMutation<any, AxiosError<ErrorResponseI>, string>({
        mutationFn: async (id) => {
            const response = await api.delete(`/api/v1/programs/${id}`, {
                withCredentials: true,
            });
            return response.data;
        },
    });
}

// Publish program - Uses the status endpoint
export function usePublishProgram() {
    return useMutation<any, AxiosError<ErrorResponseI>, string>({
        mutationFn: async (id) => {
            const response = await api.patch(`/api/v1/programs/${id}/status`, 
                { status: 'active' },
                { withCredentials: true }
            );
            return response.data;
        },
    });
}

// Pause program - Uses the status endpoint
export function usePauseProgram() {
    return useMutation<any, AxiosError<ErrorResponseI>, string>({
        mutationFn: async (id) => {
            const response = await api.patch(`/api/v1/programs/${id}/status`, 
                { status: 'paused' },
                { withCredentials: true }
            );
            return response.data;
        },
    });
}

// Resume program - Uses the status endpoint
export function useResumeProgram() {
    return useMutation<any, AxiosError<ErrorResponseI>, string>({
        mutationFn: async (id) => {
            const response = await api.patch(`/api/v1/programs/${id}/status`, 
                { status: 'active' },
                { withCredentials: true }
            );
            return response.data;
        },
    });
}

// Archive program - Uses the status endpoint (maps to 'closed' in backend)
export function useArchiveProgram() {
    return useMutation<any, AxiosError<ErrorResponseI>, string>({
        mutationFn: async (id) => {
            const response = await api.patch(`/api/v1/programs/${id}/status`, 
                { status: 'archived' }, // Backend will map this to 'CLOSED'
                { withCredentials: true }
            );
            return response.data;
        },
    });
}

// Invite researchers to program - This endpoint doesn't exist
// You'll need to add this route
export function useInviteResearchers() {
    return useMutation<any, AxiosError<ErrorResponseI>, { id: string; emails: string[] }>({
        mutationFn: async ({ id, emails }) => {
            const response = await api.post(`/api/v1/programs/${id}/invite`, 
                { emails }, 
                { withCredentials: true }
            );
            return response.data;
        },
    });
}

// Remove participant from program - This endpoint doesn't exist
// You'll need to add this route
export function useRemoveParticipant() {
    return useMutation<any, AxiosError<ErrorResponseI>, { programId: string; userId: string }>({
        mutationFn: async ({ programId, userId }) => {
            const response = await api.delete(`/api/v1/programs/${programId}/participants/${userId}`, {
                withCredentials: true,
            });
            return response.data;
        },
    });
}

// Upload program logo from file
export function useUploadProgramLogo(programId: string) {
    return useMutation<any, AxiosError<ErrorResponseI>, FormData>({
        mutationFn: async (formData) => {
            const response = await api.post(`/api/v1/programs/${programId}/logo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            return response.data;
        },
    });
}

// Upload program logo from URL
export function useUploadProgramLogoFromUrl(programId: string) {
    return useMutation<any, AxiosError<ErrorResponseI>, { websiteUrl: string }>({
        mutationFn: async (data) => {
            const response = await api.post(`/api/v1/programs/${programId}/logo-from-url`, data, {
                withCredentials: true,
            });
            return response.data;
        },
    });
}

// Delete program logo
export function useDeleteProgramLogo(programId: string) {
    return useMutation<any, AxiosError<ErrorResponseI>, void>({
        mutationFn: async () => {
            const response = await api.delete(`/api/v1/programs/${programId}/logo`, {
                withCredentials: true,
            });
            return response.data;
        },
    });
}