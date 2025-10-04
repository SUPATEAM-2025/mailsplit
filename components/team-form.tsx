"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Team } from "@/lib/types";

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
    contact: initialData?.contact || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const team: Team = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      team_name: formData.team_name,
      description: formData.description,
      products: formData.products.split(",").map((p) => p.trim()).filter(Boolean),
      issues_handled: formData.issues_handled.split(",").map((i) => i.trim()).filter(Boolean),
      contact: formData.contact,
    };

    onSave(team);
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
            <label htmlFor="contact" className="text-sm font-medium">
              Contact
            </label>
            <Input
              id="contact"
              type="email"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              placeholder="team@company.com"
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Team</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
