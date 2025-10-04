import { algoliasearch } from 'algoliasearch';
import { Email, Team } from './types';
import { EMAILS_INDEX, TEAMS_INDEX } from './algolia-client';

// Server-side Algolia client with admin API key
function getAdminClient() {
  if (!process.env.ALGOLIA_ADMIN_API_KEY) {
    throw new Error('ALGOLIA_ADMIN_API_KEY is not defined');
  }
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
    throw new Error('NEXT_PUBLIC_ALGOLIA_APP_ID is not defined');
  }

  return algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  );
}

export async function syncEmailToAlgolia(email: Email) {
  try {
    const client = getAdminClient();
    await client.saveObject({
      indexName: EMAILS_INDEX,
      body: {
        objectID: email.id,
        ...email,
      },
    });
  } catch (error) {
    console.error('Failed to sync email to Algolia:', error);
  }
}

export async function syncEmailsToAlgolia(emails: Email[]) {
  try {
    const client = getAdminClient();
    const objects = emails.map((email) => ({
      objectID: email.id,
      ...email,
    }));

    await client.saveObjects({
      indexName: EMAILS_INDEX,
      objects,
    });
  } catch (error) {
    console.error('Failed to sync emails to Algolia:', error);
  }
}

export async function syncTeamToAlgolia(team: Team) {
  try {
    const client = getAdminClient();
    await client.saveObject({
      indexName: TEAMS_INDEX,
      body: {
        objectID: team.team_name,
        ...team,
      },
    });
  } catch (error) {
    console.error('Failed to sync team to Algolia:', error);
  }
}

export async function syncTeamsToAlgolia(teams: Team[]) {
  try {
    const client = getAdminClient();
    const objects = teams.map((team) => ({
      objectID: team.team_name,
      ...team,
    }));

    await client.saveObjects({
      indexName: TEAMS_INDEX,
      objects,
    });
  } catch (error) {
    console.error('Failed to sync teams to Algolia:', error);
  }
}

export async function configureIndices() {
  try {
    const client = getAdminClient();

    // Configure emails index
    await client.setSettings({
      indexName: EMAILS_INDEX,
      indexSettings: {
        searchableAttributes: [
          'from',
          'subject',
          'preview',
          'content',
          'assignedTeams',
          'assignedTeam',
        ],
        attributesForFaceting: ['assignedTeams', 'processingStatus', 'company_id'],
      },
    });

    // Configure teams index
    await client.setSettings({
      indexName: TEAMS_INDEX,
      indexSettings: {
        searchableAttributes: [
          'team_name',
          'description',
          'products',
          'issues_handled',
          'contact_email',
        ],
        attributesForFaceting: ['company_id'],
      },
    });
  } catch (error) {
    console.error('Failed to configure Algolia indices:', error);
  }
}
