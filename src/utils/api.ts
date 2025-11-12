import axios from 'axios';
import { API_URL } from './config-global';
import { QueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { ErrorHandler } from './errorHandler';

let logoutCallback: (() => void) | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Rate limiting queue implementation
interface QueuedRequest {
  config: any;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
  retryCount: number;
}

class RateLimitQueue {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private requestCounts = new Map<string, number>();
  private resetTimes = new Map<string, number>();
  
  // Configuration
  private readonly maxRequestsPerMinute = 60;
  private readonly maxRequestsPerHour = 1000;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // Base delay in ms
  private readonly backoffMultiplier = 2;

  constructor() {
    // Clean up old request counts every minute
    setInterval(() => this.cleanupOldCounts(), 60000);
  }

  private cleanupOldCounts() {
    const now = Date.now();
    for (const [key, resetTime] of this.resetTimes.entries()) {
      if (now > resetTime) {
        this.requestCounts.delete(key);
        this.resetTimes.delete(key);
      }
    }
  }

  private getMinuteKey(): string {
    return `minute_${Math.floor(Date.now() / 60000)}`;
  }

  private getHourKey(): string {
    return `hour_${Math.floor(Date.now() / 3600000)}`;
  }

  private canMakeRequest(): boolean {
    const minuteKey = this.getMinuteKey();
    const hourKey = this.getHourKey();
    
    const requestsThisMinute = this.requestCounts.get(minuteKey) || 0;
    const requestsThisHour = this.requestCounts.get(hourKey) || 0;
    
    return requestsThisMinute < this.maxRequestsPerMinute && 
           requestsThisHour < this.maxRequestsPerHour;
  }

  private incrementRequestCount() {
    const now = Date.now();
    const minuteKey = this.getMinuteKey();
    const hourKey = this.getHourKey();
    
    // Increment minute counter
    this.requestCounts.set(minuteKey, (this.requestCounts.get(minuteKey) || 0) + 1);
    this.resetTimes.set(minuteKey, now + 60000);
    
    // Increment hour counter
    this.requestCounts.set(hourKey, (this.requestCounts.get(hourKey) || 0) + 1);
    this.resetTimes.set(hourKey, now + 3600000);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateRetryDelay(retryCount: number): number {
    return this.retryDelay * Math.pow(this.backoffMultiplier, retryCount);
  }

  async enqueue(config: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        config,
        resolve,
        reject,
        timestamp: Date.now(),
        retryCount: 0
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      if (!this.canMakeRequest()) {
        // Wait until we can make requests again
        const waitTime = Math.min(
          60000 - (Date.now() % 60000), // Wait until next minute
          1000 // But check every second
        );
        await this.delay(waitTime);
        continue;
      }

      const queuedRequest = this.queue.shift();
      if (!queuedRequest) continue;

      try {
        this.incrementRequestCount();
        
        // Make the actual request using the base axios instance (not the intercepted one)
        const response = await axios(queuedRequest.config);
        queuedRequest.resolve(response);

      } catch (error: any) {
        const isRateLimited = error.response?.status === 429 || 
                             error.response?.status === 503 ||
                             error.code === 'ECONNABORTED';

        if (isRateLimited && queuedRequest.retryCount < this.maxRetries) {
          // Retry with exponential backoff
          queuedRequest.retryCount++;
          const retryDelay = this.calculateRetryDelay(queuedRequest.retryCount);
          
          console.warn(`Rate limited, retrying in ${retryDelay}ms (attempt ${queuedRequest.retryCount}/${this.maxRetries})`);
          
          await this.delay(retryDelay);
          
          // Re-queue the request
          this.queue.unshift(queuedRequest);
          continue;
        }

        queuedRequest.reject(error);
      }

      // Small delay between requests to be respectful
      await this.delay(50);
    }

    this.processing = false;
  }

  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      requestsThisMinute: this.requestCounts.get(this.getMinuteKey()) || 0,
      requestsThisHour: this.requestCounts.get(this.getHourKey()) || 0,
      maxRequestsPerMinute: this.maxRequestsPerMinute,
      maxRequestsPerHour: this.maxRequestsPerHour
    };
  }

  clear() {
    this.queue.forEach(req => {
      req.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    this.processing = false;
  }
}

// Create rate limit queue instance
const rateLimitQueue = new RateLimitQueue();

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
  withCredentials: true,
  timeout: 30000 // 30 second timeout
});

