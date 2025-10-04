import { NextRequest, NextResponse } from 'next/server';
import { supabase, getOrCreateDefaultCompany } from '@/lib/supabase';
import { Team } from '@/lib/types';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET single team by team_name
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const company = await getOrCreateDefaultCompany();
    const teamName = decodeURIComponent(params.id);

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('company_id', company.id);

    if (error) {
      console.error('Error fetching team:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const team = JSON.parse(teamDoc.docs || '{}');
    return NextResponse.json(team);
  } catch (error) {
    console.error('Error in GET /api/teams/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    );
  }
}

// PATCH update team
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const updatedTeam: Team = await request.json();
    const company = await getOrCreateDefaultCompany();
    const teamName = decodeURIComponent(params.id);

    // Find the document with the matching team_name
    const { data: documents, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('company_id', company.id);

    if (fetchError) {
      console.error('Error fetching team:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const teamDoc = documents?.find((doc) => {
      try {
        const team = JSON.parse(doc.docs || '{}');
        return team.team_name === teamName;
      } catch (e) {
        return false;
      }
    });

    if (!teamDoc) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Update the document with the new team data
    const { error: updateError } = await supabase
      .from('documents')
      .update({ docs: JSON.stringify(updatedTeam) })
      .eq('id', teamDoc.id);

    if (updateError) {
      console.error('Error updating team:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error('Error in PATCH /api/teams/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    );
  }
}

// DELETE team
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const company = await getOrCreateDefaultCompany();
    const teamName = decodeURIComponent(params.id);

    // Find the document with the matching team_name
    const { data: documents, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('company_id', company.id);

    if (fetchError) {
      console.error('Error fetching team:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const teamDoc = documents?.find((doc) => {
      try {
        const team = JSON.parse(doc.docs || '{}');
        return team.team_name === teamName;
      } catch (e) {
        return false;
      }
    });

    if (!teamDoc) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Delete the document
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', teamDoc.id);

    if (deleteError) {
      console.error('Error deleting team:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/teams/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    );
  }
}
