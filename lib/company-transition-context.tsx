'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CompanyTransitionContextType {
  isPending: boolean;
  setIsPending: (pending: boolean) => void;
}

const CompanyTransitionContext = createContext<CompanyTransitionContextType | undefined>(undefined);

export function CompanyTransitionProvider({ children }: { children: ReactNode }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <CompanyTransitionContext.Provider value={{ isPending, setIsPending }}>
      {children}
    </CompanyTransitionContext.Provider>
  );
}

export function useCompanyTransition() {
  const context = useContext(CompanyTransitionContext);
  if (context === undefined) {
    throw new Error('useCompanyTransition must be used within CompanyTransitionProvider');
  }
  return context;
}
