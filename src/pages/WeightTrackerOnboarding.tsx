import { useMemo, useState } from 'react';
import { Box, Button, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, Paper } from '@mui/material';
import { Weight, WeightCollection } from '../models/WeightCollection';

const PERCENTAGE_DIVISOR = 100;
const SUNDAY_INDEX = 0;
const MONDAY_INDEX = 1;
const DAYS_IN_WEEK = 7;
const DAYS_TO_ADD_IF_SUNDAY = 1;
const DAYS_FROM_MONDAY_TO_SATURDAY = 5;

const RATE_0_5 = 0.5;
const RATE_1_0 = 1;
const BOTTOM_NAVIGATION_PADDING = 12;

interface WeightTrackerOnboardingProps {
    onComplete: (initialData: WeightCollection) => void;
}

export default function WeightTrackerOnboarding({ onComplete }: WeightTrackerOnboardingProps) {
    const [currentWeight, setCurrentWeight] = useState<string>('');
    const [targetWeight, setTargetWeight] = useState<string>('');
    const [rateOfReduction, setRateOfReduction] = useState<number | null>(RATE_1_0);

    const { weeks, targetDate } = useMemo(() => {
        const current = parseFloat(currentWeight);
        const target = parseFloat(targetWeight);
        
        if (isNaN(current) || isNaN(target) || !rateOfReduction || current <= target) {
            return { weeks: 0, targetDate: null };
        }

        const rate = rateOfReduction / PERCENTAGE_DIVISOR;
        const calculatedWeeks = Math.ceil(Math.log(target / current) / Math.log(1 - rate));

        const today = new Date();
        const nextMonday = new Date(today);
        const day = nextMonday.getDay();
        const diffToMonday = day === SUNDAY_INDEX ? DAYS_TO_ADD_IF_SUNDAY : DAYS_IN_WEEK - day + MONDAY_INDEX;
        nextMonday.setDate(nextMonday.getDate() + diffToMonday);

        const endDate = new Date(nextMonday);
        endDate.setDate(endDate.getDate() + (calculatedWeeks - 1) * DAYS_IN_WEEK + DAYS_FROM_MONDAY_TO_SATURDAY); 
        return { weeks: calculatedWeeks, targetDate: endDate };
    }, [currentWeight, targetWeight, rateOfReduction]);

    const handleSubmit = () => {
        const current = parseFloat(currentWeight);
        const target = parseFloat(targetWeight);
        if (isNaN(current) || isNaN(target) || !rateOfReduction || current <= target) return;

        const collection = new WeightCollection();
        collection.isOnboarded = true;
        collection.goal = target;
        collection.rateOfReduction = rateOfReduction;
        
        const initialWeight = new Weight(current, new Date());
        collection.weights = [initialWeight];

        onComplete(collection);
    };

    const isFormValid = !isNaN(parseFloat(currentWeight)) && !isNaN(parseFloat(targetWeight)) && rateOfReduction !== null && parseFloat(currentWeight) > parseFloat(targetWeight);

    return (
        <Stack 
            padding={4} 
            spacing={4} 
            sx={{ 
                overflowY: 'auto', 
                height: '100%', 
                pb: BOTTOM_NAVIGATION_PADDING
            }}
        >
            <Typography variant="h4" fontWeight="bold">Weight Tracker</Typography>

            <Stack spacing={3}>
                <TextField
                    label="Current Weight (kg)"
                    type="text"
                    value={currentWeight}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (/^\d*\.?\d*$/.test(val) && parseFloat(val) >= 0)) {
                            setCurrentWeight(val);
                        }
                    }}
                    fullWidth
                    inputProps={{ inputMode: "decimal" }}
                />

                <TextField
                    label="Target Weight (kg)"
                    type="text"
                    value={targetWeight}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (/^\d*\.?\d*$/.test(val) && parseFloat(val) >= 0)) {
                            setTargetWeight(val);
                        }
                    }}
                    fullWidth
                    inputProps={{ inputMode: "decimal" }}
                />

                <Box>
                    <Typography variant="subtitle1" gutterBottom>Rate of Reduction (per week)</Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={rateOfReduction}
                        exclusive
                        onChange={(_, newValue) => {
                            if (newValue !== null) setRateOfReduction(newValue);
                        }}
                        fullWidth
                    >
                        <ToggleButton value={RATE_0_5}>0.5%</ToggleButton>
                        <ToggleButton value={RATE_1_0}>1.0%</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Stack>

            {weeks > 0 && targetDate && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Stack spacing={1}>
                        <Typography variant="body2">
                            Estimated time to reach goal: <b>{weeks} weeks</b>
                        </Typography>
                        <Typography variant="body2">
                            Target date: <b>{targetDate.toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</b>
                        </Typography>
                        
                    </Stack>
                </Paper>
            )}

            <Button
                variant="contained"
                size="large"
                disabled={!isFormValid}
                onClick={handleSubmit}
            >
                Start Tracking
            </Button>
        </Stack>
    );
}
