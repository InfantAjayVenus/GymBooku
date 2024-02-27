import { Add, ArrowDropDown, CheckCircleOutline, FitnessCenterRounded } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Fab,
    List,
    ListItemButton,
    Popover,
    Stack,
    Typography
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import GymBookuIcon from "src/components/GymBookuIcon";
import StreakCard from "src/components/StreakCard";
import useDrawer from "src/hooks/useDrawer";
import useStreakData from "src/hooks/useStreakData";
import { Workout } from "src/models/Workout";
import { PlanContext } from "src/providers/PlanProvider";
import { WorkoutContext } from "src/providers/WorkoutProvider";
import getToday from "src/utils/getEnumDay";
import WorkoutTrackerScreen from "./WorkoutTrackerScreen";
import { SessionContext } from "src/providers/SessionProvider";
import { SortableListContainer, SortableListItem } from "src/components/SortableList";
import { WorkoutSession } from "src/models/WorkoutSession";

interface HomeProps { };

function Home({ }: HomeProps) {
    const { currentSession, addSession, updateSession } = useContext(SessionContext);
    const { workoutsList, updateWorkout: onUpdate } = useContext(WorkoutContext);
    const { plansList } = useContext(PlanContext);
    const filterElementRef = useRef(null);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

    const [filteredPlanId, setFilteredPlanId] = useState('ALL');

    const filterPopup = useDrawer();
    const streakData = useStreakData(workoutsList);

    /**
     * TODO:
     * Change SessionWorkoutsList populator to preserve workout order
     */

    const sessionWorkoutsList = currentSession?.workouts?.map((workoutId) => {
        const workout = workoutsList.find(workoutItem => workoutItem.id === workoutId);
        return workout!;
    }, [] as Workout[]) || [];

    useEffect(() => {
        filterPopup.close();
    }, [filteredPlanId]);

    return (
        <>
            <Stack padding={4} spacing={2}>
                <Stack direction={'row'}>
                    <GymBookuIcon />
                    <Typography variant="h5" fontWeight={'bold'} component={'h3'}>GymBooku</Typography>
                </Stack>
                <StreakCard {...streakData} />
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" fontWeight={'bold'}>Today's Workouts</Typography>
                    <Chip
                        ref={filterElementRef}
                        size="small"
                        label={'All'}
                        deleteIcon={<ArrowDropDown />}
                        onDelete={() => {
                            filterPopup.toggle();
                        }}
                    />
                </Stack>
                <SortableListContainer
                    itemList={currentSession?.workouts || []}
                    updateOnDragEnd={(updatedWorkoutIds) => {
                        const updatedLatestSession = currentSession?.updateSessionByWorkout(updatedWorkoutIds);
                        updatedLatestSession && updateSession(updatedLatestSession);
                        /**
                         * TODO:
                         * Update the session with the changes
                         */
                    }}
                >
                    {sessionWorkoutsList.map((workoutItem, index) => {
                        if (!workoutItem) return;
                        return (
                            <SortableListItem
                                key={workoutItem.id as React.Key}
                                id={workoutItem.id as string}
                                index={index}
                            >
                                <Stack
                                    py='0.5rem'
                                    direction={'row'}
                                    justifyContent={'space-between'}
                                    width={'100%'}
                                    onClick={() => setSelectedWorkout(workoutItem)}
                                >
                                    <Typography
                                        variant="body1"
                                        color={!!workoutItem.getTodayTrackedData() ? 'text.disabled' : ''}
                                    >
                                        {workoutItem.name}
                                    </Typography>
                                    {!!workoutItem.getTodayTrackedData() && <CheckCircleOutline color="disabled" />}
                                </Stack>
                            </SortableListItem>
                        );
                    })}
                </SortableListContainer>
                <Button
                    startIcon={<FitnessCenterRounded />}
                    variant="contained"
                    onClick={() => {
                        const newSession = WorkoutSession.getSession(plansList);
                        addSession(newSession);
                    }}
                >
                    Start Workout Session
                </Button>
            </Stack>
            <WorkoutTrackerScreen
                selectedWorkout={selectedWorkout}
                onSave={(updatedWorkoutTrackCollection) => {
                    if (!selectedWorkout) return;
                    if (updatedWorkoutTrackCollection?.trackedData.some(item => !item.hasAllRequiredValues(selectedWorkout.trackingValues))) return;
                    updatedWorkoutTrackCollection && selectedWorkout.workoutTrackData.push(updatedWorkoutTrackCollection);
                    onUpdate(Workout.copyFrom(selectedWorkout));
                }}
                onDelete={(deletedWorkoutTrackCollection) => {
                    if (!selectedWorkout) return;
                    if (!selectedWorkout.workoutTrackData.find(({ id }) => id === deletedWorkoutTrackCollection?.id)) return;
                    selectedWorkout.workoutTrackData = selectedWorkout.workoutTrackData.filter(({ id }) => id !== deletedWorkoutTrackCollection?.id);
                    onUpdate(Workout.copyFrom(Workout.copyFrom(selectedWorkout)));
                }}
                onClose={() => setSelectedWorkout(null)}
            />
<Box sx={{ position: "fixed", bottom: '4rem', right: '1rem' }}>
                <Fab size="medium" color="primary" aria-label="add workout"
                    onClick={() => {
                        const newSession = WorkoutSession.getSession(plansList);
                        addSession(newSession);
                    }}
                >
                    <Add />
                </Fab>
            </Box>
            <Popover
                open={filterPopup.isOpen as boolean}
                anchorEl={filterElementRef.current}
                onClose={() => {
                    filterPopup.close();
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <List>
                    <ListItemButton key="all" onClick={() => setFilteredPlanId('ALL')}>All</ListItemButton>
                    {plansList.filter((item) => item.hasDay(getToday())).map((planItem) => {
                        return (
                            <ListItemButton key={planItem.id as string} onClick={() => setFilteredPlanId(planItem.id as string)}>
                                {planItem.name}
                            </ListItemButton>
                        )
                    })}
                </List>
            </Popover>
        </>
    );
}

export default Home;