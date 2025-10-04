"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Upload } from "lucide-react";
import { Team } from "@/lib/types";
import { TeamForm } from "./team-form";
import { DocumentUpload } from "./document-upload";

interface TeamListProps {
  teams: Team[];
}

export function TeamList({ teams }: TeamListProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<Team> | null>(null);
  const [teamList, setTeamList] = useState(teams);

  const handleCreate = () => {
    setExtractedData(null);
    setShowForm(true);
  };

  const handleSave = (team: Team) => {
    setShowForm(false);
    setExtractedData(null);
    // Add the new team to local state immediately
    setTeamList([team, ...teamList]);
    // Also refresh the page to sync with server
    router.refresh();
  };

  const handleUpload = () => {
    setShowUploadDialog(true);
  };

  const handleDataExtracted = (data: Partial<Team>) => {
    setExtractedData(data);
    setShowUploadDialog(false);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Teams</h1>
        <div className="flex gap-2">
          <Button onClick={handleUpload} variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Team Document</DialogTitle>
            <DialogDescription>
              Upload a document containing team information. We'll automatically
              extract and fill in the team details for you to review.
            </DialogDescription>
          </DialogHeader>
          <DocumentUpload
            onDataExtracted={handleDataExtracted}
            onClose={() => setShowUploadDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {showForm && (
        <TeamForm
          initialData={extractedData}
          onClose={() => {
            setShowForm(false);
            setExtractedData(null);
          }}
          onSave={handleSave}
        />
      )}

      <div className="space-y-6">
        {teamList.map((team, idx) => {
          const emails = Array.isArray(team.contact_email)
            ? team.contact_email
            : [team.contact_email];
          const displayEmails = emails.slice(0, 3);
          const hasMoreEmails = emails.length > 3;

          const displayProducts = team.products.slice(0, 2);
          const remainingProducts = team.products.length - 2;

          const displayIssues = team.issues_handled.slice(0, 2);
          const remainingIssues = team.issues_handled.length - 2;

          const displayDescription = team.description.replace(/\n/g, ' ');

          return (
            <Link key={idx} href={`/teams/${encodeURIComponent(team.team_name)}`} className="block">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="text-lg font-semibold">{team.team_name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 overflow-hidden">
                        {displayDescription}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground text-right flex-shrink-0 min-w-0 max-w-[200px]">
                      <div className="truncate">
                        {displayEmails.join(", ")}
                        {hasMoreEmails && "..."}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Products</h4>
                      <div className="flex flex-wrap gap-1">
                        {displayProducts.map((product, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs"
                          >
                            {product}
                          </span>
                        ))}
                        {remainingProducts > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
                            ... +{remainingProducts} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Issues Handled</h4>
                      <div className="flex flex-wrap gap-1">
                        {displayIssues.map((issue, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs"
                          >
                            {issue}
                          </span>
                        ))}
                        {remainingIssues > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
                            ... +{remainingIssues} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
