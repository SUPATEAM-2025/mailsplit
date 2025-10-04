import { NextRequest, NextResponse } from 'next/server';
import { supabase, getOrCreateDefaultCompany } from '@/lib/supabase';
import { Email } from '@/lib/types';
import { mockEmails } from '@/lib/data';
import { Tables, TablesInsert } from '@/types/database';

// Helper to convert Email type to database row
function emailToDbRow(email: Email, companyId: number): TablesInsert<'email'> {
  return {
    from: email.from,
    subject: email.subject || null,
    text: email.content || null,
    company_id: companyId,
    assigned_to: email.assignedTeam || null,
    meta: {
      preview: email.preview,
      assignmentReason: email.assignmentReason,
    },
    flag_notes: email.notes || null,
    flagged: false,
    attachments: null,
    created_at: email.date,
  };
}

// Helper to convert database row to Email type
function dbRowToEmail(row: Tables<'email'>): Email {
  const meta = row.meta as { preview?: string; assignmentReason?: string } || {};

  return {
    id: row.id.toString(),
    from: row.from,
    subject: row.subject || '',
    preview: meta.preview || row.text?.substring(0, 100) || '',
    content: row.text || '',
    date: row.created_at || new Date().toISOString(),
    assignedTeam: row.assigned_to || undefined,
    assignmentReason: meta.assignmentReason || undefined,
    notes: row.flag_notes || undefined,
  };
}

// GET all emails
export async function GET() {
  try {
    const company = await getOrCreateDefaultCompany();

    const { data: emailRows, error } = await supabase
      .from('email')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emails:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no emails exist, seed with mock data
    if (!emailRows || emailRows.length === 0) {
      const seedEmails = await seedMockEmails(company.id);
      return NextResponse.json(seedEmails);
    }

    const emails = emailRows.map(dbRowToEmail);
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
    const company = await getOrCreateDefaultCompany();

    const dbRow = emailToDbRow(email, company.id);

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
