import { notFound } from "next/navigation";
import { EmailDetail } from "@/components/email-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchEmailById, fetchTeams } from "@/lib/data-fetching";

export const dynamic = 'force-dynamic';

interface EmailPageProps {
  params: {
    id: string;
  };
}

export default async function EmailPage({ params }: EmailPageProps) {
  const [email, teams] = await Promise.all([
    fetchEmailById(params.id),
    fetchTeams(),
  ]);

  if (!email) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold">Email Details</h1>
      </div>
      <EmailDetail email={email} teams={teams} />
    </div>
  );
}
