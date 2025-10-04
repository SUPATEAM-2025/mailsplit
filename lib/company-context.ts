'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabase } from './supabase';

const COMPANY_COOKIE_NAME = 'selected_company_id';

/**
 * Get the currently selected company ID from cookies
 * Falls back to the first available company if none selected or invalid
 */
export async function getSelectedCompanyId(): Promise<number> {
  const cookieStore = await cookies();
  const selectedId = cookieStore.get(COMPANY_COOKIE_NAME)?.value;

  // If we have a selected company ID in cookies, validate it exists
  if (selectedId) {
    const companyId = parseInt(selectedId, 10);
    const { data: company } = await supabase
      .from('company')
      .select('id')
      .eq('id', companyId)
      .single();

    if (company) {
      return companyId;
    }
  }

  // Fallback: get the first available company
  const { data: companies } = await supabase
    .from('company')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1);

  if (companies && companies.length > 0) {
    return companies[0].id;
  }

  // If no companies exist, create a default one
  const { data: newCompany } = await supabase
    .from('company')
    .insert({
      name: 'Default Company',
      slug: 'default-company',
    })
    .select('id')
    .single();

  return newCompany!.id;
}

/**
 * Set the selected company ID in cookies
 * @param companyId - The ID of the company to select
 */
export async function setSelectedCompanyId(companyId: number): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COMPANY_COOKIE_NAME, companyId.toString(), {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  // Revalidate pages that depend on company data
  revalidatePath('/');
  revalidatePath('/teams');
  revalidatePath('/emails');
}
