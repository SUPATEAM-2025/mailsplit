import { supabase } from './supabase';
import { getSelectedCompanyId } from './company-context';
import { Email, Team } from './types';
import { Tables, TablesInsert } from '@/types/database';
import { mockEmails, mockTeams } from './data';

// Helper to convert database row to Email type
function dbRowToEmail(row: Tables<'email'>): Email {
  const meta = row.meta as { preview?: string; assignmentReason?: string } || {};

  // Parse assigned teams from comma-separated string
  const assignedTeams = row.assigned_to ? row.assigned_to.split(',').filter(t => t.trim()) : [];

  return {
    id: row.id.toString(),
    from: row.from,
    subject: row.subject || '',
    preview: meta.preview || row.text?.substring(0, 100) || '',
    content: row.text || '',
    date: row.created_at || new Date().toISOString(),
    company_id: row.company_id,
    assignedTeam: assignedTeams[0] || undefined,
    assignedTeams: assignedTeams.length > 0 ? assignedTeams : undefined,
    assignmentReason: meta.assignmentReason || undefined,
    notes: row.flag_notes || undefined,
    extractedContacts: row.extracted_contacts ? (row.extracted_contacts as any) : undefined,
    processingStatus: row.processing_status || undefined,
    processedAt: row.processed_at || undefined,
  };
}

// Helper to convert Email type to database row
function emailToDbRow(email: Email, companyId: number): TablesInsert<'email'> {
  const assignedTeamsArray = email.assignedTeams || (email.assignedTeam ? [email.assignedTeam] : []);
  const assignedTo = assignedTeamsArray.length > 0 ? assignedTeamsArray.join(',') : null;

  return {
    from: email.from,
    subject: email.subject || null,
    text: email.content || null,
    company_id: companyId,
    assigned_to: assignedTo,
    meta: {
      preview: email.preview,
      assignmentReason: email.assignmentReason,
    },
    flag_notes: email.notes || null,
    flagged: false,
    attachments: null,
    created_at: email.date,
    extracted_contacts: email.extractedContacts ? JSON.parse(JSON.stringify(email.extractedContacts)) : null,
    processing_status: email.processingStatus || 'pending',
    processed_at: email.processedAt || null,
  };
}

/**
 * Fetch all emails for the selected company
 */
export async function fetchEmails(): Promise<Email[]> {
  try {
    const companyId = await getSelectedCompanyId();

    const { data: emailRows, error } = await supabase
      .from('email')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emails:', error);
      return [];
    }

    // If no emails exist and seeding is enabled, seed with mock data
    if (!emailRows || emailRows.length === 0) {
      if (process.env.SEED_MOCK_DATA === 'true') {
        await seedMockEmails(companyId);
        return mockEmails.map(email => ({ ...email, company_id: companyId }));
      }
      return [];
    }

    return emailRows.map(dbRowToEmail);
  } catch (error) {
    console.error('Error in fetchEmails:', error);
    return [];
  }
}

/**
 * Fetch all teams for the selected company
 */
export async function fetchTeams(): Promise<Team[]> {
  try {
    const companyId = await getSelectedCompanyId();

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }

    // If no teams exist, seed with mock data
    if (!documents || documents.length === 0) {
      await seedMockTeams(companyId);
      return mockTeams.map(team => ({ ...team, company_id: companyId }));
    }

    // Parse the docs field to get Team objects
    const teams: Team[] = documents.map((doc) => {
      try {
        const team = JSON.parse(doc.docs || '{}');
        return {
          ...team,
          company_id: doc.company_id,
        };
      } catch (e) {
        console.error('Error parsing team document:', e);
        return null;
      }
    }).filter(Boolean);

    return teams;
  } catch (error) {
    console.error('Error in fetchTeams:', error);
    return [];
  }
}

/**
 * Fetch a single email by ID for the selected company
 */
export async function fetchEmailById(emailId: string): Promise<Email | null> {
  try {
    const companyId = await getSelectedCompanyId();

    const { data: emailRow, error } = await supabase
      .from('email')
      .select('*')
      .eq('id', parseInt(emailId))
      .eq('company_id', companyId)
      .single();

    if (error) {
      console.error('Error fetching email:', error);
      return null;
    }

    return dbRowToEmail(emailRow);
  } catch (error) {
    console.error('Error in fetchEmailById:', error);
    return null;
  }
}

/**
 * Fetch a single team by name for the selected company
 */
export async function fetchTeamByName(teamName: string): Promise<Team | null> {
  try {
    const companyId = await getSelectedCompanyId();

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('company_id', companyId);

    if (error) {
      console.error('Error fetching team:', error);
      return null;
    }

    // Find the team with the matching team_name in the parsed docs
    const teamDoc = documents?.find((doc) => {
      try {
        const team = JSON.parse(doc.docs || '{}');
        return team.team_name === teamName;
      } catch (e) {
        return false;
      }
    });

    if (!teamDoc) {
      return null;
    }

    const team = JSON.parse(teamDoc.docs || '{}');
    return {
      ...team,
      company_id: teamDoc.company_id,
    };
  } catch (error) {
    console.error('Error in fetchTeamByName:', error);
    return null;
  }
}

// Helper function to seed mock emails
async function seedMockEmails(companyId: number) {
  const insertData = mockEmails.map((email) => emailToDbRow(email, companyId));
  const { error } = await supabase.from('email').insert(insertData);

  if (error) {
    console.error('Error seeding emails:', error);
  }
}

// Helper function to seed mock teams
async function seedMockTeams(companyId: number) {
  const insertPromises = mockTeams.map((team) =>
    supabase.from('documents').insert({
      company_id: companyId,
      docs: JSON.stringify(team),
    })
  );

  await Promise.all(insertPromises);
}
