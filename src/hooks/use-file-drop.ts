import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

interface UseFileDropOptions {
  onDrop: (files: File[]) => void;
  accept?: string[];
  onError?: (error: string) => void;
}

interface UseFileDropReturn {
  isDragging: boolean;
  dropRef: (node: HTMLElement | null) => void;
}

export function useFileDrop({
  onDrop,
  accept = ['application/pdf'],
  onError,
}: UseFileDropOptions): UseFileDropReturn {
  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: NativeTypes.FILE,
      drop: (item: { files: File[] }) => {
        const files = item.files;

        if (files.length === 0) {
          onError?.('No files were dropped');
          return;
        }

        // Validate all file types
        const invalidFiles = files.filter(file => !accept.includes(file.type));
        if (invalidFiles.length > 0) {
          onError?.('Only PDF files are supported');
          return;
        }

        onDrop(files);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onDrop, accept, onError]
  );

  return {
    isDragging: isOver && canDrop,
    dropRef,
  };
}
