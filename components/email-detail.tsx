"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Email, Team } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/format-date";

interface EmailDetailProps {
  email: Email;
  teams: Team[];
}

export function EmailDetail({ email, teams }: EmailDetailProps) {
  const [assignedTeam, setAssignedTeam] = useState(email.assignedTeam || "");
  const [notes, setNotes] = useState(email.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save when assignedTeam or notes change
  useEffect(() => {
    const hasChanges =
      assignedTeam !== (email.assignedTeam || "") ||
      notes !== (email.notes || "");

    if (!hasChanges) return;

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/emails/${email.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assignedTeam: assignedTeam || undefined,
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
  }, [assignedTeam, notes, email.id, email.assignedTeam, email.notes]);

  const selectedTeam = teams.find((team) => team.id === assignedTeam);

  return (
    <div className="space-y-6">
      {/* Email Card */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{email.subject}</h2>
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
          <Select value={assignedTeam} onValueChange={setAssignedTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.team_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTeam && (
            <div className="pt-2 space-y-1 border-t">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Team Email:</span>
                <span className="font-medium text-white">{selectedTeam.contact}</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedTeam.description}</p>
            </div>
          )}

          {email.assignedTeam && assignedTeam === email.assignedTeam && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground">Auto-generated with Algolia</p>
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
