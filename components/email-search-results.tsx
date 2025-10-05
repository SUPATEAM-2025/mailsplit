'use client';

import { useHits } from 'react-instantsearch';
import { EmailList } from './email-list';
import { Email, Team } from '@/lib/types';
import { isAlgoliaConfigured } from '@/lib/algolia-client';
import { useFallbackSearch } from '@/lib/search-context';
import { filterEmailsByKeyword } from '@/lib/keyword-search';

interface EmailSearchResultsProps {
  teams: Team[];
  fallbackEmails: Email[];
}

export function EmailSearchResults({ teams, fallbackEmails }: EmailSearchResultsProps) {
  // If Algolia is not configured, use fallback keyword search
  if (!isAlgoliaConfigured) {
    return <FallbackEmailSearchResults teams={teams} fallbackEmails={fallbackEmails} />;
  }

  return <AlgoliaEmailSearchResults teams={teams} fallbackEmails={fallbackEmails} />;
}

// Fallback search using client-side keyword filtering
function FallbackEmailSearchResults({ teams, fallbackEmails }: EmailSearchResultsProps) {
  const { query } = useFallbackSearch();

  // Filter emails by keyword
  const emails = filterEmailsByKeyword(fallbackEmails, query);

  return <EmailList emails={emails} teams={teams} />;
}

// Algolia search (when Algolia is configured)
function AlgoliaEmailSearchResults({ teams, fallbackEmails }: EmailSearchResultsProps) {
  const { hits } = useHits<Email>();

  // Use Algolia hits if available, otherwise fallback to initial data
  const emails = hits.length > 0 ? hits : fallbackEmails;

  return <EmailList emails={emails} teams={teams} />;
}
