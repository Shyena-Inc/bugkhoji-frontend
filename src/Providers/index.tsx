import { ReactNode } from 'react';
import { AuthProvider } from '../context/auth-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../utils/api';

interface Props {
  children: ReactNode;
}

export default function Provider({ children }: Props) {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <div className='grid w-full grid-cols-1 min-h-[100dvh] grid-rows-[auto_1fr_auto]'>
              {children}
            </div>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}
