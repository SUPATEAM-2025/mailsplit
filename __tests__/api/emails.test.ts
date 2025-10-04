import { GET, POST } from '@/app/api/emails/route';
import { NextRequest } from 'next/server';
import { mockEmail, mockEmails } from '../setup/mocks';

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
  getOrCreateDefaultCompany: jest.fn().mockResolvedValue({
    id: 1,
    name: 'Test Company',
    slug: 'test-company',
    created_at: '2024-03-15T10:30:00Z',
  }),
}));

jest.mock('@/lib/data', () => ({
  mockEmails: [
    {
      id: '1',
      from: 'test@example.com',
      subject: 'Test',
      preview: 'Preview',
      content: 'Content',
      date: '2024-03-15T10:30:00Z',
    },
  ],
  mockTeams: [],
}));

describe('/api/emails', () => {
  describe('GET', () => {
    it('should return emails from database', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              data: [
                {
                  id: 1,
                  from: mockEmail.from,
                  subject: mockEmail.subject,
                  text: mockEmail.content,
                  company_id: 1,
                  created_at: mockEmail.date,
                  assigned_to: mockEmail.assignedTeam,
                  meta: {
                    preview: mockEmail.preview,
                    assignmentReason: mockEmail.assignmentReason,
                  },
                  flag_notes: mockEmail.notes,
                  flagged: false,
                  attachments: null,
                },
              ],
              error: null,
            })),
          })),
        })),
      }));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].from).toBe(mockEmail.from);
    });

    it('should seed mock data if no emails exist', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              data: [],
              error: null,
            })),
          })),
        })),
        insert: jest.fn(() => ({
          data: null,
          error: null,
        })),
      }));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should handle database errors', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              data: null,
              error: { message: 'Database error' },
            })),
          })),
        })),
      }));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('POST', () => {
    it('should create a new email', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: {
                id: 1,
                from: mockEmail.from,
                subject: mockEmail.subject,
                text: mockEmail.content,
                company_id: 1,
                created_at: mockEmail.date,
                assigned_to: mockEmail.assignedTeam,
                meta: {
                  preview: mockEmail.preview,
                  assignmentReason: mockEmail.assignmentReason,
                },
                flag_notes: mockEmail.notes,
                flagged: false,
                attachments: null,
              },
              error: null,
            })),
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/emails', {
        method: 'POST',
        body: JSON.stringify(mockEmail),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.from).toBe(mockEmail.from);
    });

    it('should handle creation errors', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: { message: 'Insert failed' },
            })),
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/emails', {
        method: 'POST',
        body: JSON.stringify(mockEmail),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });
});
