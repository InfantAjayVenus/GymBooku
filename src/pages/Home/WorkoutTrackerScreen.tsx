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
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import WorkoutTrackCard from "src/components/WorkoutTrackCard";
import useDrawer from "src/hooks/useDrawer";
import { Workout } from "src/models/Workout";
import { WorkoutTrackCollection } from "src/models/WorkoutRecord";
import { ID } from "src/utils/getRandomId";

interface WorkoutTrackerScreenProps {
    selectedWorkout: Workout | null;
    onSave: (updatedWorkoutTrackCollection: WorkoutTrackCollection) => void;
    onClear: (deletedWorkoutTrackCollection: WorkoutTrackCollection) => void;
    onDelete: (deletedWorkoutId: ID) => void
    onClose: () => void;
}

export default function WorkoutTrackerScreen({ selectedWorkout, onSave, onClear, onDelete, onClose }: WorkoutTrackerScreenProps) {
    const workoutTrackPage = useDrawer();
    const [workoutTrackCollection, setWorkoutTrackCollection] = useState<WorkoutTrackCollection | null>(null);


    useEffect(() => {
        if (!selectedWorkout) return;

        workoutTrackPage.open();
    }, [selectedWorkout]);

    useEffect(() => {
        if (workoutTrackPage.isOpen) return;

        onClose();
    }, [workoutTrackPage.isOpen]);

    const graphData = selectedWorkout?.workoutTrackData
        .sort((item1, item2) => item1.timestamp.valueOf() - item2.timestamp.valueOf())
        .map(item => {
            const maxSet = item.trackedData.reduce((maxValue, currentValue) => {

                if (maxValue.weight && currentValue.weight) {
                    return maxValue.weight > currentValue.weight ? maxValue : currentValue;
                }

                if (maxValue.time && currentValue.time) {
                    return maxValue.time > currentValue.time ? maxValue : currentValue;
                }

                if (maxValue.count && currentValue.count) {
                    return maxValue.count > currentValue.count ? maxValue : currentValue;
                }



                return maxValue
            })
            return ({
                name: item.timestamp.toLocaleDateString('en-IN'),
                w: maxSet.weight,
                c: maxSet.count,
                t: maxSet.time
            })
        })

    return (
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
                            <>
                                <Container sx={{ mt: 2 }}>
                                    <Typography variant="h6">Previously Recorded</Typography>
                                    {selectedWorkout.getPreviouslyTrackedData()?.trackedData.map((trackedDataItem, index) => (
                                        <Stack direction={'row'} my={2} spacing={1} key={index}>
                                            <Typography variant="body1" fontWeight={'bold'}>Set {index + 1}: </Typography>
                                            <Typography variant="body2">{trackedDataItem.toString()}</Typography>
                                        </Stack>
                                    ))}
                                </Container>
                                <ResponsiveContainer>
                                    <LineChart
                                        data={graphData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="w" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="c" stroke="#82ca9d" />
                                        <Line type="monotone" dataKey="t" stroke="#22dbae" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Stack width={'100%'} paddingX={'32'} direction={'row'} justifyContent={'space-between'} >
                            <Button
                                color="error"
                                onClick={() => {
                                    if (!selectedWorkout) return;
                                    if(workoutTrackCollection) {
                                        onClear(workoutTrackCollection);
                                    }
                                    workoutTrackPage.close();
                                    onDelete(selectedWorkout.id);
                                }}
                            >
                                Delete
                            </Button>
                            <Stack direction={'row'}>
                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={() => {
                                        if (!workoutTrackCollection) return;
                                        onClear(workoutTrackCollection);
                                        workoutTrackPage.close();
                                    }}>
                                    Clear
                                </Button>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    disabled={!workoutTrackCollection?.trackedData.every(item => item.hasAllRequiredValues(selectedWorkout.trackingValues))}
                                    onClick={() => {
                                        if (!workoutTrackCollection) return;
                                        onSave(workoutTrackCollection);
                                        workoutTrackPage.close();
                                    }}>
                                    save
                                </Button>
                            </Stack>


                        </Stack>



                    </DialogActions>
                </>
            )}
        </Dialog>
    )
}