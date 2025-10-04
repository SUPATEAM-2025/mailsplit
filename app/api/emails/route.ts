import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSelectedCompanyId } from '@/lib/company-context';
import { Email } from '@/lib/types';
import { mockEmails } from '@/lib/data';
import { Tables, TablesInsert } from '@/types/database';
import { syncEmailToAlgolia, syncEmailsToAlgolia } from '@/lib/algolia-sync';

// Helper to convert Email type to database row
function emailToDbRow(email: Email, companyId: number): TablesInsert<'email'> {
  // Parse assigned teams - support both legacy single team and new multiple teams
  // NOTE: assigned_to column is deprecated for extracted contacts.
  // extracted_contacts is the source of truth for initial team assignments.
  // assigned_to is still used for storage of user-selected teams.
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

// Helper to convert database row to Email type
function dbRowToEmail(row: Tables<'email'>): Email {
  const meta = row.meta as { preview?: string; assignmentReason?: string } || {};

  // Parse assigned teams from comma-separated string
  // NOTE: assigned_to column is deprecated for extracted contacts.
  // extracted_contacts is the source of truth for initial team assignments.
  // assigned_to is still used for storage of user-selected teams.
  const assignedTeams = row.assigned_to ? row.assigned_to.split(',').filter(t => t.trim()) : [];

  return {
    id: row.id.toString(),
    from: row.from,
    subject: row.subject || '',
    preview: meta.preview || row.text?.substring(0, 100) || '',
    content: row.text || '',
    date: row.created_at || new Date().toISOString(),
    company_id: row.company_id,
    assignedTeam: assignedTeams[0] || undefined, // Legacy: first team
    assignedTeams: assignedTeams.length > 0 ? assignedTeams : undefined,
    assignmentReason: meta.assignmentReason || undefined,
    notes: row.flag_notes || undefined,
    extractedContacts: row.extracted_contacts ? (row.extracted_contacts as any) : undefined,
    processingStatus: row.processing_status || undefined,
    processedAt: row.processed_at || undefined,
  };
}

// GET all emails
export async function GET() {
  try {
    const companyId = await getSelectedCompanyId();

    const { data: emailRows, error } = await supabase
      .from('email')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emails:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no emails exist and seeding is enabled, seed with mock data
    if (!emailRows || emailRows.length === 0) {
      if (process.env.SEED_MOCK_DATA === 'true') {
        const seedEmails = await seedMockEmails(companyId);
        return NextResponse.json(seedEmails);
      }
      // Return empty array if seeding is disabled
      return NextResponse.json([]);
    }

    const emails = emailRows.map(dbRowToEmail);

    // Sync to Algolia in background (don't await to avoid blocking response)
    syncEmailsToAlgolia(emails).catch(err =>
      console.error('Failed to sync emails to Algolia:', err)
    );

    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error in GET /api/emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

// POST create new email
export async function POST(request: NextRequest) {
  try {
    const email: Email = await request.json();
    const companyId = await getSelectedCompanyId();

    const dbRow = emailToDbRow(email, companyId);

    const { data, error } = await supabase
      .from('email')
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error('Error creating email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const createdEmail = dbRowToEmail(data);

    // Sync to Algolia in background
    syncEmailToAlgolia(createdEmail).catch(err =>
      console.error('Failed to sync email to Algolia:', err)
    );

    return NextResponse.json(createdEmail, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/emails:', error);
    return NextResponse.json(
      { error: 'Failed to create email' },
      { status: 500 }
    );
  }
}

// Helper function to seed mock emails
async function seedMockEmails(companyId: number) {
  const insertData = mockEmails.map((email) => emailToDbRow(email, companyId));

  const { error } = await supabase.from('email').insert(insertData);

  if (error) {
    console.error('Error seeding emails:', error);
    throw error;
  }

  return mockEmails;
}
