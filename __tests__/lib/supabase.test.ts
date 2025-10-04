import { getOrCreateDefaultCompany } from '@/lib/supabase';
import { mockSupabaseClient, resetMockSupabase } from '../setup/mocks';

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseClient,
  getOrCreateDefaultCompany: jest.fn(),
}));

describe('Supabase Utilities', () => {
  beforeEach(() => {
    resetMockSupabase();
    jest.clearAllMocks();
  });

  describe('getOrCreateDefaultCompany', () => {
    it('should return existing company if one exists', async () => {
      const mockCompany = {
        id: 1,
        name: 'Test Company',
        slug: 'test-company',
        created_at: '2024-03-15T10:30:00Z',
      };

      (getOrCreateDefaultCompany as jest.Mock).mockResolvedValue(mockCompany);

      const result = await getOrCreateDefaultCompany();

      expect(result).toEqual(mockCompany);
    });

    it('should create a new company if none exists', async () => {
      const mockNewCompany = {
        id: 1,
        name: 'Default Company',
        slug: 'default-company',
        created_at: '2024-03-15T10:30:00Z',
      };

      (getOrCreateDefaultCompany as jest.Mock).mockResolvedValue(mockNewCompany);

      const result = await getOrCreateDefaultCompany();

      expect(result).toEqual(mockNewCompany);
      expect(result.name).toBe('Default Company');
    });

    it('should throw error if database operation fails', async () => {
      const mockError = new Error('Database error');
      (getOrCreateDefaultCompany as jest.Mock).mockRejectedValue(mockError);

      await expect(getOrCreateDefaultCompany()).rejects.toThrow('Database error');
    });
  });
});
