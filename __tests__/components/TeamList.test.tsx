import { render, screen, fireEvent, waitFor } from '../setup/test-utils';
import { TeamList } from '@/components/team-list';
import { mockTeams } from '../setup/test-mocks';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('TeamList Component', () => {
  it('should render the teams list', () => {
    render(<TeamList teams={mockTeams} />);

    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('Support Team')).toBeInTheDocument();
  });

  it('should display team details', () => {
    render(<TeamList teams={mockTeams} />);

    expect(screen.getByText('A test team for unit testing')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Bug reports')).toBeInTheDocument();
  });

  it('should open create team form when Create Team button is clicked', () => {
    render(<TeamList teams={mockTeams} />);

    const createButton = screen.getByRole('button', { name: /create team/i });
    fireEvent.click(createButton);

    expect(screen.getByText('Create New Team')).toBeInTheDocument();
  });

  it('should open upload dialog when Upload Document button is clicked', () => {
    render(<TeamList teams={mockTeams} />);

    const uploadButton = screen.getByRole('button', { name: /upload document/i });
    fireEvent.click(uploadButton);

    expect(screen.getByText('Upload Team Document')).toBeInTheDocument();
  });

  it('should close the form when cancel is clicked', async () => {
    render(<TeamList teams={mockTeams} />);

    const createButton = screen.getByRole('button', { name: /create team/i });
    fireEvent.click(createButton);

    expect(screen.getByText('Create New Team')).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Create New Team')).not.toBeInTheDocument();
    });
  });

  it('should render team links correctly', () => {
    render(<TeamList teams={mockTeams} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/teams/test-team-1');
    expect(links[1]).toHaveAttribute('href', '/teams/test-team-2');
  });

  it('should handle empty teams list', () => {
    render(<TeamList teams={[]} />);

    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.queryByText('Test Team')).not.toBeInTheDocument();
  });
});
