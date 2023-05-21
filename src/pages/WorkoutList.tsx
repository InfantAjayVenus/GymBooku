import { Add, DeleteOutline, EditOutlined, MoreVert } from '@mui/icons-material';
import {
    Box,
    Divider,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    SwipeableDrawer,
    Typography
} from "@mui/material";
import { Key, useState } from "react";
import Puller from "src/components/Puller";
import WorkoutForm, { WorkoutFormProps } from "src/components/WorkoutForm";
import useDrawer from "src/hooks/useDrawer";
import { TRACKING_VALUES_ICON, Workout } from "src/models/Workout";
import { ID } from "src/utils/getRandomId";

type onAddType = WorkoutFormProps['onSave']

interface WorkoutListProps {
    values: Workout[];
    onAdd: onAddType,
    onUpdate: onAddType,
    onDelete: onAddType,
}

export function WorkoutList({ values, onAdd, onDelete, onUpdate }: WorkoutListProps) {
    const bottomDrawer = useDrawer();
    const menuPopover = useDrawer();
    const [focussedValueId, setFocussedValueId] = useState<ID | null>(null);
    const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null);
    const [updateWorkout, setUpdateWorkout] = useState<Workout | null>(null);

    const onCloseMenu = () => {
        menuPopover.close();
        setMenuAnchorElement(null);
        setFocussedValueId(null);
    }

    return (
        <>
            <Stack padding={4} spacing={2}>
                <Typography variant="h5" fontWeight={'bold'} component={'h3'}>Workout List</Typography>
                <List>
                    {values.map((valueItem) => (
                        <>
                            <ListItem
                                key={valueItem.id as Key}
                                sx={{ padding: '0' }}
                                secondaryAction={
                                    <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={menuPopover.isOpen ? 'long-menu' : undefined}
                                        aria-expanded={menuPopover.isOpen ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={(event) => {
                                            setMenuAnchorElement(event.currentTarget);
                                            setFocussedValueId(valueItem.id);
                                            menuPopover.open();
                                        }}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={valueItem.name}
                                    secondary={<>{valueItem.trackingValues.map(trackingItem => TRACKING_VALUES_ICON[trackingItem]())}</>}
                                />
                            </ListItem>
                            <Divider variant="middle" />
                        </>
                    ))}
                </List>
            </Stack>
            <Box sx={{ position: "fixed", bottom: '1rem', right: '1rem' }}>
                <Fab size="medium" color="primary" aria-label="add workout"
                    onClick={() => {
                        bottomDrawer.open();
                    }}
                >
                    <Add />
                </Fab>
            </Box>
            <SwipeableDrawer
                anchor="bottom"
                open={bottomDrawer.isOpen as boolean}
                onOpen={() => {
                    bottomDrawer.open();
                }}
                onClose={() => {
                    setUpdateWorkout(null);
                    bottomDrawer.close();
                }}
            >
                <Puller />
                <WorkoutForm
                    {...{ workoutData: updateWorkout || undefined}}
                    onSave={(savedWorkout) => {
                        if(updateWorkout) {
                            onUpdate(savedWorkout);
                            setUpdateWorkout(null);
                        }else {
                            onAdd(savedWorkout);
                        }
                        bottomDrawer.close();
                    }} />
            </SwipeableDrawer>
            <Menu
                id="basic-menu"
                sx={{
                    width: '100%'
                }}
                anchorEl={menuAnchorElement}
                open={menuPopover.isOpen as boolean}
                onClose={onCloseMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem key={1} sx={{ justifyContent: 'space-between', width: '100%' }}
                    onClick={() => {
                        setUpdateWorkout(values.find(({id}) => id === focussedValueId) || null);
                        bottomDrawer.open();
                        onCloseMenu();
                    }}>
                    <ListItemText>Edit</ListItemText>
                    <ListItemIcon sx={{ justifyContent: 'right' }}>
                        <EditOutlined fontSize="small" />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem key={2} sx={{ justifyContent: 'space-between', width: '100%' }}
                    onClick={() => {
                        const deletedWorkout = values.find(({ id }) => id === focussedValueId);
                        deletedWorkout && onDelete(deletedWorkout);
                        onCloseMenu();
                    }}
                >
                    <ListItemText>
                        <Typography color={'tomato'}>Delete</Typography>
                    </ListItemText>
                    <ListItemIcon sx={{ justifyContent: 'right' }}>
                        <DeleteOutline color="error" fontSize="small" />
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </>
    );
}
