"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { Team } from "@/lib/types";
import { toast } from "sonner";

interface TeamFormProps {
  initialData?: Partial<Team> | null;
  onClose: () => void;
  onSave: (team: Team) => void;
}

export function TeamForm({ initialData, onClose, onSave }: TeamFormProps) {
  const [formData, setFormData] = useState({
    team_name: initialData?.team_name || "",
    description: initialData?.description || "",
    products: initialData?.products?.join(", ") || "",
    issues_handled: initialData?.issues_handled?.join(", ") || "",
    contact_email: Array.isArray(initialData?.contact_email)
      ? initialData.contact_email.join(", ")
      : initialData?.contact_email || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions

    const team: Team = {
      team_name: formData.team_name,
      description: formData.description,
      products: formData.products.split(",").map((p) => p.trim()).filter(Boolean),
      issues_handled: formData.issues_handled.split(",").map((i) => i.trim()).filter(Boolean),
      contact_email: formData.contact_email.split(",").map((e) => e.trim()).filter(Boolean),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(team),
      });

      if (!response.ok) {
        throw new Error('Failed to save team');
      }

      toast.success('Team created successfully!');
      onSave(team);
    } catch (error) {
      console.error('Error saving team:', error);
      toast.error('Failed to save team. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {initialData ? "Edit Team" : "Create New Team"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="team_name" className="text-sm font-medium">
              Team Name
            </label>
            <Input
              id="team_name"
              value={formData.team_name}
              onChange={(e) =>
                setFormData({ ...formData, team_name: e.target.value })
              }
              placeholder="e.g., Customer Support"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the team's responsibilities"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="products" className="text-sm font-medium">
              Products
            </label>
            <Input
              id="products"
              value={formData.products}
              onChange={(e) =>
                setFormData({ ...formData, products: e.target.value })
              }
              placeholder="Comma-separated list (e.g., Product A, Product B)"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter products separated by commas
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="issues_handled" className="text-sm font-medium">
              Issues Handled
            </label>
            <Input
              id="issues_handled"
              value={formData.issues_handled}
              onChange={(e) =>
                setFormData({ ...formData, issues_handled: e.target.value })
              }
              placeholder="Comma-separated list (e.g., Bug reports, Feature requests)"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter issue types separated by commas
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="contact_email" className="text-sm font-medium">
              Contact Emails
            </label>
            <Input
              id="contact_email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
              placeholder="team@company.com, support@company.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter emails separated by commas
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Team'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
