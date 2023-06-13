import { Add } from "@mui/icons-material";
import {
    Box,
    Fab,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Stack,
    SwipeableDrawer,
    Typography
} from "@mui/material";
import { Key } from "react";
import Puller from "src/components/Puller";
import StreakCard from "src/components/StreakCard";
import WorkoutTrackCard, { WorkoutTrackCardProps } from "src/components/WorkoutTrackCard";
import useDrawer from "src/hooks/useDrawer";
import { Workout } from "src/models/Workout";
import { WorkoutTrackCollection } from "src/models/WorkoutRecord";

type onAddType = WorkoutTrackCardProps['onSave'];

interface HomeProps {
    allWorkoutsList: Workout[];
    workoutsForDay: Workout[];
    trackedWorkoutData?: WorkoutTrackCollection[];
    onAdd?: onAddType;
    onUpdate: onAddType;
    onAddTrackedWorkout: (workout: Workout) => void
}

function Home({ allWorkoutsList, workoutsForDay, trackedWorkoutData, onUpdate, onAddTrackedWorkout }: HomeProps) {
    const workoutListDrawer = useDrawer();
    return (
        <>
            <Stack padding={4} spacing={2}>
                <Typography variant="h5" fontWeight={'bold'} component={'h3'}>Workout Tracker</Typography>
                <StreakCard />
                <Typography variant="body1" fontWeight={'bold'}>Today's Workouts</Typography>
                <List>
                    {workoutsForDay.map(workoutItem => (
                        <ListItem key={workoutItem.id as Key} sx={{
                            padding: 0,
                            marginY: '1rem'
                        }}>
                            <WorkoutTrackCard
                                workout={workoutItem}
                                trackedData={trackedWorkoutData?.find(item => item.workout.id === workoutItem.id)}
                                onSave={(savedWorkout) => {
                                    onUpdate(savedWorkout);
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Stack>
            <Box sx={{ position: "fixed", bottom: '4rem', right: '1rem' }}>
                <Fab size="medium" color="primary" aria-label="add workout"
                    onClick={() => {
                        workoutListDrawer.open();
                    }}
                >
                    <Add />
                </Fab>
            </Box>
            <SwipeableDrawer
                anchor="bottom"
                open={workoutListDrawer.isOpen as boolean}
                onOpen={() => {
                    workoutListDrawer.open();
                }}
                onClose={() => {
                    workoutListDrawer.close();
                }}
            >
                <Puller />
                <Stack padding={'1rem'} mt={'1rem'}>
                    <Typography variant="body1" fontWeight={'bold'}>Add Workout for Tracking</Typography>
                    <List>
                        {allWorkoutsList.filter(item => !workoutsForDay.some(dayItem => dayItem.id === item.id)).map(workoutItem => (
                            <ListItem>
                                <ListItemButton key={workoutItem.id as Key} sx={{
                                    padding: 0,
                                    marginY: '1rem',
                                }}
                                onClick={() => {
                                    onAddTrackedWorkout(workoutItem);
                                    workoutListDrawer.close();
                                }}
                                >
                                    <ListItemText primary={workoutItem.name} />

                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Stack>
            </SwipeableDrawer>
            {/* Todo:
                Card:
                    1. Current Streak
                    2. Longest Streak
                    3. Perfect Week
                Today's Workouts:
                    Workout[]: Accordian */}
        </>
    );
}

export default Home;