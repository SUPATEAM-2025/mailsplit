import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get or create a default company
export async function getOrCreateDefaultCompany() {
  const { data: companies, error } = await supabase
    .from('company')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching company:', error);
    throw error;
  }

  if (companies && companies.length > 0) {
    return companies[0];
  }

  // Create default company if none exists
  const { data: newCompany, error: createError } = await supabase
    .from('company')
    .insert({
      name: 'Default Company',
      slug: 'default-company',
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating company:', createError);
    throw createError;
  }

  return newCompany;
}
