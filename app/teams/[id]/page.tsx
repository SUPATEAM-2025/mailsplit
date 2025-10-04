import { notFound } from "next/navigation";
import { TeamDetail } from "@/components/team-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TeamPageProps {
  params: {
    id: string;
  };
}

async function getTeam(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'http://localhost:3000' : ''}/api/teams/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function TeamPage({ params }: TeamPageProps) {
  const team = await getTeam(params.id);

  if (!team) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teams">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold">Team Details</h1>
      </div>
      <TeamDetail team={team} />
    </div>
  );
}
