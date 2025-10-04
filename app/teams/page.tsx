import { TeamList } from "@/components/team-list";

async function getTeams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'http://localhost:3000' : ''}/api/teams`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch teams');
    return [];
  }

  return res.json();
}

export default async function TeamsPage() {
  const teams = await getTeams();
  return <TeamList teams={teams} />;
}
