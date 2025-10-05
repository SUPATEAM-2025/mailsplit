'use client';

import { useHits } from 'react-instantsearch';
import { TeamList } from './team-list';
import { Team } from '@/lib/types';
import { isAlgoliaConfigured } from '@/lib/algolia-client';
import { useFallbackSearch } from '@/lib/search-context';
import { filterTeamsByKeyword } from '@/lib/keyword-search';

interface TeamSearchResultsProps {
  fallbackTeams: Team[];
}

export function TeamSearchResults({ fallbackTeams }: TeamSearchResultsProps) {
  // If Algolia is not configured, use fallback keyword search
  if (!isAlgoliaConfigured) {
    return <FallbackTeamSearchResults fallbackTeams={fallbackTeams} />;
  }

  return <AlgoliaTeamSearchResults fallbackTeams={fallbackTeams} />;
}

// Fallback search using client-side keyword filtering
function FallbackTeamSearchResults({ fallbackTeams }: TeamSearchResultsProps) {
  const { query } = useFallbackSearch();

  // Filter teams by keyword
  const teams = filterTeamsByKeyword(fallbackTeams, query);

  return <TeamList teams={teams} />;
}

// Algolia search (when Algolia is configured)
function AlgoliaTeamSearchResults({ fallbackTeams }: TeamSearchResultsProps) {
  const { hits } = useHits<Team>();

  // Use Algolia hits if available, otherwise fallback to initial data
  const teams = hits.length > 0 ? hits : fallbackTeams;

  return <TeamList teams={teams} />;
}
