// Environment variables
export const API_URL = import.meta.env.VITE_API_URL;
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'BugBounty Platform';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// File upload configurations
export const FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB for images
  DOCUMENT: 10 * 1024 * 1024, // 10MB for documents
  PROOF: 50 * 1024 * 1024, // 50MB for proof files
  AVATAR: 2 * 1024 * 1024, // 2MB for avatars
};

export const FILE_EXTENSIONS = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  PROOF: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/zip',
    'text/plain',
    'application/json',
  ],
  AVATAR: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
};

// User roles
export const USER_ROLES = {
  RESEARCHER: 'researcher',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.RESEARCHER]: [
    'submit_reports',
    'join_programs',
    'view_rewards',
    'update_profile',
    'upload_proof',
  ],
  [USER_ROLES.ORGANIZER]: [
    'create_programs',
    'manage_programs',
    'review_reports',
    'process_rewards',
    'invite_researchers',
    'view_analytics',
  ],
  [USER_ROLES.ADMIN]: [
    'manage_users',
    'moderate_content',
    'system_settings',
    'view_all_analytics',
    'manage_roles',
    'platform_maintenance',
  ],
};

// Program filters
export const programFilters = [
  // radio
  {
    id: 'status',
    name: 'Status',
    type: 'radio',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'paused', label: 'Paused' },
      { value: 'closed', label: 'Closed' },
    ],
  },
  // checkbox
  {
    id: 'difficulty',
    name: 'Difficulty Level',
    type: 'checkbox',
    options: [
      { value: 'beginner', label: 'Beginner Friendly' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'expert', label: 'Expert Only' },
    ],
  },
  // checkbox
  {
    id: 'reward_range',
    name: 'Reward Range',
    type: 'checkbox',
    options: [
      { value: '0-100', label: '$0 - $100' },
      { value: '100-500', label: '$100 - $500' },
      { value: '500-1000', label: '$500 - $1,000' },
      { value: '1000-5000', label: '$1,000 - $5,000' },
      { value: '5000+', label: '$5,000+' },
    ],
  },
  // checkbox
  {
    id: 'category',
    name: 'Category',
    type: 'checkbox',
    options: [
      { value: 'web', label: 'Web Application' },
      { value: 'mobile', label: 'Mobile Application' },
      { value: 'api', label: 'API/Web Service' },
      { value: 'network', label: 'Network Infrastructure' },
      { value: 'hardware', label: 'Hardware/IoT' },
      { value: 'blockchain', label: 'Blockchain/Crypto' },
    ],
  },
  // checkbox
  {
    id: 'company_size',
    name: 'Company Size',
    type: 'checkbox',
    options: [
      { value: 'startup', label: 'Startup' },
      { value: 'small', label: 'Small Business' },
      { value: 'medium', label: 'Medium Enterprise' },
      { value: 'large', label: 'Large Enterprise' },
      { value: 'fortune500', label: 'Fortune 500' },
    ],
  },
];

// Report filters
export const reportFilters = [
  // radio
  {
    id: 'status',
    name: 'Status',
    type: 'radio',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'submitted', label: 'Submitted' },
      { value: 'triaging', label: 'In Triage' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'duplicate', label: 'Duplicate' },
    ],
  },
  // checkbox
  {
    id: 'severity',
    name: 'Severity',
    type: 'checkbox',
    options: [
      { value: 'critical', label: 'Critical' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' },
      { value: 'informational', label: 'Informational' },
    ],
  },
  // checkbox
  {
    id: 'vulnerability_type',
    name: 'Vulnerability Type',
    type: 'checkbox',
    options: [
      { value: 'xss', label: 'Cross-Site Scripting (XSS)' },
      { value: 'sqli', label: 'SQL Injection' },
      { value: 'csrf', label: 'Cross-Site Request Forgery' },
      { value: 'auth_bypass', label: 'Authentication Bypass' },
      { value: 'priv_escalation', label: 'Privilege Escalation' },
      { value: 'rce', label: 'Remote Code Execution' },
      { value: 'ssrf', label: 'Server-Side Request Forgery' },
      { value: 'idor', label: 'Insecure Direct Object Reference' },
      { value: 'information_disclosure', label: 'Information Disclosure' },
      { value: 'other', label: 'Other' },
    ],
  },
  // checkbox
  {
    id: 'reward_status',
    name: 'Reward Status',
    type: 'checkbox',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'paid', label: 'Paid' },
      { value: 'disputed', label: 'Disputed' },
      { value: 'rejected', label: 'No Reward' },
    ],
  },
];

// Researcher filters
export const researcherFilters = [
  // checkbox
  {
    id: 'experience_level',
    name: 'Experience Level',
    type: 'checkbox',
    options: [
      { value: 'beginner', label: 'Beginner (0-1 years)' },
      { value: 'intermediate', label: 'Intermediate (1-3 years)' },
      { value: 'advanced', label: 'Advanced (3-5 years)' },
      { value: 'expert', label: 'Expert (5+ years)' },
    ],
  },
  // checkbox
  {
    id: 'specialization',
    name: 'Specialization',
    type: 'checkbox',
    options: [
      { value: 'web_security', label: 'Web Application Security' },
      { value: 'mobile_security', label: 'Mobile Security' },
      { value: 'network_security', label: 'Network Security' },
      { value: 'api_security', label: 'API Security' },
      { value: 'cloud_security', label: 'Cloud Security' },
      { value: 'blockchain_security', label: 'Blockchain Security' },
    ],
  },
  // checkbox
  {
    id: 'reputation_range',
    name: 'Reputation Score',
    type: 'checkbox',
    options: [
      { value: '0-100', label: '0 - 100' },
      { value: '100-500', label: '100 - 500' },
      { value: '500-1000', label: '500 - 1,000' },
      { value: '1000-5000', label: '1,000 - 5,000' },
      { value: '5000+', label: '5,000+' },
    ],
  },
];

