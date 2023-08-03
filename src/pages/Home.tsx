import { Close } from "@mui/icons-material";
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grow,
    IconButton,
    List,
    ListItem,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import { Key, useEffect, useState } from "react";
import GymBookuIcon from "src/components/GymBookuIcon";
import StreakCard from "src/components/StreakCard";
import { WorkoutFormProps } from "src/components/WorkoutForm";
import WorkoutTrackCard from "src/components/WorkoutTrackCard";
import useDrawer from "src/hooks/useDrawer";
import usePlannedWorkoutsList from "src/hooks/usePlannedWorkoutsList";
import useStreakData from "src/hooks/useStreakData";
import { Plan } from "src/models/Plan";
import { Workout } from "src/models/Workout";
import { WorkoutTrackCollection } from "src/models/WorkoutRecord";

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
    const [workoutTrackCollection, setWorkoutTrackCollection] = useState<WorkoutTrackCollection | null>(null);

    const workoutTrackPage = useDrawer();
    const streakData = useStreakData(workoutsList);
    const plannedWorkouts = usePlannedWorkoutsList(workoutsList, plansList);


    useEffect(() => {
        if (!selectedWorkout) return;

        workoutTrackPage.open();
    }, [selectedWorkout]);

    useEffect(() => {
        if (workoutTrackPage.isOpen) return;

        setSelectedWorkout(null);
    }, [workoutTrackPage.isOpen])

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
                                <Typography variant="body1">{workoutItem.name}</Typography>
                            </ListItem>
                        )
                    }).filter((element): element is JSX.Element => !!element)}
                </List>
            </Stack>
            <Dialog
                open={workoutTrackPage.isOpen as boolean}
                onClose={workoutTrackPage.close}
                fullScreen
                TransitionComponent={Grow}
                TransitionProps={{ timeout: 300 }}
            >
                {selectedWorkout && (
                    <>
                        <DialogTitle>
                            <Toolbar>
                                <Typography sx={{ flex: 1 }} variant="h6" component="div">
                                    Workout Details
                                </Typography>
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={workoutTrackPage.close}
                                    aria-label="close"
                                >
                                    <Close />
                                </IconButton>
                            </Toolbar>
                        </DialogTitle>
                        <DialogContent>
                            <WorkoutTrackCard
                                workout={selectedWorkout}
                                trackedData={
                                    selectedWorkout.getTodayTrackedData()
                                }
                                onSave={(updatedWorkoutTrackCollection) => {
                                    if (!updatedWorkoutTrackCollection?.trackedData.every(
                                        item => item.hasAllRequiredValues(selectedWorkout.trackingValues)
                                    )) return;

                                    setWorkoutTrackCollection(updatedWorkoutTrackCollection);
                                }}
                            />
                            {selectedWorkout.getPreviouslyTrackedData() && (
                                <Container sx={{ mt: 2 }}>
                                    <Typography variant="h6">Previously Recorded</Typography>
                                    {selectedWorkout.getPreviouslyTrackedData()?.trackedData.map((trackedDataItem, index) => (
                                        <Stack direction={'row'} my={2} spacing={1} key={index}>
                                            <Typography variant="body1" fontWeight={'bold'}>Set {index + 1}: </Typography>
                                            <Typography variant="body2">{trackedDataItem.toString()}</Typography>
                                        </Stack>
                                    ))}
                                </Container>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button color="error" onClick={() => {
                                workoutTrackPage.close();
                                if (!selectedWorkout.workoutTrackData.find(({ id }) => id === workoutTrackCollection?.id)) return;
                                selectedWorkout.workoutTrackData = selectedWorkout.workoutTrackData.filter(({ id }) => id !== workoutTrackCollection?.id);
                                onUpdate(Workout.copyFrom(Workout.copyFrom(selectedWorkout)));
                            }}>
                                Delete
                            </Button>
                            <Button
                                color="primary"
                                disabled={!workoutTrackCollection?.trackedData.every(item => item.hasAllRequiredValues(selectedWorkout.trackingValues))}
                                onClick={() => {
                                    if (workoutTrackCollection?.trackedData.some(item => !item.hasAllRequiredValues(selectedWorkout.trackingValues))) return;
                                    workoutTrackCollection && selectedWorkout.workoutTrackData.push(workoutTrackCollection);
                                    onUpdate(Workout.copyFrom(selectedWorkout));
                                    workoutTrackPage.close();
                                }}>
                                save
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}

export default Home;