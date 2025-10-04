"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { Email, Team } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/format-date";
import { supabaseBrowser } from "@/lib/supabase-client";
import { Loader2 } from "lucide-react";

interface EmailDetailProps {
  email: Email;
  teams: Team[];
}

// Helper to capitalize status text
function capitalizeStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function EmailDetail({ email: initialEmail, teams }: EmailDetailProps) {
  const [email, setEmail] = useState(initialEmail);
  const [assignedTeams, setAssignedTeams] = useState<string[]>(
    email.assignedTeams || (email.assignedTeam ? [email.assignedTeam] : [])
  );
  const [notes, setNotes] = useState(email.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [expandedEmails, setExpandedEmails] = useState<Record<string, boolean>>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  // Auto-populate assignedTeams from extractedContacts when email loads
  useEffect(() => {
    if (email.extractedContacts && email.extractedContacts.length > 0 && assignedTeams.length === 0) {
      const extractedTeamNames = email.extractedContacts.map(contact => contact.team_name);
      setAssignedTeams(extractedTeamNames);
    }
  }, [email.extractedContacts]);

  // Realtime subscription for extracted_contacts and processing_status changes
  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`email-${email.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'email',
          filter: `id=eq.${email.id}`,
        },
        (payload) => {
          const updatedEmail = payload.new as any;

          // Update email state with new data
          setEmail((prev) => ({
            ...prev,
            extractedContacts: updatedEmail.extracted_contacts || prev.extractedContacts,
            processingStatus: updatedEmail.processing_status || prev.processingStatus,
            processedAt: updatedEmail.processed_at || prev.processedAt,
          }));

          // NOTE: assigned_to column is deprecated for extracted contacts.
          // extracted_contacts is the source of truth for initial team assignments.
          // assigned_to is still used for storage of user-selected teams.
          // Update assignedTeams if changed from external source
          if (updatedEmail.assigned_to) {
            const teams = updatedEmail.assigned_to.split(',').filter((t: string) => t.trim());
            setAssignedTeams(teams);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [email.id]);

  // Auto-save when assignedTeams or notes change
  useEffect(() => {
    const initialTeams = initialEmail.assignedTeams || (initialEmail.assignedTeam ? [initialEmail.assignedTeam] : []);
    const teamsChanged = JSON.stringify(assignedTeams.sort()) !== JSON.stringify(initialTeams.sort());
    const notesChanged = notes !== (initialEmail.notes || "");

    if (!teamsChanged && !notesChanged) return;

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/emails/${email.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assignedTeams: assignedTeams.length > 0 ? assignedTeams : undefined,
            notes: notes || undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save changes');
        }
      } catch (error) {
        console.error('Error saving changes:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(saveTimeout);
  }, [assignedTeams, notes, email.id, initialEmail]);

  const teamOptions = teams.map((team) => ({
    value: team.team_name,
    label: team.team_name,
  }));

  const selectedTeamDetails = teams.filter((team) => assignedTeams.includes(team.team_name));

  return (
    <div className="space-y-6">
      {/* Email Card */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{email.subject}</h2>
                {email.processingStatus && (
                  <Badge
                    variant={email.processingStatus === 'completed' ? 'default' : 'secondary'}
                    className="flex items-center gap-1"
                  >
                    {email.processingStatus === 'pending' && (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    )}
                    {capitalizeStatus(email.processingStatus)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{email.from}</span>
                <span>•</span>
                <span>{formatDistanceToNow(email.date)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {email.content}
          </p>
        </CardContent>
      </Card>

      {/* Team Assignment */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Assignment</h3>
            {isSaving && (
              <span className="text-xs text-muted-foreground">Saving...</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <MultiSelect
            options={teamOptions}
            selected={assignedTeams}
            onChange={setAssignedTeams}
            placeholder="Select teams..."
          />

          {selectedTeamDetails.length > 0 && (
            <div className="pt-2 space-y-3 border-t">
              {selectedTeamDetails.map((team) => {
                const emails = Array.isArray(team.contact_email)
                  ? team.contact_email
                  : [team.contact_email];
                const showAllEmails = expandedEmails[team.team_name] || false;
                const displayEmails = showAllEmails ? emails : emails.slice(0, 2);

                const description = team.description || '';
                const showFullDescription = expandedDescriptions[team.team_name] || false;
                const isLongDescription = description.length > 150 || description.split('\n').length > 2;
                const displayDescription = (showFullDescription || !isLongDescription)
                  ? description
                  : description.slice(0, 150) + '...';

                return (
                  <div key={team.team_name} className="space-y-1">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="font-medium text-white whitespace-nowrap">{team.team_name}</span>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex-1 text-white/80">
                        {displayEmails.join(', ')}
                        {emails.length > 2 && (
                          <>
                            {' '}
                            <button
                              onClick={() => setExpandedEmails(prev => ({
                                ...prev,
                                [team.team_name]: !prev[team.team_name]
                              }))}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline"
                            >
                              {showAllEmails ? (
                                "Show less"
                              ) : (
                                <>... +{emails.length - 2} more</>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{displayDescription}</p>
                      {isLongDescription && (
                        <button
                          onClick={() => setExpandedDescriptions(prev => ({
                            ...prev,
                            [team.team_name]: !prev[team.team_name]
                          }))}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                        >
                          {showFullDescription ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Notes</h3>
          <p className="text-sm text-muted-foreground">
            Add extra context or observations about this email
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