// Reward filters
export const rewardFilters = [
  // radio
  {
    id: 'status',
    name: 'Status',
    type: 'radio',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'processing', label: 'Processing' },
      { value: 'paid', label: 'Paid' },
      { value: 'disputed', label: 'Disputed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
  // checkbox
  {
    id: 'amount_range',
    name: 'Amount Range',
    type: 'checkbox',
    options: [
      { value: '0-50', label: '$0 - $50' },
      { value: '50-100', label: '$50 - $100' },
      { value: '100-500', label: '$100 - $500' },
      { value: '500-1000', label: '$500 - $1,000' },
      { value: '1000-5000', label: '$1,000 - $5,000' },
      { value: '5000+', label: '$5,000+' },
    ],
  },
];

// Animation variants
export const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export const slideVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
};

export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

// Status configurations
export const REPORT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  TRIAGING: 'triaging',
  ACCEPTED: 'accepted',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  DUPLICATE: 'duplicate',
} as const;

export const PROGRAM_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CLOSED: 'closed',
  DRAFT: 'draft',
} as const;

export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFORMATIONAL: 'informational',
} as const;

export const REWARD_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PROCESSING: 'processing',
  PAID: 'paid',
  DISPUTED: 'disputed',
  CANCELLED: 'cancelled',
} as const;

// Color schemes for status
export const STATUS_COLORS = {
  [REPORT_STATUS.DRAFT]: 'gray',
  [REPORT_STATUS.SUBMITTED]: 'blue',
  [REPORT_STATUS.TRIAGING]: 'yellow',
  [REPORT_STATUS.ACCEPTED]: 'green',
  [REPORT_STATUS.RESOLVED]: 'emerald',
  [REPORT_STATUS.REJECTED]: 'red',
  [REPORT_STATUS.DUPLICATE]: 'orange',
  
  [SEVERITY_LEVELS.CRITICAL]: 'red',
  [SEVERITY_LEVELS.HIGH]: 'orange',
  [SEVERITY_LEVELS.MEDIUM]: 'yellow',
  [SEVERITY_LEVELS.LOW]: 'blue',
  [SEVERITY_LEVELS.INFORMATIONAL]: 'gray',
  
  [PROGRAM_STATUS.ACTIVE]: 'green',
  [PROGRAM_STATUS.PAUSED]: 'yellow',
  [PROGRAM_STATUS.CLOSED]: 'red',
//   [PROGRAM_STATUS.DRAFT]: 'gray',
  
  [REWARD_STATUS.PENDING]: 'yellow',
  [REWARD_STATUS.APPROVED]: 'blue',
  [REWARD_STATUS.PROCESSING]: 'purple',
  [REWARD_STATUS.PAID]: 'green',
  [REWARD_STATUS.DISPUTED]: 'red',
  [REWARD_STATUS.CANCELLED]: 'gray',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// Notification types
export const NOTIFICATION_TYPES = {
  REPORT_SUBMITTED: 'report_submitted',
  REPORT_ACCEPTED: 'report_accepted',
  REPORT_REJECTED: 'report_rejected',
  REWARD_APPROVED: 'reward_approved',
  REWARD_PAID: 'reward_paid',
  PROGRAM_INVITATION: 'program_invitation',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '__accessToken_',
  REFRESH_TOKEN: '__refreshToken_',
  USER_PREFERENCES: '__userPreferences_',
  THEME: '__theme_',
  LANGUAGE: '__language_',
} as const;

// Default values
export const DEFAULTS = {
  THEME: 'light',
  LANGUAGE: 'en',
  TIMEZONE: 'UTC',
  DATE_FORMAT: 'MMM dd, yyyy',
  TIME_FORMAT: 'HH:mm',
  CURRENCY: 'USD',
};

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  REPORT_TITLE_MIN_LENGTH: 10,
  REPORT_TITLE_MAX_LENGTH: 200,
  REPORT_DESCRIPTION_MIN_LENGTH: 50,
  REPORT_DESCRIPTION_MAX_LENGTH: 10000,
  PROGRAM_NAME_MIN_LENGTH: 5,
  PROGRAM_NAME_MAX_LENGTH: 100,
};

// Rate limiting
export const RATE_LIMITS = {
  REPORTS_PER_DAY: 10,
  COMMENTS_PER_HOUR: 30,
  PROFILE_UPDATES_PER_DAY: 5,
  PASSWORD_RESET_PER_HOUR: 3,
};

// Feature flags
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
  REAL_TIME_UPDATES: true,
  ANALYTICS: true,
  INTEGRATIONS: true,
  ADVANCED_SEARCH: true,
  BULK_OPERATIONS: true,
  EXPORT_DATA: true,
};

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS];
export type ProgramStatus = typeof PROGRAM_STATUS[keyof typeof PROGRAM_STATUS];
export type SeverityLevel = typeof SEVERITY_LEVELS[keyof typeof SEVERITY_LEVELS];
export type RewardStatus = typeof REWARD_STATUS[keyof typeof REWARD_STATUS];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];