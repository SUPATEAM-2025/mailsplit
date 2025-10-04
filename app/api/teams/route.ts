import { NextRequest, NextResponse } from 'next/server';
import { supabase, getOrCreateDefaultCompany } from '@/lib/supabase';
import { Team } from '@/lib/types';
import { mockTeams } from '@/lib/data';

// GET all teams
export async function GET() {
  try {
    const company = await getOrCreateDefaultCompany();

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teams:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no teams exist, seed with mock data
    if (!documents || documents.length === 0) {
      const seedTeams = await seedMockTeams(company.id);
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
    const company = await getOrCreateDefaultCompany();

    const { data, error } = await supabase
      .from('documents')
      .insert({
        company_id: company.id,
        docs: JSON.stringify(team),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating team:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
