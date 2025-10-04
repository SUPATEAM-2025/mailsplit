'use client';

import { useHits } from 'react-instantsearch';
import { TeamList } from './team-list';
import { Team } from '@/lib/types';
import { isAlgoliaConfigured } from '@/lib/algolia-client';

interface TeamSearchResultsProps {
  fallbackTeams: Team[];
}

export function TeamSearchResults({ fallbackTeams }: TeamSearchResultsProps) {
  // If Algolia is not configured, just show fallback teams
  if (!isAlgoliaConfigured) {
    return <TeamList teams={fallbackTeams} />;
  }

  return <TeamSearchResultsInner fallbackTeams={fallbackTeams} />;
}

function TeamSearchResultsInner({ fallbackTeams }: TeamSearchResultsProps) {
  const { hits } = useHits<Team>();

  // Use Algolia hits if available, otherwise fallback to initial data
  const teams = hits.length > 0 ? hits : fallbackTeams;

  return <TeamList teams={teams} />;
}
