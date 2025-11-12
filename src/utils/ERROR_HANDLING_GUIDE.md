# Frontend Error Handling Implementation Guide

## Overview

This application implements comprehensive error handling using a centralized `ErrorHandler` utility class, retry mechanisms for failed requests, and error boundaries for component errors.

## Core Components

### 1. ErrorHandler (`src/utils/errorHandler.ts`)

The main error handling utility that provides:

- **API Error Handling**: Automatically translates HTTP status codes to user-friendly messages
- **Upload Error Handling**: Specialized handling for file upload errors
- **Validation Error Handling**: Displays form validation errors
- **Toast Notifications**: Consistent error display across the app
- **Error Logging**: Centralized logging for debugging

#### Usage Examples

```typescript
import { ErrorHandler } from '@/utils/errorHandler';

// Handle API errors
try {
  await api.post('/endpoint', data);
} catch (error) {
  ErrorHandler.handleApiError(error, 'Custom error message');
}

// Handle upload errors
try {
  await uploadFile(file);
} catch (error) {
  ErrorHandler.handleUploadError(error);
}

// Handle validation errors
try {
  await submitForm(data);
} catch (error) {
  if (error.response?.status === 422) {
    ErrorHandler.handleValidationError(error.response.data.errors);
  }
}

// Show success messages
ErrorHandler.showSuccess('Success!', 'Operation completed');

// Log errors for debugging
ErrorHandler.logError(error, 'Context information');
```

### 2. RetryHandler (`src/utils/errorHandler.ts`)

Provides automatic retry logic with exponential backoff:

```typescript
import { RetryHandler } from '@/utils/errorHandler';

const result = await RetryHandler.retry(
  () => api.get('/endpoint'),
  {
    maxRetries: 3,
    retryDelay: 1000,
    onRetry: (attempt) => console.log(`Retry ${attempt}`),
    shouldRetry: (error) => error.response?.status >= 500
  }
);
```

### 3. UploadRetryHandler (`src/utils/errorHandler.ts`)

Specialized retry handler for file uploads:

```typescript
import { UploadRetryHandler } from '@/utils/errorHandler';

await UploadRetryHandler.uploadWithRetry(
  () => api.post('/upload', formData),
  {
    maxRetries: 2,
    onProgress: (progress) => setProgress(progress),
    onRetry: (attempt) => console.log(`Upload retry ${attempt}`)
  }
);
```

### 4. ErrorBoundary (`src/components/ErrorBoundary.tsx`)

React error boundary that catches component errors:

```typescript
import ErrorBoundary from '@/components/ErrorBoundary';

// Wrap your app or components
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>

// With error callback
<ErrorBoundary onError={(error, errorInfo) => logToService(error)}>
  <YourComponent />
</ErrorBoundary>
```

### 5. useApiCall Hook (`src/hooks/useApiCall.ts`)

Custom hook for API calls with automatic error handling:

```typescript
import { useApiCall } from '@/hooks/useApiCall';

const { execute, loading, error, data } = useApiCall(
  async (id: string) => api.get(`/programs/${id}`),
  {
    successMessage: 'Program loaded',
    errorMessage: 'Failed to load program',
    retry: true,
    maxRetries: 2,
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error)
  }
);

// Use it
await execute(programId);
```

### 6. useFormSubmit Hook (`src/hooks/useApiCall.ts`)

Hook for form submissions with validation error handling:

```typescript
import { useFormSubmit } from '@/hooks/useApiCall';

const { submit, loading, fieldErrors, clearFieldError } = useFormSubmit(
  async (data) => api.post('/submit', data),
  {
    successMessage: 'Form submitted successfully',
    errorMessage: 'Failed to submit form'
  }
);

// Use it
await submit(formData);

// Display field errors
{fieldErrors.email && <span>{fieldErrors.email}</span>}

// Clear specific field error
clearFieldError('email');
```

## Error Types and Status Codes

### HTTP Status Codes

The ErrorHandler automatically handles these status codes:

- **400 Bad Request**: "Invalid request. Please check your input."
- **401 Unauthorized**: "Your session has expired. Please log in again."
- **403 Forbidden**: "You do not have permission to perform this action."
- **404 Not Found**: "The requested resource was not found."
- **409 Conflict**: "This resource already exists."
- **413 Payload Too Large**: "File is too large. Please upload a smaller file."
- **422 Unprocessable Entity**: "Validation failed. Please check your input."
- **429 Too Many Requests**: "Too many requests. Please try again later."
- **500 Internal Server Error**: "Server error. Please try again later."
- **503 Service Unavailable**: "Service temporarily unavailable. Please try again later."

### Network Errors

- **NETWORK_ERROR**: "Network error. Please check your connection and try again."

## Form Error Display

### Inline Field Errors

Use the `FormError` or `FieldError` components:

```typescript
import { FormError, FieldError } from '@/components/FormError';

// General form error
<FormError error={generalError} />

// Field-specific error
<FieldError error={fieldErrors.email} />
```

### Alert Errors

