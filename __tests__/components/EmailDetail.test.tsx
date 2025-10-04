import { render, screen, fireEvent, waitFor } from '../setup/test-utils';
import { EmailDetail } from '@/components/email-detail';
import { mockEmail, mockTeams } from '../setup/mocks';
import userEvent from '@testing-library/user-event';

// Mock format-date utility
jest.mock('@/lib/format-date', () => ({
  formatDistanceToNow: (date: string) => '2 hours ago',
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('EmailDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render email details', () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    expect(screen.getByText('Test Email')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('This is the full content of the test email')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

  it('should display team assignment section', () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    expect(screen.getByText('Team Assignment')).toBeInTheDocument();
    expect(screen.getByText('Test Team')).toBeInTheDocument();
  });

  it('should display notes section', () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add your notes here...')).toHaveValue('Test notes');
  });

  it('should allow changing team assignment', async () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    // Find the select trigger and click it
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    // Wait for the options to appear and select one
    await waitFor(() => {
      const option = screen.getByText('Support Team');
      fireEvent.click(option);
    });

    // Fast-forward time to trigger the debounced save
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/emails/${mockEmail.id}`,
        expect.objectContaining({
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  it('should auto-save notes after typing', async () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    const notesTextarea = screen.getByPlaceholderText('Add your notes here...');
    fireEvent.change(notesTextarea, {
      target: { value: 'Updated notes' },
    });

    // Fast-forward time to trigger the debounced save
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/emails/${mockEmail.id}`,
        expect.objectContaining({
          method: 'PATCH',
          body: expect.stringContaining('Updated notes'),
        })
      );
    });
  });

  it('should display saving indicator when auto-saving', async () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    const notesTextarea = screen.getByPlaceholderText('Add your notes here...');
    fireEvent.change(notesTextarea, {
      target: { value: 'New notes' },
    });

    // Fast-forward time
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });

  it('should show team contact information when team is selected', () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    expect(screen.getByText('Team Email:')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('A test team for unit testing')).toBeInTheDocument();
  });

  it('should show auto-assignment indicator for pre-assigned emails', () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    expect(screen.getByText('Auto-generated with Algolia')).toBeInTheDocument();
  });

  it('should not show auto-assignment indicator if team is changed', async () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    // Initially should show
    expect(screen.getByText('Auto-generated with Algolia')).toBeInTheDocument();

    // Change the team
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);

    await waitFor(() => {
      const option = screen.getByText('Support Team');
      fireEvent.click(option);
    });

    // Should not show after change
    expect(screen.queryByText('Auto-generated with Algolia')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ) as jest.Mock;

    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    const notesTextarea = screen.getByPlaceholderText('Add your notes here...');
    fireEvent.change(notesTextarea, {
      target: { value: 'New notes' },
    });

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving changes:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('should debounce multiple rapid changes', async () => {
    render(<EmailDetail email={mockEmail} teams={mockTeams} />);

    const notesTextarea = screen.getByPlaceholderText('Add your notes here...');

    // Make multiple rapid changes
    fireEvent.change(notesTextarea, { target: { value: 'First' } });
    jest.advanceTimersByTime(500);
    fireEvent.change(notesTextarea, { target: { value: 'Second' } });
    jest.advanceTimersByTime(500);
    fireEvent.change(notesTextarea, { target: { value: 'Third' } });
    jest.advanceTimersByTime(1000);

    // Should only call fetch once after the last change
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
