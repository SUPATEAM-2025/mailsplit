import { NextRequest, NextResponse } from 'next/server';
import { supabase, getOrCreateDefaultCompany } from '@/lib/supabase';
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

// GET single email by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const company = await getOrCreateDefaultCompany();

    const { data: emailRow, error } = await supabase
      .from('email')
      .select('*')
      .eq('id', parseInt(params.id))
      .eq('company_id', company.id)
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
    const company = await getOrCreateDefaultCompany();

    // Build the update object for the database
    const dbUpdates: Partial<Tables<'email'>> = {};

    if (updates.assignedTeam !== undefined) {
      dbUpdates.assigned_to = updates.assignedTeam || null;
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

    // Update meta field if needed
    if (updates.assignmentReason !== undefined || updates.preview !== undefined) {
      // First fetch the current meta
      const { data: currentEmail } = await supabase
        .from('email')
        .select('meta')
        .eq('id', parseInt(params.id))
        .eq('company_id', company.id)
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
      .eq('company_id', company.id)
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
