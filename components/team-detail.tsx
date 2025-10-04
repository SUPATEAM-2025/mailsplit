"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Team } from "@/lib/types";

interface TeamDetailProps {
  team: Team;
}

export function TeamDetail({ team }: TeamDetailProps) {
  const [teamName, setTeamName] = useState(team.team_name);
  const [description, setDescription] = useState(team.description);
  const [productsInput, setProductsInput] = useState(team.products.join(", "));
  const [issuesInput, setIssuesInput] = useState(team.issues_handled.join(", "));
  const [contact, setContact] = useState(team.contact);

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed =
      teamName !== team.team_name ||
      description !== team.description ||
      productsInput !== team.products.join(", ") ||
      issuesInput !== team.issues_handled.join(", ") ||
      contact !== team.contact;

    setHasChanges(changed);
  }, [teamName, description, productsInput, issuesInput, contact, team]);

  const handleCancel = () => {
    setTeamName(team.team_name);
    setDescription(team.description);
    setProductsInput(team.products.join(", "));
    setIssuesInput(team.issues_handled.join(", "));
    setContact(team.contact);
    setHasChanges(false);
  };

  const handleSave = () => {
    const updatedTeam: Team = {
      ...team,
      team_name: teamName,
      description,
      products: productsInput.split(",").map((p) => p.trim()).filter(Boolean),
      issues_handled: issuesInput.split(",").map((i) => i.trim()).filter(Boolean),
      contact,
    };

    console.log("Saving team:", updatedTeam);
    setHasChanges(false);
  };

  const products = productsInput.split(",").map((p) => p.trim()).filter(Boolean);
  const issues = issuesInput.split(",").map((i) => i.trim()).filter(Boolean);

  return (
    <>
      <div className="space-y-6 pb-24">
        {/* Team Name & Contact */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Team Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="team_name" className="text-sm font-medium">
                Team Name
              </label>
              <Input
                id="team_name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Customer Support"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact" className="text-sm font-medium">
                Contact Email
              </label>
              <Input
                id="contact"
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="team@company.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Description</h3>
          </CardHeader>
          <CardContent>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the team's responsibilities"
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Products</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={productsInput}
                onChange={(e) => setProductsInput(e.target.value)}
                placeholder="Comma-separated list (e.g., Product A, Product B)"
              />
              <p className="text-xs text-muted-foreground">
                Enter products separated by commas
              </p>
            </div>

            {products.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {products.map((product, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-sm"
                  >
                    {product}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issues Handled */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Issues Handled</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={issuesInput}
                onChange={(e) => setIssuesInput(e.target.value)}
                placeholder="Comma-separated list (e.g., Bug reports, Feature requests)"
              />
              <p className="text-xs text-muted-foreground">
                Enter issue types separated by commas
              </p>
            </div>

            {issues.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {issues.map((issue, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-sm"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sticky Bottom Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-64 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="container max-w-5xl py-4">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
