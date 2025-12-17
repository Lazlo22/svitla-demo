import { LucideIcon } from 'lucide-react';

import { Button } from '@ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionIcon?: LucideIcon;
  onAction: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button onClick={onAction}>
        {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
        {actionLabel}
      </Button>
    </div>
  );
}

EmptyState.displayName = 'EmptyState';
