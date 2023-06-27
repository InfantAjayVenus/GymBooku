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
} from "@mui/material";
import { Key, useEffect, useState } from "react";
import { DAYS_OF_WEEK, Plan } from "src/models/Plan";
import { Workout } from "src/models/Workout";
import { ID } from "src/utils/getRandomId";

export interface PlanFormProps {
    workoutsList: Workout[];
    planData?: Plan;
    onSave: (savedPlan: Plan) => void;
}

const daysOfWeekList = [] as DAYS_OF_WEEK[];
for (const day in DAYS_OF_WEEK) {
    daysOfWeekList.push(day as DAYS_OF_WEEK);
}

const INITIAL_PLAN_NAME = '';
const INITIAL_SELECTED_WORKOUTS = [] as ID[];
const INITIAL_SELECTED_DAYS = [] as DAYS_OF_WEEK[];

function PlanForm({ workoutsList, planData, onSave }: PlanFormProps) {
    const [planName, setPlanName] = useState<String>(planData ? planData?.name : INITIAL_PLAN_NAME);
    const [selectedWorkoutsList, setSelectedWorkoutsList] = useState<ID[]>(planData?.workoutsList || INITIAL_SELECTED_WORKOUTS);
    const [selectedDays, setSelectedDays] = useState<DAYS_OF_WEEK[]>(planData?.daysList || INITIAL_SELECTED_DAYS)

    useEffect(() => {
        setPlanName(planData?.name || INITIAL_PLAN_NAME);
        setSelectedDays(planData?.daysList || INITIAL_SELECTED_DAYS);
        setSelectedWorkoutsList(planData?.workoutsList || INITIAL_SELECTED_WORKOUTS);

    }, [planData])


    return (
        <Stack padding={4} spacing={2}>
            <Typography variant="h5" fontWeight={'bold'} component={'h3'}>Create Workout Plan</Typography>
            <form action="#"
                onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (planData) {
                        planData.name = planName;
                        planData.workoutsList = selectedWorkoutsList;
                        planData.daysList = selectedDays;
                        onSave(planData);
                    } else {
                        const savePlan = new Plan(planName, selectedWorkoutsList, selectedDays);
                        onSave(savePlan);
                    }

                    setPlanName(INITIAL_PLAN_NAME);
                    setSelectedWorkoutsList(INITIAL_SELECTED_WORKOUTS);
                    setSelectedDays(INITIAL_SELECTED_DAYS);
                }}
            >
                <Stack spacing={2}>
                    <TextField
                        required
                        label="Plan Name"
                        variant="outlined"
                        value={planName}
                        onChange={(event) => {
                            const {
                                target: { value },
                            } = event;
                            setPlanName(value);
                        }}
                    />
                    <FormControl required>
                        <InputLabel id="workout-select-label">{"Select Workouts"}</InputLabel>
                        <Select
                            required
                            labelId="workout-select-label"
                            id="workout-select"
                            multiple
                            value={selectedWorkoutsList}
                            onChange={(event: SelectChangeEvent<typeof selectedWorkoutsList>) => {
                                const {
                                    target: { value },
                                } = event;
                                setSelectedWorkoutsList(
                                    // On autofill we get a stringified value.
                                    (typeof value === 'string' ? value.split(',') : value) as ID[],
                                );
                            }}
                            input={<OutlinedInput id="select-multiple-chip" label="Select Workouts" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value: String) => workoutsList.find(({ id }) => id === value)?.name || value).join(',')}
                                </Box>
                            )}
                        >
                            {workoutsList.map((workoutItem) => (
                                <MenuItem
                                    key={workoutItem.id as Key}
                                    value={workoutItem.id as string}
                                >
                                    <Checkbox checked={selectedWorkoutsList.includes(workoutItem.id)} />
                                    <ListItemText primary={workoutItem.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl required>
                        <InputLabel id="days-select-label">{"Select Days"}</InputLabel>
                        <Select
                            required
                            labelId="days-select-label"
                            id="days-select-chip"
                            multiple
                            value={selectedDays}
                            onChange={(event: SelectChangeEvent<typeof selectedDays>) => {
                                const {
                                    target: { value },
                                } = event;
                                setSelectedDays(
                                    // On autofill we get a stringified value.
                                    (typeof value === 'string' ? value.split(',') : value) as DAYS_OF_WEEK[],
                                );
                            }}
                            input={<OutlinedInput id="select-multiple-chip" label="Select Days" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value: String) => (
                                        <Chip key={value as Key} label={value.slice(0, 3)} />
                                    ))}
                                </Box>
                            )}
                        >
                            {daysOfWeekList.map((day) => (
                                <MenuItem
                                    key={day as Key}
                                    value={day as string}
                                >
                                    <Checkbox checked={selectedDays.includes(day)} />
                                    <ListItemText primary={day} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        type='submit' 
                        sx={{ alignSelf: 'end', borderRadius: '3rem', width: 'fit-content' }} 
                        variant='contained' 
                        disableElevation
                    >
                        Save
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}

export default PlanForm;