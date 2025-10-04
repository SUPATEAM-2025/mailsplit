'use client';

import { ReactNode } from 'react';
import { useCompanyTransition } from '@/lib/company-transition-context';
import { LoadingSpinner } from './loading-spinner';

interface LoadingWrapperProps {
  children: ReactNode;
}

export function LoadingWrapper({ children }: LoadingWrapperProps) {
  const { isPending } = useCompanyTransition();

  if (isPending) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
