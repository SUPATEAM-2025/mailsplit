export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  assignedTeam?: string;
  assignmentReason?: string;
  notes?: string;
}

export interface Team {
  team_name: string;
  description: string;
  products: string[];
  issues_handled: string[];
  contact_email: string | string[];
}
