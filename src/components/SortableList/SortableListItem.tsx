import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragIndicatorOutlined } from '@mui/icons-material';
import { Box, Icon, ListItem, SxProps, Theme } from "@mui/material";

interface SortableListItemProps {
    id: string;
    children: React.ReactNode;
    sx?: SxProps<Theme>
}

export default function SortableListItem({ id, sx, children }: SortableListItemProps) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id } as any);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <ListItem
            ref={setNodeRef} style={style} {...attributes}
            sx={sx}
        >
            {children}
            <Box sx={{ display: 'flex', alignItems: 'center', px: '1rem', '&:hover': { cursor: 'grab' }, '&:active': { cursor: 'grabbing' } }} {...listeners}>
                <Icon sx={{ float: 'right' }}><DragIndicatorOutlined /></Icon>
            </Box>
        </ListItem>
    )
}