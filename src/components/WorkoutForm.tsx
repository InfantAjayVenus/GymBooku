import {
    Box,
    Button,
    Checkbox,
    Chip,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { ChangeEvent, Key, useEffect, useState } from 'react';
import { TRACKING_VALUES_ICON, TrackingValues, Workout } from 'src/models/Workout';

export interface WorkoutFormProps {
    workoutData?: Workout
    onSave: (savedWorkout: Workout) => void,
};

const INITIAL_TRACKING_VALUES: TrackingValues[] = [];
const INITIAL_WOURKOUT_NAME = '';

export default function WorkoutForm({ onSave, workoutData }: WorkoutFormProps) {

    const [selectedTrackingValues, setSelectedTrackingValues] = useState<TrackingValues[]>(workoutData ? workoutData?.trackingValues : INITIAL_TRACKING_VALUES);
    const [workoutName, setWorkoutName] = useState<String>(workoutData ? workoutData?.name : INITIAL_WOURKOUT_NAME);

    useEffect(() => {
        setSelectedTrackingValues(workoutData?.trackingValues || INITIAL_TRACKING_VALUES);
        setWorkoutName(workoutData?.name || INITIAL_WOURKOUT_NAME);
    }, [workoutData])

    return (
        <Stack padding={4} spacing={2}>
            <Typography variant='h5' fontWeight={'bold'} component={'h2'}>Add Workout</Typography>
            <form action='#' onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if(workoutData) {
                    workoutData.name = workoutName;
                    workoutData.trackingValues = selectedTrackingValues;
                    onSave(workoutData);
                } else {
                    onSave(new Workout(workoutName, selectedTrackingValues));
                }
                setSelectedTrackingValues(INITIAL_TRACKING_VALUES);
                setWorkoutName(INITIAL_WOURKOUT_NAME);
            }}>
                <Stack spacing={2}>
                    <TextField
                        required
                        value={workoutName}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const {
                                target: { value },
                            } = event;

                            setWorkoutName(value);
                        }}
                        id="outlined-basic"
                        label="Workout Name"
                        variant="outlined"
                    />
                    <FormControl required>
                        <InputLabel id="demo-multiple-chip-label">{"Tracking Values"}</InputLabel>
                        <Select
                            required
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={selectedTrackingValues}
                            onChange={(event: SelectChangeEvent<typeof selectedTrackingValues>) => {
                                const {
                                    target: { value },
                                } = event;
                                setSelectedTrackingValues(
                                    // On autofill we get a stringified value.
                                    (typeof value === 'string' ? value.split(',') : value) as TrackingValues[],
                                );
                            }}
                            input={<OutlinedInput id="select-multiple-chip" label="Tracking Values" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value: String) => (
                                        <Chip key={value as Key} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            <MenuItem
                                key={TrackingValues.TIME}
                                value={TrackingValues.TIME}
                            >
                                <Checkbox checked={selectedTrackingValues.indexOf(TrackingValues.TIME) > -1} />
                                <ListItemText primary={TrackingValues.TIME} />
                                {TRACKING_VALUES_ICON[TrackingValues.TIME]()}
                            </MenuItem>
                            <MenuItem
                                key={TrackingValues.COUNT}
                                value={TrackingValues.COUNT}
                            >
                                <Checkbox checked={selectedTrackingValues.indexOf(TrackingValues.COUNT) > -1} />
                                <ListItemText primary={TrackingValues.COUNT} />
                                {TRACKING_VALUES_ICON[TrackingValues.COUNT]()}
                            </MenuItem>
                            <MenuItem
                                key={TrackingValues.WEIGHT}
                                value={TrackingValues.WEIGHT}
                            >
                                <Checkbox checked={selectedTrackingValues.indexOf(TrackingValues.WEIGHT) > -1} />
                                <ListItemText primary={TrackingValues.WEIGHT} />
                                {TRACKING_VALUES_ICON[TrackingValues.WEIGHT]()}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <Button type='submit' sx={{ alignSelf: 'end', borderRadius: '3rem', width: 'fit-content' }} variant='contained' disableElevation >Save</Button>
                </Stack>
            </form>
        </Stack>
    )
}