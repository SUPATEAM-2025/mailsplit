import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Email, Team } from '@/lib/types';
import { Tables } from '@/types/database';
import { syncEmailsToAlgolia, syncTeamsToAlgolia, configureIndices } from '@/lib/algolia-sync';

// Helper to convert database row to Email type
function dbRowToEmail(row: Tables<'email'>): Email {
  const meta = row.meta as { preview?: string; assignmentReason?: string } || {};
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

/**
 * Bulk sync all emails and teams from Supabase to Algolia
 * This endpoint re-syncs all data with proper company_id fields
 *
 * Query params:
 * - configure: Set to 'true' to configure indices before syncing
 * - company_id: Optional - sync only specific company (otherwise syncs all companies)
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shouldConfigure = searchParams.get('configure') === 'true';
    const companyIdFilter = searchParams.get('company_id');

    const results = {
      configured: false,
      emailsSynced: 0,
      teamsSynced: 0,
      errors: [] as string[],
    };

    // Configure indices if requested
    if (shouldConfigure) {
      try {
        await configureIndices();
        results.configured = true;
      } catch (error) {
        results.errors.push(`Failed to configure indices: ${error}`);
      }
    }

    // Sync emails
    try {
      let emailQuery = supabase.from('email').select('*');

      if (companyIdFilter) {
        emailQuery = emailQuery.eq('company_id', parseInt(companyIdFilter));
      }

      const { data: emailRows, error: emailError } = await emailQuery;

      if (emailError) {
        results.errors.push(`Failed to fetch emails: ${emailError.message}`);
      } else if (emailRows && emailRows.length > 0) {
        const emails = emailRows.map(dbRowToEmail);
        await syncEmailsToAlgolia(emails);
        results.emailsSynced = emails.length;
      }
    } catch (error) {
      results.errors.push(`Email sync error: ${error}`);
    }

    // Sync teams
    try {
      let teamQuery = supabase.from('documents').select('*');

      if (companyIdFilter) {
        teamQuery = teamQuery.eq('company_id', parseInt(companyIdFilter));
      }

      const { data: documents, error: teamError } = await teamQuery;

      if (teamError) {
        results.errors.push(`Failed to fetch teams: ${teamError.message}`);
      } else if (documents && documents.length > 0) {
        const teams: Team[] = documents.map((doc) => {
          try {
            const team = JSON.parse(doc.docs || '{}');
            return {
              ...team,
              company_id: doc.company_id,
            };
          } catch (e) {
            results.errors.push(`Failed to parse team document ${doc.id}: ${e}`);
            return null;
          }
        }).filter(Boolean);

        if (teams.length > 0) {
          await syncTeamsToAlgolia(teams);
          results.teamsSynced = teams.length;
        }
      }
    } catch (error) {
      results.errors.push(`Team sync error: ${error}`);
    }

    return NextResponse.json({
      success: results.errors.length === 0,
      ...results,
    });
  } catch (error) {
    console.error('Error in POST /api/sync-algolia:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync to Algolia',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
