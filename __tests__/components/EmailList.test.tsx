import { render, screen } from '../setup/test-utils';
import { EmailList } from '@/components/email-list';
import { mockEmails, mockTeams } from '../setup/test-mocks';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock format-date utility
jest.mock('@/lib/format-date', () => ({
  formatDistanceToNow: (date: string) => '2 hours ago',
}));

describe('EmailList Component', () => {
  it('should render the emails list', () => {
    render(<EmailList emails={mockEmails} teams={mockTeams} />);

    expect(screen.getByText('Test Email')).toBeInTheDocument();
    expect(screen.getByText('Another Test')).toBeInTheDocument();
  });

  it('should display email details', () => {
    render(<EmailList emails={mockEmails} teams={mockTeams} />);

    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('This is a test email preview')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

  it('should display team assignment when present', () => {
    render(<EmailList emails={mockEmails} teams={mockTeams} />);

    expect(screen.getByText('Team Assignment:')).toBeInTheDocument();
    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should not display team assignment when not assigned', () => {
    const emailsWithoutTeam = [mockEmails[1]]; // Second email has no assignment
    render(<EmailList emails={emailsWithoutTeam} teams={mockTeams} />);

    expect(screen.queryByText('Team Assignment:')).not.toBeInTheDocument();
  });

  it('should render email links correctly', () => {
    render(<EmailList emails={mockEmails} teams={mockTeams} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/emails/1');
    expect(links[1]).toHaveAttribute('href', '/emails/2');
  });

  it('should handle empty emails list', () => {
    render(<EmailList emails={[]} teams={mockTeams} />);

    expect(screen.queryByText('Test Email')).not.toBeInTheDocument();
  });

  it('should truncate preview text correctly', () => {
    render(<EmailList emails={mockEmails} teams={mockTeams} />);

    const preview = screen.getByText('This is a test email preview');
    expect(preview).toHaveClass('line-clamp-2');
  });

  it('should show sender email and timestamp', () => {
    render(<EmailList emails={mockEmails} teams={mockTeams} />);

    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('another@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('2 hours ago')).toHaveLength(2);
  });
});
