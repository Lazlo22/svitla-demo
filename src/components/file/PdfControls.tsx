import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '@ui/button';

interface PdfControlsProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function PdfControls({
  pageNumber,
  numPages,
  scale,
  onPreviousPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
}: PdfControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousPage}
          disabled={pageNumber <= 1}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {pageNumber} of {numPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextPage}
          disabled={pageNumber >= numPages}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          disabled={scale <= 0.5}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          disabled={scale >= 3.0}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

PdfControls.displayName = 'PdfControls';
