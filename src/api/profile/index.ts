import { useQuery } from '@tanstack/react-query';
import api, { endpoints } from "@/utils/api";

export const useGetProfile = (options = {}) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get(endpoints.user.profile, {
        withCredentials: true,
      });
      return response.data;
    },
    ...options,
  });
};