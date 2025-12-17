import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { PdfControls } from '@components/file/PdfControls';
import { PdfLoadingState } from '@components/file/PdfLoadingState';
import { PdfErrorState } from '@components/file/PdfErrorState';
import type { IFile } from '@type/file';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FileViewerProps {
  file: IFile;
  className?: string;
}

export function FileViewer({ file, className = '' }: FileViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <PdfControls
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        onPreviousPage={previousPage}
        onNextPage={nextPage}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />
      
      <div className="flex-1 overflow-auto bg-muted/30 flex items-start justify-center p-4">
        <Document
          file={file.content}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<PdfLoadingState />}
          error={<PdfErrorState />}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={<PdfLoadingState />}
          />
        </Document>
      </div>
    </div>
  );
}

FileViewer.displayName = 'FileViewer';
