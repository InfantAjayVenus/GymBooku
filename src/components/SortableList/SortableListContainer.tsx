import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { List } from "@mui/material";

interface SortableListContainerProps {
    idList: string[];
    children: React.ReactNode[];
    handleDragEnd: (event: DragEndEvent) => void;
}

export default function SortableListContainer({children, idList, handleDragEnd}: SortableListContainerProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
      );

    return (
        <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={idList}
        strategy={verticalListSortingStrategy}
      >
        <List>{children}</List>
      </SortableContext>
    </DndContext>
        
    );
}
