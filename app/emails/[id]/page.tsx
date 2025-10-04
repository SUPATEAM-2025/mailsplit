import { notFound } from "next/navigation";
import { EmailDetail } from "@/components/email-detail";
import { mockEmails, mockTeams } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EmailPageProps {
  params: {
    id: string;
  };
}

export default function EmailPage({ params }: EmailPageProps) {
  const email = mockEmails.find((e) => e.id === params.id);

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
      <EmailDetail email={email} teams={mockTeams} />
    </div>
  );
}
