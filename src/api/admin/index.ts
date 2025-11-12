import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '@/utils/api';

// ============================
// Dashboard
// ============================

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.dashboard);
      return data;
    },
  });
}

// ============================
// User Management
// ============================

export function useGetAllUsers(page: number = 1, filters?: { role?: string; search?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['admin', 'users', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (filters?.role) params.append('role', filters.role);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      
      const { data } = await api.get(`${endpoints.admin.users.all(page)}&${params.toString()}`);
      return data;
    },
  });
}

export function useGetUserById(id: string) {
  return useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.users.getById(id));
      return data;
    },
    enabled: !!id,
  });
}

export function useGetUserStats() {
  return useQuery({
    queryKey: ['admin', 'users', 'stats'],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.users.stats);
      return data;
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data } = await api.post(endpoints.admin.users.ban(id), { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(endpoints.admin.users.unban(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { data } = await api.patch(endpoints.admin.users.updateRole(id), { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(endpoints.admin.users.delete(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(endpoints.admin.users.verify(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// ============================
// Program Management
// ============================

export function useGetAllPrograms(page: number = 1, filters?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'programs', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      
      const { data } = await api.get(`${endpoints.admin.programs.all(page)}&${params.toString()}`);
      return data;
    },
  });
}

export function useGetProgramStats() {
  return useQuery({
    queryKey: ['admin', 'programs', 'stats'],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.programs.stats);
      return data;
    },
  });
}

export function useApproveProgram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(endpoints.admin.programs.approve(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] });
    },
  });
}

export function useRejectProgram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data } = await api.post(endpoints.admin.programs.reject(id), { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] });
    },
  });
}

export function useSuspendProgram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data } = await api.post(endpoints.admin.programs.suspend(id), { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(endpoints.admin.programs.delete(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] });
    },
  });
}

// ============================
// Organization Verification
// ============================

export function useGetPendingVerifications() {
  return useQuery({
    queryKey: ['admin', 'verifications', 'pending'],
    queryFn: async () => {
      const { data } = await api.get(endpoints.admin.verifications.pending);
      return data;
    },
  });
}

export function useApproveOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const { data } = await api.post(endpoints.admin.verifications.approve(id), { notes });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useRejectOrganization() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.post(endpoints.admin.verifications.reject(id), { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
