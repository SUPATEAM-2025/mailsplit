'use client';

import { ReactNode, Component, ErrorInfo } from 'react';
import { InstantSearch, Configure } from 'react-instantsearch';
import { usePathname } from 'next/navigation';
import { searchClient, EMAILS_INDEX, TEAMS_INDEX, isAlgoliaConfigured } from '@/lib/algolia-client';
import { FallbackSearchProvider } from '@/lib/search-context';

interface SearchProviderProps {
  children: ReactNode;
  companyId: number;
}

// Error boundary to catch Algolia errors (like missing indexes)
class AlgoliaErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error (Algolia index not found, etc.)
    console.warn('Algolia search error:', error.message);
  }

  render() {
    if (this.state.hasError) {
      // Fallback to rendering children without search
      return <>{this.props.children}</>;
    }

    return this.props.children;
  }
}

export function SearchProvider({ children, companyId }: SearchProviderProps) {
  const pathname = usePathname();

  // Determine which index to use based on current route
  const isTeamsPage = pathname.startsWith('/teams');
  const indexName = isTeamsPage ? TEAMS_INDEX : EMAILS_INDEX;

  // If Algolia is not configured, use fallback search provider
  if (!isAlgoliaConfigured) {
    return <FallbackSearchProvider companyId={companyId}>{children}</FallbackSearchProvider>;
  }

  return (
    <AlgoliaErrorBoundary>
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
      >
        <Configure filters={`company_id:${companyId}`} />
        {children}
      </InstantSearch>
    </AlgoliaErrorBoundary>
  );
}
