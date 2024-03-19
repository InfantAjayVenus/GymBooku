import { Button, Menu, OutlinedInput, Stack, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import useDebounce from "src/hooks/useDebounce";
import useDrawer from "src/hooks/useDrawer";
import { Weight } from "src/models/WeightCollection";

interface WeightTrackFormProps {
    weight: Weight;
    onSave: (updatedWeight: Weight) => void;
    onClose: () => void;
}

export function WeightTrackForm({ weight, onSave, onClose }: WeightTrackFormProps) {
    const [inputValue, setInputValue] = useState('');
    const [isInputError, setIsInputError] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [datePickerAnchorElement, setDatePickerAnchorElement] = useState<HTMLElement | null>(null);

    const datePicker = useDrawer();
    const debouncedInputValue = useDebounce(inputValue, 750);

    useEffect(() => {
        if (!weight) return;

        setInputValue(weight.value !== 0 ? weight.value.toString() : '');
        setDate(weight.timestamp);
    }, [weight]);

    useEffect(() => {
        if(inputValue === '') return;

        const parsedInput = parseFloat(debouncedInputValue);
        if(isNaN(parsedInput)) {
            setInputValue('');
            setIsInputError(true);
        }else{
            setInputValue(parsedInput !== 0 ? parsedInput.toFixed(2) : '');
            setIsInputError(false);
        }
    }, [debouncedInputValue])

    const onCloseDatePicker = () => {
        datePicker.close();
        setDatePickerAnchorElement(null);
    }

    const dateDisplayValue = date
        .toLocaleDateString(
            'en-GB',
            { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' }
        )

    return (
        <Stack spacing={2} padding={4}>
            <Typography variant="h6">Track Weight</Typography>
            <>
                <Button
                    variant="text"
                    sx={{
                        justifyContent: 'left'
                    }}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        datePicker.open();
                        setDatePickerAnchorElement(event.currentTarget);
                    }}
                >
                    {dateDisplayValue}
                </Button>
                <Menu
                    anchorEl={datePickerAnchorElement}
                    open={datePicker.isOpen as boolean}
                    onClose={onCloseDatePicker}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={dayjs(dateDisplayValue)}
                            maxDate={dayjs(new Date())}
                            minDate={dayjs(new Date()).day(0)}
                            view="day"
                            onChange={(date, state) => {
                                if (state === 'finish') {
                                    console.log('DATE_CHANGED:', date.valueOf(), state);
                                    /**
                                     * TODO
                                     * Update State with the new date Value
                                     */
                                    setDate(new Date(date.valueOf()));
                                    onCloseDatePicker();
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Menu>
            </>
            <OutlinedInput
                autoFocus
                error={isInputError}
                endAdornment="kg"
                inputProps={{
                    shrink: "true",
                }}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
            />
            <Stack direction={'row'} justifyContent={'flex-end'}>
                <Button
                    variant="text"
                    color="error"
                    onClick={() => {
                        onClose();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        const updatedWeightValue = parseFloat(inputValue);
                        const updateWeight = weight.getCopy({updatedWeightValue, updatedDate: date});

                        onSave(updateWeight);
                        onClose();
                    }}
                >
                    Save
                </Button>
            </Stack>
        </Stack>
    )
}