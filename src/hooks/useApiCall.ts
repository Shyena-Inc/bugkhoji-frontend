import { useState, useCallback } from 'react';
import { ErrorHandler, RetryHandler } from '@/utils/errorHandler';

interface UseApiCallOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  retry?: boolean;
  maxRetries?: number;
}

interface UseApiCallReturn<T, P extends any[]> {
  data: T | null;
  loading: boolean;
  error: any;
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for making API calls with automatic error handling
 * 
 * @example
 * const { execute, loading, error } = useApiCall(
 *   async (id: string) => api.get(`/programs/${id}`),
 *   {
 *     successMessage: 'Program loaded successfully',
 *     errorMessage: 'Failed to load program',
 *     retry: true
 *   }
 * );
 */
export function useApiCall<T = any, P extends any[] = any[]>(
  apiFunction: (...args: P) => Promise<any>,
  options: UseApiCallOptions<T> = {}
): UseApiCallReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    retry = false,
    maxRetries = 2,
  } = options;

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (retry) {
          response = await RetryHandler.retry(
            () => apiFunction(...args),
            {
              maxRetries,
              onRetry: (attempt) => {
                ErrorHandler.logError(
                  new Error(`Retry attempt ${attempt}`),
                  'API Call Retry'
                );
              },
            }
          );
        } else {
          response = await apiFunction(...args);
        }

        const result = response?.data || response;
        setData(result);

        if (successMessage) {
          ErrorHandler.showSuccess(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err: any) {
        setError(err);
        ErrorHandler.handleApiError(err, errorMessage);

        if (onError) {
          onError(err);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, successMessage, errorMessage, retry, maxRetries]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for form submissions with validation and error handling
 */
export function useFormSubmit<T = any>(
  submitFunction: (data: T) => Promise<any>,
  options: UseApiCallOptions<any> = {}
) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { execute, loading, error, reset } = useApiCall(submitFunction, {
    ...options,
    onError: (err) => {
      // Handle validation errors
      if (err.response?.status === 422 || err.response?.status === 400) {
        const errors = err.response?.data?.errors || {};
        setFieldErrors(errors);
        ErrorHandler.handleValidationError(errors);
      }

      if (options.onError) {
        options.onError(err);
      }
    },
  });

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    reset();
  }, [reset]);

  return {
    submit: execute,
    loading,
    error,
    fieldErrors,
    clearFieldError,
    clearAllErrors,
  };
}
