import { arrayMove } from "@dnd-kit/sortable";
import { ArrowDropDown, CheckCircleOutline } from "@mui/icons-material";
import {
    Chip,
    List,
    ListItemButton,
    Popover,
    Stack,
    Typography
} from "@mui/material";
import { Key, useContext, useEffect, useRef, useState } from "react";
import GymBookuIcon from "src/components/GymBookuIcon";
import { SortableListContainer, SortableListItem } from "src/components/SortableList";
import StreakCard from "src/components/StreakCard";
import useDrawer from "src/hooks/useDrawer";
import usePlannedWorkoutsList from "src/hooks/usePlannedWorkoutsList";
import useStreakData from "src/hooks/useStreakData";
import { Workout } from "src/models/Workout";
import { PlanContext } from "src/providers/PlanProvider";
import { WorkoutContext } from "src/providers/WorkoutProvider";
import getToday from "src/utils/getToday";
import WorkoutTrackerScreen from "./WorkoutTrackerScreen";

interface HomeProps {
}

function Home({}: HomeProps) {
    const {workoutsList, updateWorkout: onUpdate} = useContext(WorkoutContext);
    const {plansList} = useContext(PlanContext);
    const filterElementRef = useRef(null);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [filteredPlanId, setFilteredPlanId] = useState('ALL');
    const [workoutIndex, setWorkoutIndex] = useState([] as string[]);

    const filterPopup = useDrawer();
    const streakData = useStreakData(workoutsList);
    const plannedWorkouts = usePlannedWorkoutsList(
        workoutsList,
        filteredPlanId === 'ALL' ? plansList : plansList.filter(item => item.id === filteredPlanId)
    );

    useEffect(() => {
        setWorkoutIndex(new Array(plannedWorkouts.length).fill(0).map((_, index) => index.toString()));
    }, [plannedWorkouts]);

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
                    sx={{
                        pb: '2.5rem',
                    }}
                    idList={workoutIndex}
                    handleDragEnd={(event) => {
                        const { active, over } = event;
                        console.log('DEBUG:event', event);

                        if (active.id !== over?.id) {
                            const oldIndex = workoutIndex.findIndex((value) => value === active.id);
                            const newIndex = workoutIndex.findIndex((value) => value === over?.id);

                            setWorkoutIndex(arrayMove(workoutIndex, oldIndex, newIndex));
                        }

                    }}
                >
                    {workoutIndex.map((workoutItemIndex) => {
                        return (
                            <SortableListItem
                                key={workoutItemIndex as Key}
                                id={workoutItemIndex.toString()}
                                sx={{
                                    
                                    borderBottom: '1px gray solid'
                                }}
                            >
                                <Stack
                                    py='0.5rem'
                                    direction={'row'}
                                    justifyContent={'space-between'}
                                    width={'100%'}
                                    onClick={() => setSelectedWorkout(plannedWorkouts[Number(workoutItemIndex)])}
                                >
                                    <Typography
                                        variant="body1"
                                        color={!!plannedWorkouts[Number(workoutItemIndex)].getTodayTrackedData() ? 'text.disabled' : ''}
                                    >
                                        {plannedWorkouts[Number(workoutItemIndex)].name}
                                    </Typography>
                                    {!!plannedWorkouts[Number(workoutItemIndex)].getTodayTrackedData() && <CheckCircleOutline color="disabled" />}
                                </Stack>
                            </SortableListItem>
                        )
                    }).filter((element): element is JSX.Element => !!element)}
                </SortableListContainer>
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