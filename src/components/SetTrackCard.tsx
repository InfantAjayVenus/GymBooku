import {
    OutlinedInput,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useDebounce from "src/hooks/useDebounce";
import { TrackingValues } from "src/models/Workout";
import { WorkoutTrackRecord } from "src/models/WorkoutRecord";

interface SetTrackCardProps {
    index?: number;
    initialValues: WorkoutTrackRecord,
    trackingValues: TrackingValues[],
    onUpdate: (updatedTrackingData: WorkoutTrackRecord, index: number) => void,
}



function SetTrackCard({ index = 1, initialValues, trackingValues, onUpdate }: SetTrackCardProps) {
    const [trackedValues, setTrackedValues] = useState<WorkoutTrackRecord | null>();
    const [weight, setWeight] = useState('');
    const [count, setCount] = useState('');
    const [time, setTime] = useState('');
    const inputContainerRef = useRef<HTMLDivElement>(null);

    const weightValue = useDebounce<string>(weight, 700);
    const countValue = useDebounce<string>(count, 700);
    const timeValue = useDebounce<string>(time, 700);

    useEffect(() => {
        initialValues && setTrackedValues(initialValues);
        initialValues && setWeight(initialValues.weight?.toString() || '');
        initialValues && setCount(initialValues.count?.toString() || '');
        initialValues && setTime(initialValues.time?.toString() || '');

        if (document.activeElement?.tagName.toLowerCase() === 'input') return;
        inputContainerRef.current?.querySelector('input')?.focus();
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
        },));

        const activeElement = document.activeElement as HTMLElement;

        const inputElements = inputContainerRef.current?.querySelectorAll('input');

        const focussedInputIndex = Array.from(inputElements!).findIndex((inputElement) => activeElement.isSameNode(inputElement));
        inputElements![focussedInputIndex + 1]?.focus();

    }, [weightValue, countValue, timeValue])

    useEffect(() => {
        if (!trackedValues) return;

        onUpdate(trackedValues, index);
    }, [trackedValues])

    const trackedMap = {
        [TrackingValues.COUNT]: { setter: setCount, adornment: 'reps', displayValue: count },
        [TrackingValues.WEIGHT]: { setter: setWeight, adornment: 'Kg', displayValue: weight },
        [TrackingValues.TIME]: { setter: setTime, adornment: 'S', displayValue: time },
    }

    return (
        <Paper variant="outlined">
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-around'}>
                <Typography
                    width={'100%'}
                    textAlign={'center'}
                >Set {index + 1}</Typography>
                <Stack alignSelf={'end'} ref={inputContainerRef}>
                    {trackingValues.map((trackingValue) => {
                        const { setter, adornment, displayValue } = trackedMap[trackingValue];
                        return (
                            <OutlinedInput
                                key={`input-${trackingValue}`}
                                endAdornment={adornment}
                                inputProps={{
                                    inputMode: "numeric",
                                    shrink: "true",
                                }}
                                value={displayValue}
                                onChange={(event) => {
                                    const {
                                        target: {
                                            value
                                        } } = event;

                                    setter(value);
                                }}
                            />
                        )
                    })}
                </Stack>
            </Stack>
        </Paper>
    )
}

export default SetTrackCard
