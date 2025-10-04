"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Team } from "@/lib/types";

interface TeamListProps {
  teams: Team[];
}

export function TeamList({ teams }: TeamListProps) {
  const handleCreate = () => {
    // TODO: Implement create team flow
    console.log("Create team");
  };

  const handleUpload = () => {
    // TODO: Implement upload document flow
    console.log("Upload document");
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

      <div className="space-y-6">
        {teams.map((team) => (
          <Link key={team.id} href={`/teams/${team.id}`} className="block">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{team.team_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {team.description}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {team.contact}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Products</h4>
                    <div className="flex flex-wrap gap-1">
                      {team.products.map((product, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Issues Handled</h4>
                    <div className="flex flex-wrap gap-1">
                      {team.issues_handled.map((issue, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
