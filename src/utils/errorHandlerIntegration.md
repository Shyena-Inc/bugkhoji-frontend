# Error Handler Integration Guide

This document tracks the integration of ErrorHandler across the application.

## Completed Files

### Context & Core
- ✅ `src/context/auth-context.tsx` - All error handling updated
- ✅ `src/utils/errorHandler.ts` - Core error handler implementation
- ✅ `src/utils/api.ts` - API interceptors with error handling
- ✅ `src/components/ErrorBoundary.tsx` - Component error boundary
- ✅ `src/components/LogoUpload.tsx` - Upload error handling with retry

### Login Pages
- ✅ `src/pages/login/ResearcherLogin.tsx` - ErrorHandler integrated
- ✅ `src/pages/login/AdminLogin.tsx` - ErrorHandler integrated
- ✅ `src/pages/login/OrganizationLogin.tsx` - ErrorHandler integrated

### Public Pages
- ✅ `src/pages/Contact.tsx` - ErrorHandler integrated
- ✅ `src/pages/organization/Settings.tsx` - ErrorHandler integrated

### Hooks
- ✅ `src/hooks/useApiCall.ts` - New hook for API calls with error handling

## Files Needing Updates

The following files have catch blocks that should use ErrorHandler:

### Organization Pages
- `src/pages/organization/Verification.tsx` - 2 catch blocks
- `src/pages/organization/reports/reports.tsx` - 6 catch blocks
- `src/pages/organization/programs/create.tsx` - 1 catch block
- `src/pages/organization/programs/edit.tsx` - 1 catch block
- `src/pages/organization/programs/program.tsx` - 3 catch blocks
- `src/pages/organization/programs/programs.tsx` - 1 catch block

### Researcher Pages
- `src/pages/researcher/Profile.tsx` - 1 catch block
- `src/pages/researcher/reports/report.tsx` - 2 catch blocks
- `src/pages/researcher/programs/program.tsx` - 2 catch blocks
- `src/pages/researcher/SubmitReport.tsx` - 1 catch block

### Admin Pages
- `src/pages/admin/Verifications.tsx` - 2 catch blocks
- `src/pages/admin/Positions.tsx` - 4 catch blocks
- `src/pages/admin/ManagePrograms.tsx` - 3 catch blocks
- `src/pages/admin/ManageUsers.tsx` - 4 catch blocks

### Other Pages
- `src/pages/Careers.tsx` - 1 catch block
- `src/pages/register/OrganizationVerificationPage.tsx` - 1 catch block
- `src/pages/register/organizationSignup.tsx` - 2 catch blocks

## Integration Pattern

### 1. Add Import
```typescript
import { ErrorHandler } from '@/utils/errorHandler';
```

### 2. Replace console.error + toast with ErrorHandler
```typescript
// Before
catch (error: any) {
  console.error('Error message:', error);
  toast({
    title: 'Error',
    description: error?.response?.data?.message || 'Something went wrong',
    variant: 'destructive',
  });
}

// After
catch (error: any) {
  ErrorHandler.handleApiError(error, 'Custom error message');
}
```

### 3. For Upload Errors
```typescript
catch (error: any) {
  ErrorHandler.handleUploadError(error);
}
```

### 4. For Validation Errors
```typescript
catch (error: any) {
  if (error.response?.status === 422) {
    ErrorHandler.handleValidationError(error.response.data.errors);
  } else {
    ErrorHandler.handleApiError(error);
  }
}
```

## Benefits

1. **Consistent Error Messages**: All errors display in the same format
2. **Automatic Retry**: Upload errors automatically retry with exponential backoff
3. **Better Logging**: All errors are logged with context for debugging
4. **User-Friendly Messages**: Status codes are translated to readable messages
5. **Centralized Logic**: Error handling logic in one place, easier to maintain

## Testing Checklist

- [ ] Test login errors (401, 429, network errors)
- [ ] Test form validation errors (422)
- [ ] Test file upload errors (413, 415)
- [ ] Test network errors (no connection)
- [ ] Test server errors (500, 503)
- [ ] Test rate limiting (429)
- [ ] Verify toast notifications appear
- [ ] Verify inline form errors display
- [ ] Verify retry mechanism works for uploads
- [ ] Verify error boundary catches component errors
