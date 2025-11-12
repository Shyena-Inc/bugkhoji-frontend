import { toast } from '@/hooks/use-toast';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  field?: string;
}

export class ErrorHandler {
  /**
   * Handle API errors and display appropriate toast notifications
   */
  static handleApiError(error: any, customMessage?: string): ApiError {
    console.error('API Error:', error);

    let errorMessage = customMessage || 'An unexpected error occurred';
    let status: number | undefined;
    let code: string | undefined;
    let field: string | undefined;

    if (error.response) {
      // Server responded with error status
      status = error.response.status;
      const data = error.response.data;

      // Extract error message from various response formats
      errorMessage = 
        data?.error?.message ||
        data?.message ||
        data?.error ||
        this.getStatusMessage(status);

      code = data?.error?.code || data?.code;
      field = data?.error?.field || data?.field;

      // Handle specific status codes
      switch (status) {
        case 400:
          errorMessage = data?.message || 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Your session has expired. Please log in again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = data?.message || 'The requested resource was not found.';
          break;
        case 409:
          errorMessage = data?.message || 'This resource already exists.';
          break;
        case 413:
          errorMessage = 'File is too large. Please upload a smaller file.';
          break;
        case 422:
          errorMessage = data?.message || 'Validation failed. Please check your input.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
      }
    } else if (error.request) {
      // Request made but no response received
      errorMessage = 'Network error. Please check your connection and try again.';
      code = 'NETWORK_ERROR';
    } else {
      // Error in request setup
      errorMessage = error.message || 'An unexpected error occurred';
    }

    // Show toast notification
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });

    return {
      message: errorMessage,
      status,
      code,
      field,
    };
  }

  /**
   * Handle form validation errors
   */
  static handleValidationError(errors: Record<string, string[]>): void {
    const firstError = Object.values(errors)[0]?.[0];
    if (firstError) {
      toast({
        title: 'Validation Error',
        description: firstError,
        variant: 'destructive',
      });
    }
  }

  /**
   * Handle file upload errors
   */
  static handleUploadError(error: any): ApiError {
    let errorMessage = 'Failed to upload file';

    if (error.response?.status === 413) {
      errorMessage = 'File is too large. Maximum size is 5MB.';
    } else if (error.response?.status === 415) {
      errorMessage = 'Invalid file type. Please upload a supported format.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    toast({
      title: 'Upload Failed',
      description: errorMessage,
      variant: 'destructive',
    });

    return {
      message: errorMessage,
      status: error.response?.status,
    };
  }

  /**
   * Get user-friendly message for HTTP status codes
   */
  private static getStatusMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Bad request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not found',
      409: 'Conflict',
      413: 'Payload too large',
      422: 'Validation failed',
      429: 'Too many requests',
      500: 'Internal server error',
      502: 'Bad gateway',
      503: 'Service unavailable',
      504: 'Gateway timeout',
    };

    return messages[status] || `Error ${status}`;
  }

  /**
   * Show success toast
   */
  static showSuccess(message: string, description?: string): void {
    toast({
      title: message,
      description,
      variant: 'default',
    });
  }

  /**
   * Show info toast
   */
  static showInfo(message: string, description?: string): void {
    toast({
      title: message,
      description,
      variant: 'default',
    });
  }

  /**
   * Show warning toast
   */
  static showWarning(message: string, description?: string): void {
    toast({
      title: message,
      description,
      variant: 'default',
    });
  }

  /**
   * Log error for debugging (can be extended to send to error tracking service)
   */
  static logError(error: any, context?: string): void {
    console.error(`[${context || 'Error'}]:`, error);
    
    // In production, you could send this to an error tracking service like Sentry
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { tags: { context } });
    }
  }
}

/**
 * Retry mechanism for failed requests
 */
export class RetryHandler {
  private static readonly DEFAULT_MAX_RETRIES = 3;
  private static readonly DEFAULT_RETRY_DELAY = 1000; // 1 second
  private static readonly BACKOFF_MULTIPLIER = 2;

  /**
   * Retry a function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number;
      retryDelay?: number;
      onRetry?: (attempt: number, error: any) => void;
      shouldRetry?: (error: any) => boolean;
    } = {}
  ): Promise<T> {
    const {
      maxRetries = this.DEFAULT_MAX_RETRIES,
      retryDelay = this.DEFAULT_RETRY_DELAY,
      onRetry,
      shouldRetry = this.defaultShouldRetry,
    } = options;

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Check if we should retry
        if (attempt < maxRetries && shouldRetry(error)) {
          const delay = retryDelay * Math.pow(this.BACKOFF_MULTIPLIER, attempt);
          
          if (onRetry) {
            onRetry(attempt + 1, error);
          }

          console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
          await this.delay(delay);
        } else {
          break;
        }
      }
    }

    throw lastError;
  }

  /**
   * Default retry logic - retry on network errors and 5xx errors
   */
  private static defaultShouldRetry(error: any): boolean {
    // Retry on network errors
    if (!error.response) {
      return true;
    }

    // Retry on 5xx server errors
    const status = error.response?.status;
    if (status >= 500 && status < 600) {
      return true;
    }

    // Retry on 429 (rate limit)
    if (status === 429) {
      return true;
    }

    // Don't retry on client errors (4xx)
    return false;
  }

  /**
   * Delay helper
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * File upload retry handler with progress tracking
 */
export class UploadRetryHandler {
  static async uploadWithRetry(
    uploadFn: () => Promise<any>,
    options: {
      maxRetries?: number;
      onProgress?: (progress: number) => void;
      onRetry?: (attempt: number) => void;
    } = {}
  ): Promise<any> {
    const { maxRetries = 2, onProgress, onRetry } = options;

    return RetryHandler.retry(uploadFn, {
      maxRetries,
      onRetry: (attempt, error) => {
        console.log(`Upload failed, retrying (${attempt}/${maxRetries})...`);
        if (onRetry) {
          onRetry(attempt);
        }
        
        toast({
          title: 'Upload failed',
          description: `Retrying... (Attempt ${attempt}/${maxRetries})`,
          variant: 'default',
        });
      },
      shouldRetry: (error) => {
        // Retry on network errors and server errors
        const status = error.response?.status;
        return !status || status >= 500 || status === 429;
      },
    });
  }
}