// Request interceptor to add rate limiting
api.interceptors.request.use(
  async config => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Check if this should be rate limited (skip auth endpoints)
    const skipRateLimit = config.url?.includes('/v1/refresh') || 
                         config.url?.includes('/login') ||
                         config.url?.includes('/register');

    if (!skipRateLimit) {
      // Route through rate limiting queue
      try {
        const response = await rateLimitQueue.enqueue({
          ...config,
          baseURL: API_URL
        });
        // Return the response directly to bypass the normal request
        return Promise.reject({ 
          __isRateLimitedResponse: true, 
          response 
        });
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    // Handle rate limited responses
    if (error.__isRateLimitedResponse) {
      return Promise.resolve(error.response);
    }

    const originalRequest = error.config;

    // Log error for debugging
    ErrorHandler.logError(error, 'API Request');

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
        }
        localStorage.clear();
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        // Make refresh request with proper headers (bypass rate limiting for auth)
        const refreshResponse = await axios.post(
          `${API_URL}/v1/refresh`, 
          {}, 
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshToken}`
            }
          }
        );

        const newAccessToken = refreshResponse.data.token || refreshResponse.data.accessToken;
        const newRefreshToken = refreshResponse.data.refreshToken;

        if (!newAccessToken) {
          throw new Error("No access token received from refresh endpoint");
        }

        // Store new tokens in cookies
        Cookies.set("accessToken", newAccessToken, { 
          expires: 1, // 1 day
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        // Store new refresh token if provided
        if (newRefreshToken) {
          Cookies.set("refreshToken", newRefreshToken, { 
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
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

    // Handle rate limit errors
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
      
      console.warn(`Rate limited. Waiting ${waitTime}ms before retry`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Helper function to set tokens after login
export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, { 
    expires: 1, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  Cookies.set("refreshToken", refreshToken, { 
    expires: 7, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const clearTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  delete api.defaults.headers.common["Authorization"];
  localStorage.clear();
  
  // Clear the rate limit queue
  rateLimitQueue.clear();
};

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Export rate limit queue status for monitoring
export const getRateLimitStatus = () => {
  return rateLimitQueue.getQueueStatus();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { 
      refetchOnWindowFocus: false, 
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) {
          return false;
        }
        // Don't retry rate limited requests (they're handled by the queue)
        if (error?.response?.status === 429) {
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
    logout: '/v1/logout',
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
   profile: {
    // User profile endpoints
    getUserProfile: '/api/user/profile',
    updateUserProfile: '/api/user/profile',
    deleteUserProfile: '/api/user/profile',
    
    // Organization profile endpoints
    getOrganizationProfile: '/api/user/organization/profile',
    updateOrganizationProfile: '/api/user/organization/profile',
    deleteOrganizationProfile: '/api/user/organization/profile',
    
    // Public profile endpoints
    getPublicUserProfile: (userId: string) => `/api/v1/profile/public/user/${userId}`,
    getPublicOrganizationProfile: (organizationId: string) => `/api/v1/profile/public/organization/${organizationId}`,
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
  // Organization endpoints
  all: (page: number = 1) => `/api/v1/programs?page=${page}`,
  create: '/api/v1/programs',
  update: (id: string) => `/api/v1/programs/${id}`,
  delete: (id: string) => `/api/v1/programs/${id}`,
  getById: (id: string) => `/api/v1/programs/${id}`,
  
  // These endpoints don't exist in your backend routes - need to be added
  getStats: (id: string) => `/api/v1/programs/${id}/stats`,
  getParticipants: (id: string) => `/api/v1/programs/${id}/participants`,
  invite: (id: string) => `/api/v1/programs/${id}/invite`,
  removeParticipant: (programId: string, userId: string) => `/api/v1/programs/${programId}/participants/${userId}`,
  
  // Status updates - these need to be mapped to your existing status endpoint
  publish: (id: string) => `/api/v1/programs/${id}/status`, // Use PATCH with status: 'active'
  pause: (id: string) => `/api/v1/programs/${id}/status`,   // Use PATCH with status: 'paused'
  resume: (id: string) => `/api/v1/programs/${id}/status`,  // Use PATCH with status: 'active'
  archive: (id: string) => `/api/v1/programs/${id}/status`, // Use PATCH with status: 'archived'
},ts: {
      all: (page: number = 1) => `/api/v1/reports?page=${page}`,
      getById: (id: string) => `/api/v1/reports/${id}`,
      getByProgram: (programId: string, page: number = 1) => `/api/v1/reports/program/${programId}?page=${page}`,
      getBySubmission: (submissionId: string) => `/api/v1/reports/submission/${submissionId}`,
      create: '/api/v1/reports',
      update: (id: string) => `/api/v1/reports/${id}`,
      delete: (id: string) => `/api/v1/reports/${id}`,
      publish: (id: string) => `/api/v1/reports/${id}/publish`,
      myReports: '/api/v1/reports/my-reports',
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
    dashboard: '/api/v1/admin/dashboard',
    users: {
      all: (page: number = 1) => `/api/v1/admin/users?page=${page}`,
      getById: (id: string) => `/api/v1/admin/users/${id}`,
      ban: (id: string) => `/api/v1/admin/users/${id}/ban`,
      unban: (id: string) => `/api/v1/admin/users/${id}/unban`,
      updateRole: (id: string) => `/api/v1/admin/users/${id}/role`,
      delete: (id: string) => `/api/v1/admin/users/${id}`,
      verify: (id: string) => `/api/v1/admin/users/${id}/verify`,
      stats: '/api/v1/admin/users/stats',
    },
    programs: {
      all: (page: number = 1) => `/api/v1/admin/programs?page=${page}`,
      approve: (id: string) => `/api/v1/admin/programs/${id}/approve`,
      reject: (id: string) => `/api/v1/admin/programs/${id}/reject`,
      suspend: (id: string) => `/api/v1/admin/programs/${id}/suspend`,
      delete: (id: string) => `/api/v1/admin/programs/${id}`,
      stats: '/api/v1/admin/programs/stats',
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
    verifications: {
      pending: '/api/v1/admin/verifications/pending',
      approve: (id: string) => `/api/v1/admin/organizations/${id}/approve`,
      reject: (id: string) => `/api/v1/admin/organizations/${id}/reject`,
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

  contact: {
    submit: '/api/v1/contact',
    support: '/api/v1/contact/support',
  },
};

export default api;