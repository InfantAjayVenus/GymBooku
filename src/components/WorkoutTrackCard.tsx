import { Add, RemoveCircleOutline } from '@mui/icons-material';
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    ClickAwayListener,
    Collapse,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import { useEffect, useState } from 'react';
import useDrawer from "src/hooks/useDrawer";
import { Workout } from "src/models/Workout";
import { WorkoutTrackCollection, WorkoutTrackRecord } from 'src/models/WorkoutRecord';
import SetTrackCard from './SetTrackCard';

export interface WorkoutTrackCardProps {
    workout: Workout;
    trackedData?: WorkoutTrackCollection;
    onSave: (savedWorkoutTrackCollection: WorkoutTrackCollection) => void;
}

function WorkoutTrackCard({ workout, trackedData, onSave }: WorkoutTrackCardProps) {
    const trackingFormCollapse = useDrawer(!workout.getPreviouslyTrackedData());
    const [workoutTrackCollection, setWorkoutTrackCollection] = useState<WorkoutTrackCollection>();

    useEffect(() => {
        !workoutTrackCollection && setWorkoutTrackCollection(trackedData || new WorkoutTrackCollection(workout.id));
    }, [trackedData]);

    useEffect(() => {
        workoutTrackCollection && onSave(workoutTrackCollection);
    }, [workoutTrackCollection]);

    return (
        <ClickAwayListener onClickAway={() => {
            trackingFormCollapse.close();
        }}>
            <Card variant="outlined" sx={{
                width: '100%',
            }}
            >
                <CardHeader title={<Typography variant='h6'>{workout.name}</Typography>} onClick={trackingFormCollapse.toggle}/>
                <Collapse in={trackingFormCollapse.isOpen as boolean} unmountOnExit>
                    <Paper
                        sx={{
                            padding: '1rem',
                        }}
                    >
                        <Box>
                            {workoutTrackCollection?.trackedData.map((value, index) => (
                                <SetTrackCard
                                    key={index}
                                    index={index}
                                    trackingValues={workout.trackingValues}
                                    onUpdate={(updatedTrackData, index) => {
                                        workoutTrackCollection.trackedData[index] = updatedTrackData;
                                        setWorkoutTrackCollection(
                                            new WorkoutTrackCollection(
                                                workoutTrackCollection.workout,
                                                workoutTrackCollection.trackedData,
                                                workoutTrackCollection.id
                                            )
                                        );
                                    }}
                                    initialValues={value}
                                />
                            ))}
                            <Stack direction={'column'} padding={'1rem 0'} alignItems={'center'} spacing={'0.5rem'}>
                                <ButtonGroup variant="outlined" aria-label="outlined button group">
                                    <Button startIcon={<Add />} size='small'
                                        onClick={() => {
                                            setWorkoutTrackCollection(
                                                new WorkoutTrackCollection(
                                                    workoutTrackCollection?.workout || workout.id,
                                                    [...(workoutTrackCollection?.trackedData || []), new WorkoutTrackRecord()],
                                                    workoutTrackCollection?.id
                                                )
                                            );
                                        }}
                                        disabled={
                                            workoutTrackCollection?.trackedData.some(
                                                (trackedItem) => !trackedItem.hasAllRequiredValues(workout.trackingValues)
                                            )
                                        }
                                    >
                                        Add Set
                                    </Button>
                                    <Button startIcon={<RemoveCircleOutline />} size='small'
                                        onClick={() => {
                                            workoutTrackCollection?.trackedData.pop();
                                            setWorkoutTrackCollection(
                                                new WorkoutTrackCollection(
                                                    workoutTrackCollection?.workout || workout.id,
                                                    [...(workoutTrackCollection?.trackedData || [])],
                                                    workoutTrackCollection?.id
                                                )
                                            );
                                        }}
                                        disabled={
                                            workoutTrackCollection?.trackedData && (workoutTrackCollection?.trackedData.length < 2)
                                        }
                                    >
                                        Remove Set
                                    </Button >
                                </ButtonGroup>

                            </Stack>
                        </Box>
                    </Paper>
                </Collapse>
            </Card>
        </ClickAwayListener>
    )
}

export default WorkoutTrackCard