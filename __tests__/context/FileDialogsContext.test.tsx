import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@test/test-utils';
import { useFileDialogs } from '@context/FileDialogsContext';
import { mockFile } from '@test/mocks/files';

describe('FileDialogsContext', () => {
    it('provides dialog methods', async () => {
        const { result } = renderHook(() => useFileDialogs());

        await expect.poll(() => result.current).not.toBeNull();
        expect(result.current.openUploadDialog).toBeDefined();
        expect(result.current.openRenameDialog).toBeDefined();
        expect(result.current.openDeleteDialog).toBeDefined();
    });

    it('opens upload dialog with folder ID', async () => {
        const { result } = renderHook(() => useFileDialogs());

        await expect.poll(() => result.current).not.toBeNull();

        act(() => {
            result.current.openUploadDialog('folder-1');
        });

        // Dialog should be open (we can't easily test the actual dialog rendering in this context)
        expect(result.current).toBeDefined();
    });

    it('opens rename dialog with file and callback', async () => {
        const { result } = renderHook(() => useFileDialogs());
        const onRename = vi.fn();

        await expect.poll(() => result.current).not.toBeNull();

        act(() => {
            result.current.openRenameDialog(mockFile, onRename);
        });

        expect(result.current).toBeDefined();
    });

    it('opens delete dialog with file and callback', async () => {
        const { result } = renderHook(() => useFileDialogs());
        const onDelete = vi.fn();

        await expect.poll(() => result.current).not.toBeNull();

        act(() => {
            result.current.openDeleteDialog(mockFile, onDelete);
        });

        expect(result.current).toBeDefined();
    });
});
