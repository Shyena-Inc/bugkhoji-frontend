import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormErrorProps {
  error?: string | null;
  className?: string;
}

export const FormError = ({ error, className = '' }: FormErrorProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className={`mt-2 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

interface FieldErrorProps {
  error?: string | null;
  className?: string;
}

export const FieldError = ({ error, className = '' }: FieldErrorProps) => {
  if (!error) return null;

  return (
    <p className={`text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1 ${className}`}>
      <AlertCircle className="h-3 w-3" />
      {error}
    </p>
  );
};

export default FormError;
