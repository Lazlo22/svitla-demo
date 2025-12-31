import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@test/test-utils';
import userEvent from '@testing-library/user-event';
import { FolderCard } from '@components/folders/FolderCard';
import type { IFolder } from '@type/folder';

const mockFolder: IFolder = {
  id: 'folder-1',
  name: 'Test Folder',
  parentId: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('FolderCard', () => {
  const defaultProps = {
    folder: mockFolder,
    onOpen: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onCreateSubfolder: vi.fn(),
  };

  it('renders folder name', async () => {
    render(<FolderCard {...defaultProps} />);

    expect(await screen.findByText('Test Folder')).toBeInTheDocument();
  });

  it('renders formatted date', async () => {
    render(<FolderCard {...defaultProps} />);

    const dateString = new Date(mockFolder.updatedAt).toLocaleDateString();
    expect(await screen.findByText(dateString)).toBeInTheDocument();
  });

  it('calls onOpen when folder name is clicked', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(<FolderCard {...defaultProps} onOpen={onOpen} />);

    await user.click(await screen.findByText('Test Folder'));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<FolderCard {...defaultProps} onEdit={onEdit} />);

    const editButton = await screen.findByTitle('Rename');
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<FolderCard {...defaultProps} onDelete={onDelete} />);

    const deleteButton = await screen.findByTitle('Delete');
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onCreateSubfolder when subfolder button is clicked', async () => {
    const user = userEvent.setup();
    const onCreateSubfolder = vi.fn();

    render(<FolderCard {...defaultProps} onCreateSubfolder={onCreateSubfolder} />);

    const subfolderButton = await screen.findByTitle('Create subfolder');
    await user.click(subfolderButton);

    expect(onCreateSubfolder).toHaveBeenCalledTimes(1);
  });

  it('stops event propagation on action buttons', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onEdit = vi.fn();

    render(<FolderCard {...defaultProps} onOpen={onOpen} onEdit={onEdit} />);

    const editButton = await screen.findByTitle('Rename');
    await user.click(editButton);

    // onOpen should not be called when clicking edit
    expect(onOpen).not.toHaveBeenCalled();
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
