import axios from 'axios';
import { API_URL } from './config-global';
import { QueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

let logoutCallback: (() => void) | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

const api = axios.create({
  baseURL: API_URL,
  headers: {  
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Prevent refresh token endpoint from triggering refresh loop
      if (originalRequest.url?.includes('/v1/refresh')) {
        console.error('Refresh token endpoint returned 401, logging out');
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.clear();
        if (logoutCallback) {
          logoutCallback();
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (token) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          }
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      const refreshToken = Cookies.get("refreshToken");
      
      if (!refreshToken) {
        console.error('No refresh token available, logging out');
        if (logoutCallback) {
          logoutCallback();
          localStorage.clear();
        }
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        // Make refresh request without interceptor to avoid infinite loop
        const refreshResponse = await axios.post(
          `${API_URL}/v1/refresh`, 
          {}, 
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const newAccessToken = refreshResponse.data.token || refreshResponse.data.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token received from refresh endpoint");
        }

        // Update the default authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        
        // Process queued requests
        processQueue(null, newAccessToken);
        
        // Retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Process queued requests with error
        processQueue(refreshError, null);
        
        // Clear tokens and logout
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.clear();
        
        if (logoutCallback) {
          logoutCallback();
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Request interceptor to add token to headers
api.interceptors.request.use(
  config => {
    console.log('Request interceptor - current headers:', config.headers);
    const token = Cookies.get("accessToken");
    console.log('Access token from cookies:', token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log('Authorization header set');
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { 
      refetchOnWindowFocus: false, 
      retry: (failureCount, error: any) => {
        // Don't retry on 401 errors to avoid unnecessary requests
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 3;
      }
    },
  },
});

export const endpoints = {
  auth: {
    loginAdmin: '/v1/login/admin',
    loginResearcher: '/v1/login/researcher',
    loginOrganization: '/v1/login/organization',
    registerResearcher: "/v1/register/researcher",
    registerOrganization: "/v1/register/organization",
    logout: '/auth/logout',
    rotateToken: '/v1/refresh',
    verify: '/auth/verify',
    resendVerification: '/auth/resend-verification',
  },

  user: {
    profile: '/api/user/profile',
    updateProfile: '/user/profile',
    uploadAvatar: '/user/avatar',
    getUserById: (id: string) => `/user/${id}`,
    getStats: '/user/stats',
    getReputationHistory: '/user/reputation-history',
    leaderboard: '/user/leaderboard',
    getNotifications: '/user/notifications',
    markNotificationRead: (id: string) => `/user/notifications/${id}/read`,
    updateRole: '/user/role',
    getRolePermissions: '/user/permissions',
  },

  password: {
    change: '/password/change',
    forgot: '/password/forgot',
    reset: '/password/reset',
    validate: '/password/validate',
  },

  researcher: {
    dashboard: '/researcher/dashboard',
    reports: {
      all : `/api/v1/reports`,
      draft: '/researcher/reports/draft',
      submitted:(id: string) => `/api/v1/reports/${id}/publish`,
      getByProgram: (programId: string) => `/api/v1/reports/program/${programId}`,
      getBySubmission: (submissionId: string) => `/api/v1/reports/submission/${submissionId}`,
      getById: (reportId: string) => `/api/v1/reports/submission/${reportId}`,
      myReports: '/api/v1/reports/my-reports',
      inProgress: '/researcher/reports/in-progress',
      resolved: '/researcher/reports/resolved',
      create: '/api/v1/reports',
      update: (id: string) => `api/v1/reports/${id}`,
      delete: (id: string) => `/api/v1/reports/${id}`,
      uploadProof: (id: string) => `/researcher/reports/${id}/proof`,
      addComment: (id: string) => `/researcher/reports/${id}/comments`,
    },
    programs: {
      available: '/api/v1/researcher/programs',
      just:(id: string) => `/api/v1/researcher/programs/${id}`,
      joined: '/researcher/programs/joined',
      join: (id: string) => `/researcher/programs/:id/leave`,
      leave: (id: string) => `/researcher/programs/${id}/leave`,
    },
    rewards: {
      pending: '/researcher/rewards/pending',
      received: '/researcher/rewards/received',
      total: '/researcher/rewards/total',
      history: '/researcher/rewards/history',
    },
    profile: {
      stats: '/researcher/profile/stats',
      reputation: '/researcher/profile/reputation',
      achievements: '/researcher/profile/achievements',
      skills: '/researcher/profile/skills',
      updateSkills: '/researcher/profile/skills',
    },
  },

  organizer: {
    dashboard: '/organizer/dashboard',
    programs: {
      all: (page: number = 1) => `/organizer/programs?page=${page}`,
      create: '/organizer/programs',
      update: (id: string) => `/organizer/programs/${id}`,
      delete: (id: string) => `/organizer/programs/${id}`,
      getById: (id: string) => `/organizer/programs/${id}`,
      getStats: (id: string) => `/organizer/programs/${id}/stats`,
      getParticipants: (id: string) => `/organizer/programs/${id}/participants`,
      invite: (id: string) => `/organizer/programs/${id}/invite`,
      removeParticipant: (programId: string, userId: string) => `/organizer/programs/${programId}/participants/${userId}`,
      publish: (id: string) => `/organizer/programs/${id}/publish`,
      pause: (id: string) => `/organizer/programs/${id}/pause`,
      resume: (id: string) => `/organizer/programs/${id}/resume`,
      archive: (id: string) => `/organizer/programs/${id}/archive`,
    },
    reports: {
      all: (page: number = 1) => `/organizer/reports?page=${page}`,
      getById: (id: string) => `/organizer/reports/${id}`,
      getByProgram: (programId: string, page: number = 1) => `/organizer/reports/program/${programId}?page=${page}`,
      updateStatus: (id: string) => `/organizer/reports/${id}/status`,
      assignSeverity: (id: string) => `/organizer/reports/${id}/severity`,
      approve: (id: string) => `/organizer/reports/${id}/approve`,
      reject: (id: string) => `/organizer/reports/${id}/reject`,
      markDuplicate: (id: string) => `/organizer/reports/${id}/duplicate`,
      addComment: (id: string) => `/organizer/reports/${id}/comments`,
      assignReward: (id: string) => `/organizer/reports/${id}/reward`,
    },
    rewards: {
      pending: '/organizer/rewards/pending',
      approved: '/organizer/rewards/approved',
      paid: '/organizer/rewards/paid',
      process: (id: string) => `/organizer/rewards/${id}/process`,
      budget: '/organizer/rewards/budget',
      statistics: '/organizer/rewards/statistics',
    },
    researchers: {
      all: '/organizer/researchers',
      getById: (id: string) => `/organizer/researchers/${id}`,
      getStats: (id: string) => `/organizer/researchers/${id}/stats`,
      invite: '/organizer/researchers/invite',
      block: (id: string) => `/organizer/researchers/${id}/block`,
      unblock: (id: string) => `/organizer/researchers/${id}/unblock`,
    },
    analytics: {
      dashboard: '/organizer/analytics/dashboard',
      reports: '/organizer/analytics/reports',
      programs: '/organizer/analytics/programs',
      researchers: '/organizer/analytics/researchers',
      export: (type: string) => `/organizer/analytics/export/${type}`,
    },
  },

  admin: {
    dashboard: '/admin/dashboard',
    users: {
      all: (page: number = 1) => `/admin/users?page=${page}`,
      getById: (id: string) => `/admin/users/${id}`,
      researchers: (page: number = 1) => `/admin/users/researchers?page=${page}`,
      organizers: (page: number = 1) => `/admin/users/organizers?page=${page}`,
      admins: (page: number = 1) => `/admin/users/admins?page=${page}`,
      ban: (id: string) => `/admin/users/${id}/ban`,
      unban: (id: string) => `/admin/users/${id}/unban`,
      updateRole: (id: string) => `/admin/users/${id}/role`,
      delete: (id: string) => `/admin/users/${id}`,
      verify: (id: string) => `/admin/users/${id}/verify`,
      stats: '/admin/users/stats',
    },
    programs: {
      all: (page: number = 1) => `/admin/programs?page=${page}`,
      pending: '/admin/programs/pending',
      approved: '/admin/programs/approved',
      rejected: '/admin/programs/rejected',
      approve: (id: string) => `/admin/programs/${id}/approve`,
      reject: (id: string) => `/admin/programs/${id}/reject`,
      suspend: (id: string) => `/admin/programs/${id}/suspend`,
      delete: (id: string) => `/admin/programs/${id}`,
      stats: '/admin/programs/stats',
    },
    reports: {
      all: (page: number = 1) => `/admin/reports?page=${page}`,
      flagged: '/admin/reports/flagged',
      disputed: '/admin/reports/disputed',
      moderate: (id: string) => `/admin/reports/${id}/moderate`,
      escalate: (id: string) => `/admin/reports/${id}/escalate`,
      delete: (id: string) => `/admin/reports/${id}`,
      stats: '/admin/reports/stats',
    },
    rewards: {
      all: (page: number = 1) => `/admin/rewards?page=${page}`,
      pending: '/admin/rewards/pending',
      disputed: '/admin/rewards/disputed',
      approve: (id: string) => `/admin/rewards/${id}/approve`,
      reject: (id: string) => `/admin/rewards/${id}/reject`,
      stats: '/admin/rewards/stats',
    },
    system: {
      settings: '/admin/system/settings',
      updateSettings: '/admin/system/settings',
      backup: '/admin/system/backup',
      logs: '/admin/system/logs',
      maintenance: '/admin/system/maintenance',
      notifications: '/admin/system/notifications',
    },
    analytics: {
      overview: '/admin/analytics/overview',
      users: '/admin/analytics/users',
      programs: '/admin/analytics/programs',
      reports: '/admin/analytics/reports',
      revenue: '/admin/analytics/revenue',
      export: (type: string) => `/admin/analytics/export/${type}`,
    },
    roles: {
      permissions: '/admin/roles/permissions',
      assign: '/admin/roles/assign',
      revoke: '/admin/roles/revoke',
      create: '/admin/roles/create',
      update: (id: string) => `/admin/roles/${id}`,
      delete: (id: string) => `/admin/roles/${id}`,
    },
  },

  notifications: {
    all: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    getUnreadCount: '/notifications/unread-count',
    subscribe: '/notifications/subscribe',
    unsubscribe: '/notifications/unsubscribe',
    preferences: '/notifications/preferences',
  },

  uploads: {
    image: '/uploads/image',
    document: '/uploads/document',
    proof: '/uploads/proof',
    avatar: '/uploads/avatar',
    logo: '/uploads/logo',
  },

  public: {
    programs: '/public/programs',
    stats: '/public/stats',
    leaderboard: '/public/leaderboard',
    hall_of_fame: '/public/hall-of-fame',
  },
};

export default api;