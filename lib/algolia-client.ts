import { algoliasearch } from 'algoliasearch';

export const EMAILS_INDEX = 'emails_index';
export const TEAMS_INDEX = 'teams_index';

// Check if Algolia is configured
export const isAlgoliaConfigured =
  !!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
  !!process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

// Create a no-op search client for when Algolia is not configured
const createNoOpClient = () => ({
  search: () => Promise.resolve({ results: [] }),
  searchForFacetValues: () => Promise.resolve([]),
  addAlgoliaAgent: () => {},
});

// Export search client (real or no-op)
export const searchClient = isAlgoliaConfigured
  ? algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
    )
  : createNoOpClient();
