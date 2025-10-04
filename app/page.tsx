import { EmailList } from "@/components/email-list";

async function getEmails() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'http://localhost:3000' : ''}/api/emails`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Failed to fetch emails');
    return [];
  }

  return res.json();
}

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

export default async function HomePage() {
  const [emails, teams] = await Promise.all([getEmails(), getTeams()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Emails</h1>
      </div>
      <EmailList emails={emails} teams={teams} />
    </div>
  );
}
