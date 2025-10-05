import { Email, Team } from './types';

/**
 * Filters emails by keyword search across multiple fields
 * Case-insensitive search
 */
export function filterEmailsByKeyword(emails: Email[], query: string): Email[] {
  if (!query || query.trim() === '') {
    return emails;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return emails.filter(email => {
    // Search in basic fields
    const searchableText = [
      email.from,
      email.subject,
      email.preview,
      email.content,
      email.notes || '',
      email.assignedTeam || '',
      ...(email.assignedTeams || []),
    ].join(' ').toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

/**
 * Filters teams by keyword search across multiple fields
 * Case-insensitive search
 */
export function filterTeamsByKeyword(teams: Team[], query: string): Team[] {
  if (!query || query.trim() === '') {
    return teams;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return teams.filter(team => {
    // Convert contact_email to array if it's a string
    const contactEmails = Array.isArray(team.contact_email)
      ? team.contact_email
      : [team.contact_email];

    // Search in all relevant fields
    const searchableText = [
      team.team_name,
      team.description,
      ...team.products,
      ...team.issues_handled,
      ...contactEmails,
    ].join(' ').toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}
