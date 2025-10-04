'use client';

import { useHits } from 'react-instantsearch';
import { EmailList } from './email-list';
import { Email, Team } from '@/lib/types';
import { isAlgoliaConfigured } from '@/lib/algolia-client';

interface EmailSearchResultsProps {
  teams: Team[];
  fallbackEmails: Email[];
}

export function EmailSearchResults({ teams, fallbackEmails }: EmailSearchResultsProps) {
  // If Algolia is not configured, just show fallback emails
  if (!isAlgoliaConfigured) {
    return <EmailList emails={fallbackEmails} teams={teams} />;
  }

  return <EmailSearchResultsInner teams={teams} fallbackEmails={fallbackEmails} />;
}

function EmailSearchResultsInner({ teams, fallbackEmails }: EmailSearchResultsProps) {
  const { hits } = useHits<Email>();

  // Use Algolia hits if available, otherwise fallback to initial data
  const emails = hits.length > 0 ? hits : fallbackEmails;

  return <EmailList emails={emails} teams={teams} />;
}
