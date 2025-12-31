import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@test/test-utils';
import { useFolderDialogs } from '@context/FolderDialogsContext';
import { mockFolder } from '@test/mocks/folders';

describe('FolderDialogsContext', () => {
    it('provides dialog methods', async () => {
        const { result } = renderHook(() => useFolderDialogs());

        await expect.poll(() => result.current).not.toBeNull();
        expect(result.current.openCreateDialog).toBeDefined();
        expect(result.current.openEditDialog).toBeDefined();
        expect(result.current.openDeleteDialog).toBeDefined();
    });

    it('opens create dialog with parent folder and callback', async () => {
        const { result } = renderHook(() => useFolderDialogs());
        const onCreate = vi.fn();

        await expect.poll(() => result.current).not.toBeNull();

        act(() => {
            result.current.openCreateDialog(mockFolder, onCreate);
        });

        expect(result.current).toBeDefined();
    });

    it('opens create dialog without parent (root level)', async () => {
        const { result } = renderHook(() => useFolderDialogs());
        const onCreate = vi.fn();

        await expect.poll(() => result.current).not.toBeNull();

        act(() => {
            result.current.openCreateDialog(null, onCreate);
        });

        expect(result.current).toBeDefined();
    });

    it('opens edit dialog with folder and callback', async () => {
        const { result } = renderHook(() => useFolderDialogs());
        const onEdit = vi.fn();

        await expect.poll(() => result.current).not.toBeNull();

        act(() => {
            result.current.openEditDialog(mockFolder, onEdit);
        });

        expect(result.current).toBeDefined();
    });

    it('opens delete dialog with folder and callback', async () => {
        const { result } = renderHook(() => useFolderDialogs());
        const onDelete = vi.fn();

        await expect.poll(() => result.current).not.toBeNull();

        act(() => {
            result.current.openDeleteDialog(mockFolder, onDelete);
        });

        expect(result.current).toBeDefined();
    });
});
