import { notFound } from "next/navigation";
import { EmailDetail } from "@/components/email-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EmailPageProps {
  params: {
    id: string;
  };
}

async function getEmail(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'http://localhost:3000' : ''}/api/emails/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function getTeams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'http://localhost:3000' : ''}/api/teams`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function EmailPage({ params }: EmailPageProps) {
  const [email, teams] = await Promise.all([
    getEmail(params.id),
    getTeams(),
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
