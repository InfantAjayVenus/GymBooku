import { Add, EditOutlined, History, RemoveCircleOutline } from '@mui/icons-material';
import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    ClickAwayListener,
    Collapse,
    Container,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import { useEffect, useState } from 'react';
import useDrawer from "src/hooks/useDrawer";
import { Workout } from "src/models/Workout";
import { WorkoutTrackCollection, WorkoutTrackRecord } from 'src/models/WorkoutRecord';
import SetTrackCard from './SetTrackCard';
import TabPanel from './TabPanel';

export interface WorkoutTrackCardProps {
    workout: Workout;
    previousTrackedData?: WorkoutTrackCollection;
    trackedData: WorkoutTrackCollection;
    onSave: (savedWorkoutTrackCollection: WorkoutTrackCollection) => void;
}

function WorkoutTrackCard({ workout, trackedData, previousTrackedData, onSave }: WorkoutTrackCardProps) {
    const trackingFormCollapse = useDrawer();
    const [workoutTrackCollection, setWorkoutTrackCollection] = useState<WorkoutTrackCollection>();
    const [tabValue, setTabValue] = useState(2);

    useEffect(() => {
        setWorkoutTrackCollection(trackedData);
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
                <CardContent
                    onClick={trackingFormCollapse.toggle}
                >
                    <Typography>{workout.name}</Typography>
                </CardContent>
                <Collapse in={trackingFormCollapse.isOpen as boolean} unmountOnExit>
                    <Paper
                        sx={{
                            padding: '1rem',
                        }}
                    >
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={(_, value) => {
                                setTabValue(value);
                            }}>
                                <Tab value={1} label="Previously Tracked" icon={<History />} iconPosition='end' />
                                <Tab value={2} label="Today's Track" icon={<EditOutlined />} iconPosition='end' />
                            </Tabs>
                        </Box>
                        <Box>
                            <TabPanel
                                index={1}
                                value={tabValue}
                            >
                                {(previousTrackedData?.trackedData && previousTrackedData?.trackedData.length > 0) && (
                                    <>
                                        {previousTrackedData.trackedData.map((trackedValue, index) => (
                                            <Stack py={'0.5rem'} textAlign={'center'}>
                                                <Typography variant='body1' fontWeight={'bold'}>Set {index + 1}</Typography>
                                                <Typography variant='body2'>{trackedValue.toString()}</Typography>
                                            </Stack>
                                        ))}
                                    </>
                                )}
                                {(!previousTrackedData || previousTrackedData.trackedData.length === 0) && (
                                    <Container sx={{ textAlign: 'center' }}>
                                        <Typography variant='h3'>🤔</Typography>
                                        <Typography variant='body1'>I Don't think we've done this workout before</Typography>
                                        <Typography variant='body2' color='ActiveCaption'>Track today and I'll keep note of it for the next time</Typography>
                                    </Container>
                                )}
                            </TabPanel>
                            <TabPanel
                                index={2}
                                value={tabValue}
                            >
                                {workoutTrackCollection?.trackedData.map((value, index) => (
                                    <SetTrackCard
                                        key={index}
                                        index={index}
                                        trackingValues={workout.trackingValues}
                                        onUpdate={(updatedTrackData, index) => {
                                            workoutTrackCollection.trackedData[index] = updatedTrackData;
                                            setWorkoutTrackCollection(new WorkoutTrackCollection(workoutTrackCollection.workout, workoutTrackCollection.trackedData, workoutTrackCollection.id));
                                        }}
                                        initialValues={value}
                                    />
                                ))}
                                <Stack direction={'column'} padding={'1rem 0'} alignItems={'center'} spacing={'0.5rem'}>
                                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                                        <Button startIcon={<Add />} size='small'
                                            onClick={() => {
                                                setWorkoutTrackCollection(new WorkoutTrackCollection(workoutTrackCollection?.workout || workout.id, [...(workoutTrackCollection?.trackedData || []), new WorkoutTrackRecord()], workoutTrackCollection?.id));
                                            }}
                                            disabled={workoutTrackCollection?.trackedData.some((trackedItem) => !trackedItem.hasAllRequiredValues(workout.trackingValues))}
                                        >
                                            Add Set
                                        </Button>
                                        <Button startIcon={<RemoveCircleOutline />} size='small'
                                            onClick={() => {
                                                workoutTrackCollection?.trackedData.pop();
                                                setWorkoutTrackCollection(new WorkoutTrackCollection(workoutTrackCollection?.workout || workout.id, [...(workoutTrackCollection?.trackedData || [])], workoutTrackCollection?.id));
                                            }}
                                            disabled={workoutTrackCollection?.trackedData && (workoutTrackCollection?.trackedData.length < 2)}>
                                            Remove Set
                                        </Button >
                                    </ButtonGroup>

                                </Stack>
                            </TabPanel>
                        </Box>
                    </Paper>
                </Collapse>
            </Card>
        </ClickAwayListener>
    )
}

export default WorkoutTrackCard