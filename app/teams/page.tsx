import { TeamSearchResults } from "@/components/team-search-results";
import { fetchTeams } from "@/lib/data-fetching";
import { getSelectedCompanyId } from "@/lib/company-context";

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const [teams, companyId] = await Promise.all([
    fetchTeams(),
    getSelectedCompanyId(),
  ]);

  return <TeamSearchResults key={companyId} fallbackTeams={teams} />;
}
