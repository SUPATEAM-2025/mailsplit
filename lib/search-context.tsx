'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function FallbackSearchProvider({
  children,
  companyId
}: {
  children: ReactNode;
  companyId: number;
}) {
  const [query, setQuery] = useState('');

  // Reset search query when company changes
  useEffect(() => {
    setQuery('');
  }, [companyId]);

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useFallbackSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useFallbackSearch must be used within a FallbackSearchProvider');
  }
  return context;
}
