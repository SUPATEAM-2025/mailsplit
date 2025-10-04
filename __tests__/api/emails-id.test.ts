import { GET, PATCH } from '@/app/api/emails/[id]/route';
import { NextRequest } from 'next/server';
import { mockEmail } from '../setup/mocks';

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

describe('/api/emails/[id]', () => {
  const mockParams = { params: { id: '1' } };
  const mockDbEmail = {
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
    updated_at: null,
  };

  describe('GET', () => {
    it('should return an email by ID', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: mockDbEmail,
                error: null,
              })),
            })),
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/emails/1');
      const response = await GET(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.from).toBe(mockEmail.from);
      expect(data.subject).toBe(mockEmail.subject);
    });

    it('should return 404 if email not found', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: null,
                error: { code: 'PGRST116' },
              })),
            })),
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/emails/999');
      const response = await GET(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Email not found');
    });

    it('should handle database errors', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: null,
                error: { message: 'Database error', code: 'XXXXX' },
              })),
            })),
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/emails/1');
      const response = await GET(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('PATCH', () => {
    it('should update email assignment', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn((table) => {
        if (table === 'email') {
          const callCount = supabase.from.mock.calls.filter((call: string[]) => call[0] === 'email').length;

          if (callCount === 1) {
            // First call - SELECT for meta
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => ({
                  eq: jest.fn(() => ({
                    single: jest.fn(() => ({
                      data: mockDbEmail,
                      error: null,
                    })),
                  })),
                })),
              })),
            };
          } else {
            // Second call - UPDATE
            return {
              update: jest.fn(() => ({
                eq: jest.fn(() => ({
                  eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                      single: jest.fn(() => ({
                        data: {
                          ...mockDbEmail,
                          assigned_to: 'new-team',
                        },
                        error: null,
                      })),
                    })),
                  })),
                })),
              })),
            };
          }
        }
        return {};
      });

      const request = new NextRequest('http://localhost:3000/api/emails/1', {
        method: 'PATCH',
        body: JSON.stringify({ assignedTeam: 'new-team' }),
      });

      const response = await PATCH(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.assignedTeam).toBe('new-team');
    });

    it('should update email notes', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn((table) => {
        if (table === 'email') {
          const callCount = supabase.from.mock.calls.filter((call: string[]) => call[0] === 'email').length;

          if (callCount === 1) {
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => ({
                  eq: jest.fn(() => ({
                    single: jest.fn(() => ({
                      data: mockDbEmail,
                      error: null,
                    })),
                  })),
                })),
              })),
            };
          } else {
            return {
              update: jest.fn(() => ({
                eq: jest.fn(() => ({
                  eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                      single: jest.fn(() => ({
                        data: {
                          ...mockDbEmail,
                          flag_notes: 'Updated notes',
                        },
                        error: null,
                      })),
                    })),
                  })),
                })),
              })),
            };
          }
        }
        return {};
      });

      const request = new NextRequest('http://localhost:3000/api/emails/1', {
        method: 'PATCH',
        body: JSON.stringify({ notes: 'Updated notes' }),
      });

      const response = await PATCH(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.notes).toBe('Updated notes');
    });

    it('should update assignment reason in meta', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn((table) => {
        if (table === 'email') {
          const callCount = supabase.from.mock.calls.filter((call: string[]) => call[0] === 'email').length;

          if (callCount === 1) {
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => ({
                  eq: jest.fn(() => ({
                    single: jest.fn(() => ({
                      data: mockDbEmail,
                      error: null,
                    })),
                  })),
                })),
              })),
            };
          } else {
            return {
              update: jest.fn(() => ({
                eq: jest.fn(() => ({
                  eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                      single: jest.fn(() => ({
                        data: {
                          ...mockDbEmail,
                          meta: {
                            ...mockDbEmail.meta,
                            assignmentReason: 'New reason',
                          },
                        },
                        error: null,
                      })),
                    })),
                  })),
                })),
              })),
            };
          }
        }
        return {};
      });

      const request = new NextRequest('http://localhost:3000/api/emails/1', {
        method: 'PATCH',
        body: JSON.stringify({ assignmentReason: 'New reason' }),
      });

      const response = await PATCH(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.assignmentReason).toBe('New reason');
    });

    it('should handle update errors', async () => {
      const { supabase } = require('@/lib/supabase');

      supabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: mockDbEmail,
                error: null,
              })),
            })),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() => ({
                  data: null,
                  error: { message: 'Update failed' },
                })),
              })),
            })),
          })),
        })),
      }));

      const request = new NextRequest('http://localhost:3000/api/emails/1', {
        method: 'PATCH',
        body: JSON.stringify({ notes: 'New notes' }),
      });

      const response = await PATCH(request, mockParams);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });
});
