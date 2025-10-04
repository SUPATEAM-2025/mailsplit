import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all companies
export async function GET() {
  try {
    const { data: companies, error } = await supabase
      .from('company')
      .select('id, name, slug')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching companies:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no companies exist, create a default one
    if (!companies || companies.length === 0) {
      const { data: newCompany, error: createError } = await supabase
        .from('company')
        .insert({
          name: 'Default Company',
          slug: 'default-company',
        })
        .select('id, name, slug')
        .single();

      if (createError) {
        console.error('Error creating default company:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      return NextResponse.json([newCompany]);
    }

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error in GET /api/companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}
