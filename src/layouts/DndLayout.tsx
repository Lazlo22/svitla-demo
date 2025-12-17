import { Outlet } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function DndLayout() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Outlet />
    </DndProvider>
  );
}
