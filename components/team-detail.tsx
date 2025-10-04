"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Team } from "@/lib/types";
import { toast } from "sonner";

interface TeamDetailProps {
  team: Team;
}

export function TeamDetail({ team }: TeamDetailProps) {
  const [teamName, setTeamName] = useState(team.team_name);
  const [description, setDescription] = useState(team.description);
  const [productsInput, setProductsInput] = useState(team.products.join(", "));
  const [issuesInput, setIssuesInput] = useState(team.issues_handled.join(", "));
  const [contactEmail, setContactEmail] = useState(
    Array.isArray(team.contact_email)
      ? team.contact_email.join(", ")
      : team.contact_email
  );

  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllIssues, setShowAllIssues] = useState(false);
  const [showAllEmails, setShowAllEmails] = useState(false);

  useEffect(() => {
    const originalEmail = Array.isArray(team.contact_email)
      ? team.contact_email.join(", ")
      : team.contact_email;

    const changed =
      teamName !== team.team_name ||
      description !== team.description ||
      productsInput !== team.products.join(", ") ||
      issuesInput !== team.issues_handled.join(", ") ||
      contactEmail !== originalEmail;

    setHasChanges(changed);
  }, [teamName, description, productsInput, issuesInput, contactEmail, team]);

  const handleCancel = () => {
    if (isSubmitting) return;

    setTeamName(team.team_name);
    setDescription(team.description);
    setProductsInput(team.products.join(", "));
    setIssuesInput(team.issues_handled.join(", "));
    setContactEmail(
      Array.isArray(team.contact_email)
        ? team.contact_email.join(", ")
        : team.contact_email
    );
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const handleSave = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    const updatedTeam: Team = {
      team_name: teamName,
      description,
      products: productsInput.split(",").map((p) => p.trim()).filter(Boolean),
      issues_handled: issuesInput.split(",").map((i) => i.trim()).filter(Boolean),
      contact_email: contactEmail.split(",").map((e) => e.trim()).filter(Boolean),
    };

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual API endpoint when available
      console.log("Saving team:", updatedTeam);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      toast.success("Changes saved successfully!");
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving team:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const products = productsInput.split(",").map((p) => p.trim()).filter(Boolean);
  const issues = issuesInput.split(",").map((i) => i.trim()).filter(Boolean);
  const emails = contactEmail.split(",").map((e) => e.trim()).filter(Boolean);

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
              <label htmlFor="contact_email" className="text-sm font-medium">
                Contact Emails
              </label>
              <Input
                id="contact_email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="team@company.com, support@company.com"
              />
              <p className="text-xs text-muted-foreground">
                Enter emails separated by commas
              </p>
            </div>

            {emails.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(showAllEmails ? emails : emails.slice(0, 5)).map((email, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-sm"
                    >
                      {email}
                    </span>
                  ))}
                </div>
                {emails.length > 5 && (
                  <button
                    onClick={() => setShowAllEmails(!showAllEmails)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showAllEmails ? (
                      "Show less"
                    ) : (
                      <>
                        ... +{emails.length - 5} more
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
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
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(showAllProducts ? products : products.slice(0, 5)).map((product, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-sm"
                    >
                      {product}
                    </span>
                  ))}
                </div>
                {products.length > 5 && (
                  <button
                    onClick={() => setShowAllProducts(!showAllProducts)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showAllProducts ? (
                      "Show less"
                    ) : (
                      <>
                        ... +{products.length - 5} more
                      </>
                    )}
                  </button>
                )}
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
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(showAllIssues ? issues : issues.slice(0, 5)).map((issue, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-sm"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
                {issues.length > 5 && (
                  <button
                    onClick={() => setShowAllIssues(!showAllIssues)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showAllIssues ? (
                      "Show less"
                    ) : (
                      <>
                        ... +{issues.length - 5} more
                      </>
                    )}
                  </button>
                )}
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
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
