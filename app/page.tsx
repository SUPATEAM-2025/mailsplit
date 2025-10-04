import { EmailSearchResults } from "@/components/email-search-results";
import { fetchEmails, fetchTeams } from "@/lib/data-fetching";
import { getSelectedCompanyId } from "@/lib/company-context";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [emails, teams, companyId] = await Promise.all([
    fetchEmails(),
    fetchTeams(),
    getSelectedCompanyId(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Emails</h1>
      </div>
      <EmailSearchResults key={companyId} teams={teams} fallbackEmails={emails} />
    </div>
  );
}
