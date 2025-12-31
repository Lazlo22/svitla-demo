import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@test/test-utils';
import { mockNavigate, mockParams } from '@test/setup';
import { mockFile } from '@test/mocks/data';
import userEvent from '@testing-library/user-event';
import FilePage from '@pages/FilePage';
import { useFileStore } from '@stores/fileStore';
import { act } from '@testing-library/react';

// Mock FileViewer component to avoid PDF.js issues in tests
vi.mock('@components/file/FileViewer', () => ({
  FileViewer: ({ file }: { file: { name: string } }) => (
    <div data-testid="file-viewer">Viewing: {file.name}</div>
  ),
}));

describe('FilePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockParams.mockReturnValue({ id: 'file-1' });
    act(() => {
      useFileStore.setState({ files: [mockFile] });
    });
  });

  it('renders file name', async () => {
    render(<FilePage />);

    expect(await screen.findByText('test-document.pdf')).toBeInTheDocument();
  });

  it('renders file size', async () => {
    render(<FilePage />);

    expect(await screen.findByText('1.00 MB')).toBeInTheDocument();
  });

  it('shows FileNotFound when file does not exist', async () => {
    act(() => {
      useFileStore.setState({ files: [] });
    });

    render(<FilePage />);

    expect(await screen.findByText('File not found')).toBeInTheDocument();
  });

  it('updates file name immediately after rename', async () => {
    const user = userEvent.setup();

    render(<FilePage />);

    // Wait for initial render
    expect(await screen.findByText('test-document.pdf')).toBeInTheDocument();

    // Click rename button
    const renameButton = screen.getByTitle('Rename');
    await user.click(renameButton);

    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Find input and change name
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'renamed-document');

    // Click save button
    const saveButton = screen.getByRole('button', { name: /rename/i });
    await user.click(saveButton);

    // Verify the name updates immediately without refresh
    await waitFor(() => {
      expect(screen.getByText('renamed-document.pdf')).toBeInTheDocument();
      expect(screen.queryByText('test-document.pdf')).not.toBeInTheDocument();
    });
  });

  it('file persists after simulated refresh', async () => {
    const user = userEvent.setup();

    render(<FilePage />);

    // Rename the file
    const renameButton = await screen.findByTitle('Rename');
    await user.click(renameButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'renamed-document');

    const saveButton = screen.getByRole('button', { name: /rename/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getAllByText('renamed-document.pdf')[0]).toBeInTheDocument();
    });

    // Simulate refresh by re-rendering with the updated store state
    const { unmount } = render(<FilePage />);
    unmount();

    render(<FilePage />);

    // File should still be there with the new name (use getAllByText since there might be multiple instances)
    expect(await screen.findAllByText('renamed-document.pdf')).toHaveLength(2); // Header and FileViewer
  });
});
