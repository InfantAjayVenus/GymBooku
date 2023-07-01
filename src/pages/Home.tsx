import { Add } from "@mui/icons-material";
import {
    Box,
    Container,
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
import GymBookuIcon from "src/components/GymBookuIcon";
import Puller from "src/components/Puller";
import StreakCard from "src/components/StreakCard";
import WorkoutTrackCard, { WorkoutTrackCardProps } from "src/components/WorkoutTrackCard";
import useDrawer from "src/hooks/useDrawer";
import { StreakData } from "src/models/StreakData";
import { Workout } from "src/models/Workout";
import { PairedTrackRecord } from "src/models/WorkoutRecord";

type onAddType = WorkoutTrackCardProps['onSave'];

interface HomeProps {
    allWorkoutsList: Workout[];
    streakData: StreakData;
    trackedWorkoutData: PairedTrackRecord[];
    onAdd?: onAddType;
    onUpdate: onAddType;
    onAddTrackedWorkout: (workout: Workout) => void
}

function Home({ allWorkoutsList, streakData, trackedWorkoutData, onUpdate, onAddTrackedWorkout }: HomeProps) {
    const workoutListDrawer = useDrawer();
    const workoutsNotTrackedToday = allWorkoutsList.filter(item => !trackedWorkoutData?.some(trackedItem => trackedItem.today.workout === item.id));
    return (
        <>
            <Stack padding={4} spacing={2}>
                <Stack direction={'row'}>
                    <GymBookuIcon />
                    <Typography variant="h5" fontWeight={'bold'} component={'h3'}>GymBooku</Typography>
                </Stack>
                <StreakCard {...streakData} />
                <Typography variant="body1" fontWeight={'bold'}>Today's Workouts</Typography>
                {trackedWorkoutData.length > 0 && (
                    <List>
                        {trackedWorkoutData.map(trackedItem => {
                            const workoutItem = allWorkoutsList.find(({ id }) => id === trackedItem.today.workout);
                            return (
                                    workoutItem && 
                                    <ListItem key={trackedItem.today.id as Key} sx={{
                                        padding: 0,
                                        marginY: '1rem'
                                    }}>
                                        <WorkoutTrackCard
                                            workout={workoutItem}
                                            previousTrackedData={trackedItem.previous}
                                            trackedData={trackedItem.today}
                                            onSave={(savedWorkout) => {
                                                onUpdate(savedWorkout);
                                            }}
                                        />
                                    </ListItem>
                            )
                        })}
                    </List>
                )}
                {trackedWorkoutData.length === 0 && (
                    <Container sx={{ textAlign: 'center' }}>
                        <Typography variant="h4">🤷</Typography>
                        <Typography variant="body1">There's no workout planned for today</Typography>
                        <Typography variant="body2" color={'GrayText'}>Add a workout to keep the streak alive</Typography>
                    </Container>
                )}
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

                    {workoutsNotTrackedToday.length > 0 && (
                        <List>
                            {workoutsNotTrackedToday.map(workoutItem => (
                                <ListItem key={workoutItem.id as Key}>
                                    <ListItemButton sx={{
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
                    )}
                    {workoutsNotTrackedToday.length === 0 && (
                        <Container sx={{
                            textAlign: 'center',
                            padding: '2rem 0'
                        }}>
                            <Typography variant="h3">😎</Typography>
                            <Typography variant="body1">Cool! You've managed to do all the workouts</Typography>
                            <Typography variant="body2" color={'ActiveCaption'}>Add More Workouts to burn more calories</Typography>
                        </Container>
                    )}
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