```typescript
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

## Best Practices

### 1. Always Use ErrorHandler for API Calls

```typescript
// ❌ Bad
try {
  await api.post('/endpoint', data);
} catch (error) {
  console.error(error);
  toast({ title: 'Error', description: 'Something went wrong' });
}

// ✅ Good
try {
  await api.post('/endpoint', data);
} catch (error) {
  ErrorHandler.handleApiError(error, 'Failed to save data');
}
```

### 2. Use Retry for Unreliable Operations

```typescript
// ✅ Good for uploads and network-dependent operations
try {
  await UploadRetryHandler.uploadWithRetry(
    () => uploadFile(file),
    { maxRetries: 2 }
  );
} catch (error) {
  ErrorHandler.handleUploadError(error);
}
```

### 3. Handle Validation Errors Separately

```typescript
// ✅ Good
try {
  await api.post('/submit', formData);
} catch (error) {
  if (error.response?.status === 422) {
    ErrorHandler.handleValidationError(error.response.data.errors);
    setFieldErrors(error.response.data.errors);
  } else {
    ErrorHandler.handleApiError(error);
  }
}
```

### 4. Provide Context in Error Messages

```typescript
// ❌ Bad
ErrorHandler.handleApiError(error);

// ✅ Good
ErrorHandler.handleApiError(error, 'Failed to update user profile');
```

### 5. Use Error Boundaries for Component Errors

```typescript
// ✅ Good - Wrap risky components
<ErrorBoundary>
  <ComplexComponent />
</ErrorBoundary>
```

### 6. Log Errors for Debugging

```typescript
// ✅ Good
try {
  await riskyOperation();
} catch (error) {
  ErrorHandler.logError(error, 'Risky Operation Context');
  ErrorHandler.handleApiError(error);
}
```

## Integration Checklist

When adding error handling to a new component:

- [ ] Import ErrorHandler
- [ ] Replace console.error with ErrorHandler.logError
- [ ] Replace manual toast calls with ErrorHandler methods
- [ ] Add retry logic for uploads
- [ ] Handle validation errors separately
- [ ] Provide meaningful error messages
- [ ] Test error scenarios (401, 422, 500, network errors)
- [ ] Verify toast notifications appear
- [ ] Check inline form errors display correctly

## Testing Error Handling

### Manual Testing

1. **Test Login Errors**
   - Invalid credentials (401)
   - Rate limiting (429)
   - Network disconnection

2. **Test Form Validation**
   - Submit invalid data (422)
   - Check inline errors appear
   - Verify field-specific messages

3. **Test File Uploads**
   - Upload oversized file (413)
   - Upload invalid file type (415)
   - Test retry mechanism

4. **Test Network Errors**
   - Disconnect network
   - Verify error message
   - Check retry behavior

5. **Test Server Errors**
   - Trigger 500 error
   - Verify user-friendly message
   - Check error logging

### Automated Testing

```typescript
import { ErrorHandler } from '@/utils/errorHandler';

describe('ErrorHandler', () => {
  it('should handle 401 errors', () => {
    const error = { response: { status: 401 } };
    const result = ErrorHandler.handleApiError(error);
    expect(result.message).toContain('session has expired');
  });

  it('should handle network errors', () => {
    const error = { request: {} };
    const result = ErrorHandler.handleApiError(error);
    expect(result.code).toBe('NETWORK_ERROR');
  });
});
```

## Migration Guide

### Updating Existing Code

1. **Add Import**
   ```typescript
   import { ErrorHandler } from '@/utils/errorHandler';
   ```

2. **Replace Error Handling**
   ```typescript
   // Before
   catch (error: any) {
     console.error('Error:', error);
     toast({
       title: 'Error',
       description: error?.response?.data?.message || 'Failed',
       variant: 'destructive'
     });
   }

   // After
   catch (error: any) {
     ErrorHandler.handleApiError(error, 'Failed to perform action');
   }
   ```

3. **Add Retry for Uploads**
   ```typescript
   // Before
   await api.post('/upload', formData);

   // After
   await UploadRetryHandler.uploadWithRetry(
     () => api.post('/upload', formData),
     { maxRetries: 2 }
   );
   ```

## Production Considerations

### Error Tracking Service Integration

In production, integrate with error tracking services:

```typescript
// In errorHandler.ts
static logError(error: any, context?: string): void {
  console.error(`[${context || 'Error'}]:`, error);
  
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    Sentry.captureException(error, {
      tags: { context },
      extra: { errorDetails: error }
    });
  }
}
```

### Performance Monitoring

Monitor error rates and retry attempts:

```typescript
// Track error metrics
if (process.env.NODE_ENV === 'production') {
  analytics.track('error_occurred', {
    type: error.response?.status || 'unknown',
    context: context,
    timestamp: new Date()
  });
}
```

## Summary

This error handling implementation provides:

✅ Consistent error messages across the application
✅ Automatic retry for failed requests
✅ User-friendly error display
✅ Centralized error logging
✅ Form validation error handling
✅ Component error boundaries
✅ Network error handling
✅ Upload error handling with retry

All errors are handled gracefully, providing users with clear feedback while maintaining detailed logs for debugging.
