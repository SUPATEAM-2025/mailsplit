import { notFound } from "next/navigation";
import { TeamDetail } from "@/components/team-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchTeamByName } from "@/lib/data-fetching";

export const dynamic = 'force-dynamic';

interface TeamPageProps {
  params: {
    id: string;
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const team = await fetchTeamByName(params.id);

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
