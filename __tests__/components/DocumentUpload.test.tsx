import { render, screen, fireEvent, waitFor } from '../setup/test-utils';
import { DocumentUpload } from '@/components/document-upload';
import { mockTeam } from '../setup/test-mocks';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockTeam),
  })
) as jest.Mock;

describe('DocumentUpload Component', () => {
  const mockOnDataExtracted = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the upload area', () => {
    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Drag and drop your document here')).toBeInTheDocument();
    expect(screen.getByText('or click to browse')).toBeInTheDocument();
    expect(screen.getByText('Supports PDF, TXT, DOCX, and MD files')).toBeInTheDocument();
  });

  it('should render cancel button', () => {
    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should call onClose when cancel is clicked', () => {
    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle valid file upload', async () => {
    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;

    // Simulate file selection
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/parse-document',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(mockOnDataExtracted).toHaveBeenCalledWith(mockTeam);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should reject invalid file types', async () => {
    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('Please upload a PDF, TXT, DOCX, or MD file')).toBeInTheDocument();
    });

    expect(mockOnDataExtracted).not.toHaveBeenCalled();
  });

  it('should show loading state during upload', async () => {
    // Make fetch hang
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText('Processing document...')).toBeInTheDocument();
    });
  });

  it('should handle upload errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    ) as jest.Mock;

    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/Server error/i)).toBeInTheDocument();
    });

    expect(mockOnDataExtracted).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle drag and drop', async () => {
    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const dropzone = screen.getByText('Drag and drop your document here').closest('div');
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    // Simulate drag over
    fireEvent.dragOver(dropzone!, {
      dataTransfer: {
        files: [file],
      },
    });

    // Should show dragging state (you might need to adjust based on your CSS)
    expect(dropzone).toHaveClass('border-primary');

    // Simulate drop
    fireEvent.drop(dropzone!, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should display file info after selection', async () => {
    // Reset fetch to resolve properly
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTeam),
      })
    ) as jest.Mock;

    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const file = new File(['a'.repeat(1024)], 'test-file.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    // File should be shown before processing completes
    await waitFor(() => {
      expect(screen.getByText('test-file.txt')).toBeInTheDocument();
    });
  });

  it('should accept PDF files', async () => {
    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const file = new File(['pdf content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should accept DOCX files', async () => {
    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const file = new File(['docx content'], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should accept Markdown files', async () => {
    render(
      <DocumentUpload
        onDataExtracted={mockOnDataExtracted}
        onClose={mockOnClose}
      />
    );

    const file = new File(['# Markdown'], 'test.md', { type: 'text/markdown' });
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
