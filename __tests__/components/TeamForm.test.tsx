import { render, screen, fireEvent, waitFor } from '../setup/test-utils';
import { TeamForm } from '@/components/team-form';
import { mockTeam } from '../setup/test-mocks';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockTeam),
  })
) as jest.Mock;

describe('TeamForm Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form with empty fields', () => {
    render(
      <TeamForm onClose={mockOnClose} onSave={mockOnSave} />
    );

    expect(screen.getByText('Create New Team')).toBeInTheDocument();
    expect(screen.getByLabelText(/team name/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByLabelText(/products/i)).toHaveValue('');
    expect(screen.getByLabelText(/issues handled/i)).toHaveValue('');
    expect(screen.getByLabelText(/contact/i)).toHaveValue('');
  });

  it('should render the form with initial data', () => {
    render(
      <TeamForm
        initialData={mockTeam}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Team')).toBeInTheDocument();
    expect(screen.getByLabelText(/team name/i)).toHaveValue(mockTeam.team_name);
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockTeam.description);
    expect(screen.getByLabelText(/products/i)).toHaveValue('Product A, Product B');
    expect(screen.getByLabelText(/issues handled/i)).toHaveValue('Bug reports, Feature requests');
    expect(screen.getByLabelText(/contact/i)).toHaveValue(mockTeam.contact);
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <TeamForm onClose={mockOnClose} onSave={mockOnSave} />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when X button is clicked', () => {
    render(
      <TeamForm onClose={mockOnClose} onSave={mockOnSave} />
    );

    const closeButton = screen.getByRole('button', { name: '' }); // X button has no text
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should submit the form with valid data', async () => {
    render(
      <TeamForm onClose={mockOnClose} onSave={mockOnSave} />
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/team name/i), {
      target: { value: 'New Team' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'A new team description' },
    });
    fireEvent.change(screen.getByLabelText(/products/i), {
      target: { value: 'Product X, Product Y' },
    });
    fireEvent.change(screen.getByLabelText(/issues handled/i), {
      target: { value: 'Issue A, Issue B' },
    });
    fireEvent.change(screen.getByLabelText(/contact/i), {
      target: { value: 'newteam@example.com' },
    });

    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save team/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/teams', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }));
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('should handle API errors gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ) as jest.Mock;

    // Mock window.alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <TeamForm onClose={mockOnClose} onSave={mockOnSave} />
    );

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/team name/i), {
      target: { value: 'New Team' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Description' },
    });
    fireEvent.change(screen.getByLabelText(/products/i), {
      target: { value: 'Product' },
    });
    fireEvent.change(screen.getByLabelText(/issues handled/i), {
      target: { value: 'Issue' },
    });
    fireEvent.change(screen.getByLabelText(/contact/i), {
      target: { value: 'test@example.com' },
    });

    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save team/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to save team. Please try again.');
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    alertSpy.mockRestore();
  });

  it('should parse comma-separated products and issues correctly', async () => {
    render(
      <TeamForm onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.change(screen.getByLabelText(/team name/i), {
      target: { value: 'Test Team' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Description' },
    });
    fireEvent.change(screen.getByLabelText(/products/i), {
      target: { value: 'Product A, Product B, Product C' },
    });
    fireEvent.change(screen.getByLabelText(/issues handled/i), {
      target: { value: 'Issue 1, Issue 2' },
    });
    fireEvent.change(screen.getByLabelText(/contact/i), {
      target: { value: 'test@example.com' },
    });

    const saveButton = screen.getByRole('button', { name: /save team/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      const callArg = (global.fetch as jest.Mock).mock.calls[0][1].body;
      const parsedBody = JSON.parse(callArg);
      expect(parsedBody.products).toEqual(['Product A', 'Product B', 'Product C']);
      expect(parsedBody.issues_handled).toEqual(['Issue 1', 'Issue 2']);
    });
  });
});
