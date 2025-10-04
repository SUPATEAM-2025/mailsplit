import { TeamList } from "@/components/team-list";
import { mockTeams } from "@/lib/data";

export default function TeamsPage() {
  return <TeamList teams={mockTeams} />;
}
