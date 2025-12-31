import type { ReactElement, ReactNode } from 'react';
import { Suspense } from 'react';
import {
  render,
  renderHook,
  type RenderOptions,
  type RenderHookOptions,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FileDialogsProvider } from '@context/FileDialogsContext';
import { FolderDialogsProvider } from '@context/FolderDialogsContext';

interface WrapperProps {
  children: ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <Suspense>
          <FileDialogsProvider>
            <FolderDialogsProvider>
              {children}
            </FolderDialogsProvider>
          </FileDialogsProvider>
        </Suspense>
      </DndProvider>
    </BrowserRouter>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

function customRenderHook<Result, Props>(
  hook: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'>
) {
  return renderHook(hook, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook };
