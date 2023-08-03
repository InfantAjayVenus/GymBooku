import {
    OutlinedInput,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import useDebounce from "src/hooks/useDebounce";
import { TrackingValues } from "src/models/Workout";
import { WorkoutTrackRecord } from "src/models/WorkoutRecord";

interface SetTrackCardProps {
    index?: number;
    initialValues: WorkoutTrackRecord,
    trackingValues: TrackingValues[],
    onUpdate: (updatedTrackingData: WorkoutTrackRecord, index: number) => void,
}



function SetTrackCard({ index=1, initialValues, trackingValues, onUpdate }: SetTrackCardProps) {
    const [trackedValues, setTrackedValues] = useState<WorkoutTrackRecord | null>();
    const [weight, setWeight] = useState('');
    const [count, setCount] = useState('');
    const [time, setTime] = useState('');

    const weightValue = useDebounce<string>(weight, 700);
    const countValue = useDebounce<string>(count, 700);
    const timeValue = useDebounce<string>(time, 700);

    useEffect(() => {
        initialValues && setTrackedValues(initialValues);
        initialValues && setWeight(initialValues.weight?.toString() || '');
        initialValues && setCount(initialValues.count?.toString() || '');
        initialValues && setTime(initialValues.time?.toString() || '');
    }, [initialValues])

    useEffect(() => {
        if (!trackedValues) return;

        const parsedWeight = parseFloat(parseFloat(weightValue).toFixed(2));
        const parsedCount = parseFloat(parseFloat(countValue).toFixed(2));
        const parsedTime = parseFloat(parseFloat(timeValue).toFixed(2));
        setTrackedValues(new WorkoutTrackRecord(index, {
            time: !isNaN(parsedTime) ? parsedTime : undefined,
            weight: !isNaN(parsedWeight) ? parsedWeight : undefined,
            count: !isNaN(parsedCount) ? parsedCount : undefined
        }, ));

    }, [weightValue, countValue, timeValue])

    useEffect(() => {
        if (!trackedValues) return;

        onUpdate(trackedValues, index);
    }, [trackedValues])

    return (
        <Paper variant="outlined">
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-around'}>
                <Typography
                    width={'100%'}
                    textAlign={'center'}
                >Set {index + 1}</Typography>
                <Stack alignSelf={'end'}>
                    {trackingValues.includes(TrackingValues.COUNT) && (
                        <OutlinedInput
                            endAdornment="reps"
                            inputProps={{
                                shrink: "true",
                            }}
                            value={count}
                            onChange={(event) => {
                                const {
                                    target: {
                                        value
                                    } } = event;

                                setCount(value);
                            }}
                        />
                    )}
                    {trackingValues.includes(TrackingValues.WEIGHT) && (
                        <OutlinedInput
                            endAdornment="Kg"
                            inputProps={{
                                shrink: "true",
                            }}
                            value={weight}
                            onChange={(event) => {
                                const {
                                    target: {
                                        value
                                    } } = event;

                                setWeight(value);
                            }}
                        />
                    )}
                    {trackingValues.includes(TrackingValues.TIME) && (
                        <OutlinedInput
                            endAdornment="S"
                            inputProps={{
                                shrink: "true",
                            }}
                            value={time}
                            onChange={(event) => {
                                const {
                                    target: {
                                        value
                                    } } = event;

                                setTime(value);
                            }}
                        />
                    )}
                </Stack>
            </Stack>
        </Paper>
    )
}

export default SetTrackCard