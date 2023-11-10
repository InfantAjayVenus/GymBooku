import { Add, DeleteOutline, EditOutlined, MoreVert } from "@mui/icons-material";
import {
    Box,
    Chip,
    Container,
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
import { Fragment, Key, useContext, useState } from "react";
import PlanForm from "src/components/PlanForm";
import Puller from "src/components/Puller";
import useDrawer from "src/hooks/useDrawer";
import { Plan } from "src/models/Plan";
import { PlanContext } from "src/providers/PlanProvider";
import { WorkoutContext } from "src/providers/WorkoutProvider";
import { ID } from "src/utils/getRandomId";


interface WorkoutPlannerProps {
}

function WorkoutPlanner({ }: WorkoutPlannerProps) {
    const { plansList, addPlan, updatePlan, deletePlan } = useContext(PlanContext);
    const { workoutsList } = useContext(WorkoutContext);
    const formDrawer = useDrawer();
    const menuPopover = useDrawer();
    const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement | null>(null);
    const [currentPlanId, setCurrentPlanId] = useState<ID | null>(null);
    const [currentPlanData, setCurrentPlanData] = useState<Plan | null>(null);

    const onCloseMenu = () => {
        menuPopover.close();
        setMenuAnchorElement(null);
        // setFocussedValueId(null);
    }

    return (
        <>
            <Stack padding={4} spacing={2} position={'relative'}>
                <Typography variant="h5" fontWeight={'bold'} component={'h3'}>Workout Plans</Typography>
                {plansList.length > 0 && (
                    <List>
                        {plansList.map((planItem) => (
                            <Fragment key={planItem.id as Key}>
                                <ListItem
                                    key={planItem.id as Key}
                                    sx={{
                                        paddingLeft: '0',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        textAlign: 'left'
                                    }}
                                    secondaryAction={
                                        <IconButton
                                            aria-label="more"
                                            id="long-button"
                                            aria-controls={menuPopover.isOpen ? 'long-menu' : undefined}
                                            aria-expanded={menuPopover.isOpen ? 'true' : undefined}
                                            aria-haspopup="true"
                                            onClick={(event) => {
                                                setCurrentPlanId(planItem.id);
                                                setMenuAnchorElement(event.currentTarget);
                                                menuPopover.open();
                                            }}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={(
                                            <Typography variant="h6">{planItem.name}</Typography>
                                        )}
                                    />
                                    <Stack>
                                        <Typography variant="body1">
                                            {
                                                planItem.workoutsList
                                                    .map((workoutItem) => (workoutsList.find(({ id }) => workoutItem === id))?.name || false)
                                                    .filter(name => !!name).join(' / ')
                                            }
                                        </Typography>
                                        <Container component={'div'} sx={{
                                            flexDirection: 'row',
                                            alignContent: 'space-around',
                                            padding: '0.3rem 0 !important',
                                        }}>
                                            {planItem.daysList.map((day, index) => (
                                                <Chip
                                                    key={index}
                                                    label={day.slice(0, 3)}
                                                    sx={{
                                                        marginRight: '0.3rem',
                                                        marginBottom: '0.3rem',
                                                    }}
                                                />
                                            ))}
                                        </Container>
                                    </Stack>
                                </ListItem>
                                <Divider />
                            </Fragment>
                        ))}
                    </List>
                )}
                {plansList.length === 0 && (
                    <Container sx={{ textAlign: 'center', mt: '8rem !important' }}>
                        <Typography variant="h4">🤷</Typography>
                        <Typography variant="body1">You haven't planned for any workouts yet</Typography>
                        <Typography variant="body2" color={'GrayText'}>Create workout plans and make your workout routine effective 💪.</Typography>
                    </Container>
                )}
            </Stack>
            <Box sx={{ position: "fixed", bottom: '4rem', right: '1rem' }}>
                <Fab size="medium" color="primary" aria-label="add workout"
                    onClick={() => {
                        formDrawer.open();
                    }}
                >
                    <Add />
                </Fab>
            </Box>

            <SwipeableDrawer
                anchor="bottom"
                open={formDrawer.isOpen as boolean}
                onOpen={() => {
                    formDrawer.open();
                }}
                onClose={() => {
                    formDrawer.close();
                }}
            >
                <Puller />
                <PlanForm workoutsList={workoutsList}
                    {...{ planData: currentPlanData || undefined }}
                    onSave={(savedPlan) => {
                        if (currentPlanData) {
                            updatePlan(savedPlan);
                        } else {
                            addPlan(savedPlan);
                        }
                        formDrawer.close();
                    }}
                />
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
                        setCurrentPlanData(plansList.find(({ id }) => id === currentPlanId) || null);
                        formDrawer.open();
                        onCloseMenu();
                    }}>
                    <ListItemText>Edit</ListItemText>
                    <ListItemIcon sx={{ justifyContent: 'right' }}>
                        <EditOutlined fontSize="small" />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem key={2} sx={{ justifyContent: 'space-between', width: '100%' }}
                    onClick={() => {
                        const deletedPlan = plansList.find(({ id }) => id === currentPlanId);
                        deletedPlan && deletePlan(deletedPlan);
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

export default WorkoutPlanner;