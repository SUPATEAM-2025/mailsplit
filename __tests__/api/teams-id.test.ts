import { GET, PATCH, DELETE } from '@/app/api/teams/[id]/route';
import { NextRequest } from 'next/server';
import { mockTeam } from '../setup/mocks';

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

describe('/api/teams/[id]', () => {
  const mockParams = { params: { id: 'test-team-1' } };

  describe('GET', () => {
    it('should return a team by ID', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: [
              {
                id: 1,
                docs: JSON.stringify(mockTeam),
                company_id: 1,
              },
            ],
            error: null,
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/teams/test-team-1');
      const response = await GET(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTeam);
    });

    it('should return 404 if team not found', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/teams/nonexistent');
      const response = await GET(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Team not found');
    });

    it('should handle database errors', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: null,
            error: { message: 'Database error' },
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/teams/test-team-1');
      const response = await GET(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('PATCH', () => {
    it('should update a team', async () => {
      const { supabase } = require('@/lib/supabase');

      const updatedTeam = {
        ...mockTeam,
        team_name: 'Updated Team Name',
      };

      supabase.from = jest.fn((table) => {
        if (table === 'documents') {
          const callCount = supabase.from.mock.calls.filter((call: string[]) => call[0] === 'documents').length;

          if (callCount === 1) {
            // First call - SELECT to find the team
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => ({
                  data: [
                    {
                      id: 1,
                      docs: JSON.stringify(mockTeam),
                      company_id: 1,
                    },
                  ],
                  error: null,
                })),
              })),
            };
          } else {
            // Second call - UPDATE
            return {
              update: jest.fn(() => ({
                eq: jest.fn(() => ({
                  error: null,
                })),
              })),
            };
          }
        }
        return {};
      });

      const request = new NextRequest('http://localhost:3000/api/teams/test-team-1', {
        method: 'PATCH',
        body: JSON.stringify(updatedTeam),
      });

      const response = await PATCH(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.team_name).toBe('Updated Team Name');
    });

    it('should return 404 if team to update not found', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/teams/nonexistent', {
        method: 'PATCH',
        body: JSON.stringify(mockTeam),
      });

      const response = await PATCH(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Team not found');
    });
  });

  describe('DELETE', () => {
    it('should delete a team', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn((table) => {
        if (table === 'documents') {
          const callCount = supabase.from.mock.calls.filter((call: string[]) => call[0] === 'documents').length;

          if (callCount === 1) {
            // First call - SELECT to find the team
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => ({
                  data: [
                    {
                      id: 1,
                      docs: JSON.stringify(mockTeam),
                      company_id: 1,
                    },
                  ],
                  error: null,
                })),
              })),
            };
          } else {
            // Second call - DELETE
            return {
              delete: jest.fn(() => ({
                eq: jest.fn(() => ({
                  error: null,
                })),
              })),
            };
          }
        }
        return {};
      });

      const request = new NextRequest('http://localhost:3000/api/teams/test-team-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should return 404 if team to delete not found', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/teams/nonexistent', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Team not found');
    });
  });
});
