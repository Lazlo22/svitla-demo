import type { LucideIcon } from 'lucide-react';

import { Button } from '@ui/button';
import { useFileDrop } from '@hooks/use-file-drop';
import { cn } from '@lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionIcon?: LucideIcon;
  onAction: () => void;
  enableFileDrop?: boolean;
  onFileDrop?: (file: File) => void;
  onFileDropError?: (error: string) => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  enableFileDrop = false,
  onFileDrop,
  onFileDropError,
}: EmptyStateProps) {
  const { isDragging, dropRef } = useFileDrop({
    onDrop: (files) => onFileDrop?.(files[0]),
    accept: ['application/pdf'],
    onError: (error) => onFileDropError?.(error),
  });

  const content = (
    <>
      <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">
        {isDragging && enableFileDrop ? 'Drop PDF file here' : description}
      </p>
      <Button onClick={onAction}>
        {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
        {actionLabel}
      </Button>
    </>
  );

  if (enableFileDrop) {
    return (
      <div
        ref={dropRef}
        className={cn(
          "text-center py-12 border-2 border-dashed rounded-lg transition-colors",
          isDragging ? "border-primary bg-primary/5" : ""
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      {content}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';
