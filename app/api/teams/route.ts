import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSelectedCompanyId } from '@/lib/company-context';
import { Team } from '@/lib/types';
import { mockTeams } from '@/lib/data';
import { syncTeamToAlgolia, syncTeamsToAlgolia } from '@/lib/algolia-sync';

// GET all teams
export async function GET() {
  try {
    const companyId = await getSelectedCompanyId();

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teams:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no teams exist, seed with mock data
    if (!documents || documents.length === 0) {
      const seedTeams = await seedMockTeams(companyId);
      return NextResponse.json(seedTeams);
    }

    // Parse the docs field to get Team objects
    const teams: Team[] = documents.map((doc) => {
      try {
        return JSON.parse(doc.docs || '{}');
      } catch (e) {
        console.error('Error parsing team document:', e);
        return null;
      }
    }).filter(Boolean);

    // Sync to Algolia in background (don't await to avoid blocking response)
    syncTeamsToAlgolia(teams).catch(err =>
      console.error('Failed to sync teams to Algolia:', err)
    );

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error in GET /api/teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

// POST create new team
export async function POST(request: NextRequest) {
  try {
    const team: Team = await request.json();
    const companyId = await getSelectedCompanyId();

    const { data, error } = await supabase
      .from('documents')
      .insert({
        company_id: companyId,
        docs: JSON.stringify(team),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating team:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger vector DB processing for the new document
    const vectorDbUrl = process.env.SUPABASE_VECTOR_DB_API_URL;
    if (vectorDbUrl && data?.id) {
      try {
        console.log(`Triggering vector DB processing for document ${data.id}`);
        const response = await fetch(`${vectorDbUrl}/documents/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ document_id: data.id }),
        });

        if (!response.ok) {
          console.error('Vector DB processing failed:', await response.text());
        } else {
          console.log('Vector DB processing triggered successfully');
        }
      } catch (vectorError) {
        // Log error but don't fail the team creation
        console.error('Error triggering vector DB processing:', vectorError);
      }
    }

    // Sync to Algolia in background
    syncTeamToAlgolia(team).catch(err =>
      console.error('Failed to sync team to Algolia:', err)
    );

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/teams:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
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
  return mockTeams;
}
