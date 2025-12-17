interface PdfErrorStateProps {
  message?: string;
}

export function PdfErrorState({ message = 'Failed to load PDF' }: PdfErrorStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <p className="text-destructive">{message}</p>
    </div>
  );
}

PdfErrorState.displayName = 'PdfErrorState';
