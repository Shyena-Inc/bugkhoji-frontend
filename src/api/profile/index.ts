import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '@/utils/api';

// User profile hooks
export const useUserProfile = (p0: { enabled: boolean; }) => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => api.get(endpoints.profile.getUserProfile).then(res => res.data),
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => 
      api.put(endpoints.profile.updateUserProfile, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

// Organization profile hooks
export const useOrganizationProfile = (p0: { enabled: boolean; }) => {
  return useQuery({
    queryKey: ['organizationProfile'],
    queryFn: () => api.get(endpoints.profile.getOrganizationProfile).then(res => res.data),
  });
};

export const useUpdateOrganizationProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => 
      api.put(endpoints.profile.updateOrganizationProfile, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizationProfile'] });
    },
  });
};

// Public profile hooks
export const usePublicUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['publicUserProfile', userId],
    queryFn: () => 
      api.get(endpoints.profile.getPublicUserProfile(userId)).then(res => res.data),
    enabled: !!userId,
  });
};

export const usePublicOrganizationProfile = (organizationId: string) => {
  return useQuery({
    queryKey: ['publicOrganizationProfile', organizationId],
    queryFn: () => 
      api.get(endpoints.profile.getPublicOrganizationProfile(organizationId)).then(res => res.data),
    enabled: !!organizationId,
  });
};