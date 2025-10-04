import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSelectedCompanyId } from '@/lib/company-context';
import { Email } from '@/lib/types';
import { Tables } from '@/types/database';

interface RouteParams {
  params: {
    id: string;
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

// GET single email by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const companyId = await getSelectedCompanyId();

    const { data: emailRow, error } = await supabase
      .from('email')
      .select('*')
      .eq('id', parseInt(params.id))
      .eq('company_id', companyId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Email not found' }, { status: 404 });
      }
      console.error('Error fetching email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const email = dbRowToEmail(emailRow);
    return NextResponse.json(email);
  } catch (error) {
    console.error('Error in GET /api/emails/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email' },
      { status: 500 }
    );
  }
}

// PATCH update email (for assignments, notes, etc.)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const updates: Partial<Email> = await request.json();
    const companyId = await getSelectedCompanyId();

    // Build the update object for the database
    const dbUpdates: Partial<Tables<'email'>> = {};

    // Support both legacy assignedTeam and new assignedTeams
    if (updates.assignedTeam !== undefined || updates.assignedTeams !== undefined) {
      const teamsArray = updates.assignedTeams || (updates.assignedTeam ? [updates.assignedTeam] : []);
      dbUpdates.assigned_to = teamsArray.length > 0 ? teamsArray.join(',') : null;
    }

    if (updates.notes !== undefined) {
      dbUpdates.flag_notes = updates.notes || null;
    }

    if (updates.subject !== undefined) {
      dbUpdates.subject = updates.subject || null;
    }

    if (updates.content !== undefined) {
      dbUpdates.text = updates.content || null;
    }

    if (updates.extractedContacts !== undefined) {
      dbUpdates.extracted_contacts = updates.extractedContacts ? JSON.parse(JSON.stringify(updates.extractedContacts)) : null;
    }

    if (updates.processingStatus !== undefined) {
      dbUpdates.processing_status = updates.processingStatus || null;
    }

    if (updates.processedAt !== undefined) {
      dbUpdates.processed_at = updates.processedAt || null;
    }

    // Update meta field if needed
    if (updates.assignmentReason !== undefined || updates.preview !== undefined) {
      // First fetch the current meta
      const { data: currentEmail } = await supabase
        .from('email')
        .select('meta')
        .eq('id', parseInt(params.id))
        .eq('company_id', companyId)
        .single();

      const currentMeta = currentEmail?.meta as { preview?: string; assignmentReason?: string } || {};

      dbUpdates.meta = {
        ...currentMeta,
        ...(updates.preview !== undefined && { preview: updates.preview }),
        ...(updates.assignmentReason !== undefined && { assignmentReason: updates.assignmentReason }),
      };
    }

    dbUpdates.updated_at = new Date().toISOString();

    const { data: updatedRow, error } = await supabase
      .from('email')
      .update(dbUpdates)
      .eq('id', parseInt(params.id))
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const email = dbRowToEmail(updatedRow);
    return NextResponse.json(email);
  } catch (error) {
    console.error('Error in PATCH /api/emails/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}
