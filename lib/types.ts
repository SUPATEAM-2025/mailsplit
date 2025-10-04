export interface ExtractedContact {
  team_name: string;
  contact_email: string;
  document_id: number;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  company_id: number;
  assignedTeam?: string; // Legacy: single team assignment
  assignedTeams?: string[]; // New: multiple team assignments
  assignmentReason?: string;
  notes?: string;
  extractedContacts?: ExtractedContact[];
  processingStatus?: string;
  processedAt?: string;
}

export interface Team {
  team_name: string;
  description: string;
  products: string[];
  issues_handled: string[];
  contact_email: string | string[];
  company_id: number;
}

// TeamInput is used for client-side team creation (company_id is set server-side)
export type TeamInput = Omit<Team, 'company_id'>;
