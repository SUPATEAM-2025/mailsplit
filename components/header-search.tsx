'use client';

import { usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useSearchBox } from 'react-instantsearch';
import { cn } from '@/lib/utils';
import { isAlgoliaConfigured } from '@/lib/algolia-client';

export function HeaderSearch() {
  const pathname = usePathname();

  // Don't render if Algolia is not configured
  if (!isAlgoliaConfigured) {
    return null;
  }

  // Determine which page we're on
  const isTeamsPage = pathname.startsWith('/teams');
  const placeholder = isTeamsPage
    ? 'Search teams...'
    : 'Search emails...';

  return <HeaderSearchInner placeholder={placeholder} />;
}

function HeaderSearchInner({ placeholder }: { placeholder: string }) {
  const { query, refine, clear } = useSearchBox();

  return (
    <div className="relative w-[400px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex h-9 w-full rounded-lg border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
      {query && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
