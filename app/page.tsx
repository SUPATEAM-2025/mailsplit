import { EmailList } from "@/components/email-list";
import { mockEmails, mockTeams } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Emails</h1>
      </div>
      <EmailList emails={mockEmails} teams={mockTeams} />
    </div>
  );
}
