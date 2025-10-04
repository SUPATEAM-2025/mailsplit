import { GET, POST } from '@/app/api/teams/route';
import { NextRequest } from 'next/server';
import { mockTeams, mockTeam } from '../setup/test-mocks';

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { id: 1 },
            error: null,
          })),
        })),
      })),
    })),
  },
  getOrCreateDefaultCompany: jest.fn().mockResolvedValue({
    id: 1,
    name: 'Test Company',
    slug: 'test-company',
    created_at: '2024-03-15T10:30:00Z',
  }),
}));

// Mock the data module
jest.mock('@/lib/data', () => ({
  mockTeams: [
    {
      id: 'test-team-1',
      team_name: 'Test Team',
      description: 'A test team',
      products: ['Product A'],
      issues_handled: ['Bug reports'],
      contact: 'test@example.com',
    },
  ],
  mockEmails: [],
}));

describe('/api/teams', () => {
  describe('GET', () => {
    it('should return teams from database', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              data: [
                {
                  id: 1,
                  docs: JSON.stringify(mockTeam),
                  company_id: 1,
                  created_at: '2024-03-15T10:30:00Z',
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
      expect(data[0]).toEqual(mockTeam);
    });

    it('should seed mock data if no teams exist', async () => {
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
    it('should create a new team', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: {
                id: 1,
                docs: JSON.stringify(mockTeam),
                company_id: 1,
              },
              error: null,
            })),
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/teams', {
        method: 'POST',
        body: JSON.stringify(mockTeam),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockTeam);
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

      const request = new NextRequest('http://localhost:3000/api/teams', {
        method: 'POST',
        body: JSON.stringify(mockTeam),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });
});
