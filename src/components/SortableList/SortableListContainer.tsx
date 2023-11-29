import { List, SxProps, Theme } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import reorderList from "src/utils/reorderList";

interface SortableListContainerProps<T> {
  itemList: T[];
  children: ReactNode[];
  updateOnDragEnd: (result: T[]) => void;
  sx?: SxProps<Theme>;
}

export default function SortableListContainer<T>({ children, sx, itemList, updateOnDragEnd }: SortableListContainerProps<T>) {

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (!result.destination) {
          return;
        }

        if (result.destination.index === result.source.index) {
          return;
        }

        const items = reorderList(
          itemList,
          result.source.index,
          result.destination.index
        );

        updateOnDragEnd(items);
      }}>
      <Droppable droppableId="droppable">
        {provided => (
          <List sx={sx} {...provided.droppableProps} ref={provided.innerRef}>
            {children}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}
