import { TeamSearchResults } from "@/components/team-search-results";
import { fetchTeams } from "@/lib/data-fetching";
import { getSelectedCompanyId } from "@/lib/company-context";
import { LoadingWrapper } from "@/components/loading-wrapper";

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const [teams, companyId] = await Promise.all([
    fetchTeams(),
    getSelectedCompanyId(),
  ]);

  return (
    <LoadingWrapper>
      <TeamSearchResults key={companyId} fallbackTeams={teams} />
    </LoadingWrapper>
  );
}
