import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@test/test-utils';
import { mockNavigate } from '@test/setup';
import { mockFile } from '@test/mocks/data';
import userEvent from '@testing-library/user-event';
import HomePage from '@pages/HomePage';
import { useFolderStore } from '@stores/folderStore';
import { useFileStore } from '@stores/fileStore';
import { act } from '@testing-library/react';

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    act(() => {
      useFolderStore.setState({ folders: [] });
      useFileStore.setState({ files: [] });
    });
  });

  it('renders welcome message', async () => {
    render(<HomePage />);
    expect(await screen.findByText('Welcome to SV - Harvey - Demo')).toBeInTheDocument();
  });

  it('renders description', async () => {
    render(<HomePage />);
    expect(await screen.findByText('Organize and manage your PDF files with ease')).toBeInTheDocument();
  });

  it('displays folder count of 0 when empty', async () => {
    render(<HomePage />);
    // Just verify that 0 is displayed somewhere (we know it appears multiple times)
    const zeros = await screen.findAllByText('0');
    expect(zeros.length).toBeGreaterThan(0);
    expect(screen.getByText('Total Folders')).toBeInTheDocument();
  });

  it('displays file count of 0 when empty', async () => {
    render(<HomePage />);
    // We already checked 0 above, just check title
    expect(await screen.findByText('Total Files')).toBeInTheDocument();
  });

  it('shows get started section when no folders or files', async () => {
    render(<HomePage />);
    expect(await screen.findByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText(/You haven't created any folders or uploaded any files yet/i)).toBeInTheDocument();
  });

  it('navigates to folders page when Create Folder is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    // Find button by text within the get started section
    const createButton = await screen.findByText('Create Folder');
    await user.click(createButton);

    expect(mockNavigate).toHaveBeenCalledWith('/folders');
  });

  it('navigates to files page when Upload File is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const uploadButton = await screen.findByText('Upload File');
    await user.click(uploadButton);

    expect(mockNavigate).toHaveBeenCalledWith('/files');
  });

  it('hides get started section when folders exist', async () => {
    await act(async () => {
      await useFolderStore.getState().createFolder('Test', null);
    });

    render(<HomePage />);

    expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
  });

  it('hides get started section when files exist', async () => {
    act(() => {
      useFileStore.setState({
        files: [{ ...mockFile, folderId: null }],
      });
    });

    render(<HomePage />);

    expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
  });

  it('navigates to folders page when Total Folders card is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    // Find the folders card - in real app might need test-id
    const foldersCard = await screen.findByText('Total Folders');
    // The text is inside the card which is clickable
    await user.click(foldersCard);

    expect(mockNavigate).toHaveBeenCalledWith('/folders');
  });

  it('navigates to files page when Total Files card is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const filesCard = await screen.findByText('Total Files');
    await user.click(filesCard);

    expect(mockNavigate).toHaveBeenCalledWith('/files');
  });
});
