"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Email, Team } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/format-date";
import { Loader2 } from "lucide-react";

interface EmailListProps {
  emails: Email[];
  teams: Team[];
}

// Helper to capitalize status text
function capitalizeStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function EmailList({ emails, teams }: EmailListProps) {
  const getTeamsByIds = (teamIds?: string[]) => {
    if (!teamIds || teamIds.length === 0) return [];
    return teamIds
      .map((id) => teams.find((team) => team.team_name === id))
      .filter((team): team is Team => team !== undefined);
  };

  return (
    <div className="space-y-10">
      {emails.map((email) => {
        const assignedTeamIds = email.assignedTeams || (email.assignedTeam ? [email.assignedTeam] : []);
        const assignedTeamsData = getTeamsByIds(assignedTeamIds);

        return (
          <Link key={email.id} href={`/emails/${email.id}`} className="block">
            <Card className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{email.from}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(email.date)}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1 truncate">{email.subject}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {email.preview}
                    </p>
                  </div>
                  {email.processingStatus && (
                    <div className="flex-shrink-0">
                      <Badge
                        variant={email.processingStatus === 'completed' ? 'default' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        {email.processingStatus === 'pending' && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        {capitalizeStatus(email.processingStatus)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {assignedTeamsData.length > 0 && (
                <div className="px-4 py-3 border-t bg-white/5">
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="text-muted-foreground">Teams Assigned:</span>
                    {assignedTeamsData.slice(0, 2).map((team, index) => (
                      <div key={team.team_name} className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {team.team_name}
                        </Badge>
                        {index === 0 && assignedTeamsData.length > 1 && (
                          <span className="text-muted-foreground">•</span>
                        )}
                      </div>
                    ))}
                    {assignedTeamsData.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{assignedTeamsData.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
