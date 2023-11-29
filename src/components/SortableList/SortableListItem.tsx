import { DragIndicatorOutlined } from "@mui/icons-material";
import { Box, Icon, ListItem, SxProps, Theme } from "@mui/material";
import { Draggable } from "@hello-pangea/dnd";

interface SortableListItemProps {
    id: string;
    index: number,
    children: React.ReactNode;
    sx?: SxProps<Theme>
}

export default function SortableListItem({ id, index, sx, children }: SortableListItemProps) {
    return (
        <Draggable draggableId={id} index={index}>
            {(providedDraggable, snapshotDraggable) => (
                <ListItem
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    sx={{
                        ...sx,
                        elevation: snapshotDraggable.isDragging ? 3 : 1
                    }}
                >
                    {children}
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', px: '1rem', '&:hover': { cursor: 'grab' }, '&:active': { cursor: 'grabbing' } }}
                        {...providedDraggable.dragHandleProps}
                    >
                        <Icon sx={{ float: 'right' }}><DragIndicatorOutlined /></Icon>
                    </Box>
                </ListItem>
            )}
        </Draggable>
    )
}