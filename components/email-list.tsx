"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Email, Team } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/format-date";

interface EmailListProps {
  emails: Email[];
  teams: Team[];
}

export function EmailList({ emails, teams }: EmailListProps) {
  const getTeamById = (teamId?: string) => {
    if (!teamId) return null;
    return teams.find((team) => team.id === teamId);
  };

  return (
    <div className="space-y-10">
      {emails.map((email) => {
        const assignedTeam = getTeamById(email.assignedTeam);

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
                </div>
              </div>

              {assignedTeam && (
                <div className="px-4 py-3 border-t bg-white/5">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Team Assignment:</span>
                    <span className="font-medium text-white">{assignedTeam.team_name}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-white/80">{assignedTeam.contact}</span>
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
