import {
    List,
    ListItem,
    Stack,
    Typography
} from "@mui/material";
import { Key, useState } from "react";
import GymBookuIcon from "src/components/GymBookuIcon";
import StreakCard from "src/components/StreakCard";
import { WorkoutFormProps } from "src/components/WorkoutForm";
import usePlannedWorkoutsList from "src/hooks/usePlannedWorkoutsList";
import useStreakData from "src/hooks/useStreakData";
import { Plan } from "src/models/Plan";
import { Workout } from "src/models/Workout";
import WorkoutTrackerScreen from "./WorkoutTrackerScreen";
import { CheckCircleOutline } from "@mui/icons-material";

type onAddType = WorkoutFormProps['onSave'];

interface HomeProps {
    workoutsList: Workout[];
    plansList: Plan[];
    onAdd?: onAddType;
    onUpdate: onAddType;
    onDelete?: onAddType;
}

function Home({ workoutsList, plansList, onUpdate }: HomeProps) {
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

    const streakData = useStreakData(workoutsList);
    const plannedWorkouts = usePlannedWorkoutsList(workoutsList, plansList);

    return (
        <>
            <Stack padding={4} spacing={2}>
                <Stack direction={'row'}>
                    <GymBookuIcon />
                    <Typography variant="h5" fontWeight={'bold'} component={'h3'}>GymBooku</Typography>
                </Stack>
                <StreakCard {...streakData} />
                <Typography variant="body1" fontWeight={'bold'}>Today's Workouts</Typography>

                <List>
                    {plannedWorkouts.map((workoutItem) => {
                        return (
                            <ListItem
                                key={workoutItem.id as Key}
                                sx={{
                                    py: '1rem',
                                    borderBottom: '1px gray solid'
                                }}
                                onClick={() => setSelectedWorkout(workoutItem)}
                            >
                                <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
                                    <Typography variant="body1" color={!!workoutItem.getTodayTrackedData() ? 'text.disabled' : ''}>{workoutItem.name}</Typography>
                                    {!!workoutItem.getTodayTrackedData() && <CheckCircleOutline color="disabled" />}
                                </Stack>
                            </ListItem>
                        )
                    }).filter((element): element is JSX.Element => !!element)}
                </List>
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
        </>
    );
}

export default Home;