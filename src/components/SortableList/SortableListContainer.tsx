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
import { List, SxProps, Theme } from "@mui/material";

interface SortableListContainerProps {
    idList: string[];
    children: React.ReactNode[];
    handleDragEnd: (event: DragEndEvent) => void;
    sx?: SxProps<Theme>;
}

export default function SortableListContainer({children, idList, sx, handleDragEnd}: SortableListContainerProps) {
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
        <List sx={sx}>{children}</List>
      </SortableContext>
    </DndContext>
        
    );
}
