import { Team, Email } from '@/lib/types';

export const mockTeam: Team = {
  id: 'test-team-1',
  team_name: 'Test Team',
  description: 'A test team for unit testing',
  products: ['Product A', 'Product B'],
  issues_handled: ['Bug reports', 'Feature requests'],
  contact: 'test@example.com',
};

export const mockTeams: Team[] = [
  mockTeam,
  {
    id: 'test-team-2',
    team_name: 'Support Team',
    description: 'Customer support team',
    products: ['Platform'],
    issues_handled: ['Account issues', 'General questions'],
    contact: 'support@example.com',
  },
];

export const mockEmail: Email = {
  id: '1',
  from: 'user@example.com',
  subject: 'Test Email',
  preview: 'This is a test email preview',
  content: 'This is the full content of the test email',
  date: '2024-03-15T10:30:00Z',
  assignedTeam: 'test-team-1',
  assignmentReason: 'Test assignment',
  notes: 'Test notes',
};

export const mockEmails: Email[] = [
  mockEmail,
  {
    id: '2',
    from: 'another@example.com',
    subject: 'Another Test',
    preview: 'Another preview',
    content: 'Another content',
    date: '2024-03-14T10:30:00Z',
  },
];

// Mock Supabase client
export const mockSupabaseClient = {
  from: jest.fn(() => mockSupabaseClient),
  select: jest.fn(() => mockSupabaseClient),
  insert: jest.fn(() => mockSupabaseClient),
  update: jest.fn(() => mockSupabaseClient),
  delete: jest.fn(() => mockSupabaseClient),
  eq: jest.fn(() => mockSupabaseClient),
  single: jest.fn(() => mockSupabaseClient),
  order: jest.fn(() => mockSupabaseClient),
  limit: jest.fn(() => mockSupabaseClient),
};

export function resetMockSupabase() {
  Object.values(mockSupabaseClient).forEach((fn) => {
    if (typeof fn === 'function') {
      (fn as jest.Mock).mockClear();
    }
  });
}
