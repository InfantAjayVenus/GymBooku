import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Fab,
  Menu,
  OutlinedInput,
  Paper,
  Stack,
  SwipeableDrawer,
  Typography
} from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import Puller from "src/components/Puller";
import useDebounce from "src/hooks/useDebounce";
import useDrawer from "src/hooks/useDrawer";
import useWeeklyWeightTrackedData, { WeeklyWeights } from "src/hooks/useWeeklyWeightTrackedData";
import { Weight, WeightCollection } from "src/models/WeightCollection";
import getAverage from "src/utils/getAverage";
import { ID } from "src/utils/getRandomId";
import getWeek from "src/utils/getWeek";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface WeightTrackerProps {
  weightsTrackedData: WeightCollection;
  updateWeightsTrackedData: (updatedWeightCollection: WeightCollection) => void;
}

export default function WeightTracker({ weightsTrackedData, updateWeightsTrackedData }: WeightTrackerProps) {
  const bottomDrawer = useDrawer();
  const goalDialog = useDrawer();
  const datePicker = useDrawer();

  const [inputValue, setInputValue] = useState('');
  const [weightValue, setWeightValue] = useState(NaN);
  const [selectedWeight, setSelectedWeight] = useState<ID | null>(null);
  const [goalWeight, setGoalWeight] = useState<number>(0);
  const [datePickerAnchorElement, setDatePickerAnchorElement] = useState<HTMLElement | null>(null);

  const debouncedWeightValue = useDebounce(inputValue, 600);
  const weeklyWeights = useWeeklyWeightTrackedData(weightsTrackedData.weights);
  const currentWeekWeights = weeklyWeights.find(({ week }) => Number(week) === getWeek(new Date())) || {} as WeeklyWeights;
  const currentWeekAverage = getAverage(currentWeekWeights?.weights?.map(item => item.value) || [], 1);

  const resetSelectedWeight = () => {
    if (!selectedWeight) return;
    const selectedWeightValue = weightsTrackedData.getWeightById(selectedWeight)?.value || null;
    selectedWeightValue && setWeightValue(selectedWeightValue);
  }

  useEffect(() => {
    const todayWeight = weightsTrackedData.getWeightByDate(new Date());
    todayWeight && setSelectedWeight(todayWeight.id);
    weightsTrackedData?.goal && setGoalWeight(weightsTrackedData.goal);
  }, [])

  useEffect(resetSelectedWeight, [selectedWeight])

  const onAddWeight = (weightValue: number) => {
    const updatedWeightsData = weightsTrackedData.getCopy();
    const newWeight = new Weight(weightValue);
    updatedWeightsData.weights.push(newWeight);
    updateWeightsTrackedData(updatedWeightsData);
    setSelectedWeight(newWeight.id);
  }

  const onUpdateWeight = (updatedWeightId: ID, updatedWeightValue: number) => {
    const updatedWeight = weightsTrackedData.getWeightById(updatedWeightId);
    const updateWeightIndex = weightsTrackedData.weights.findIndex(item => item.id === updatedWeightId);
    const updatedWeightTrackedData = weightsTrackedData.getCopy();
    updatedWeightTrackedData.weights[updateWeightIndex] = new Weight(updatedWeightValue, updatedWeight?.timestamp, updatedWeight?.id);
    updateWeightsTrackedData(updatedWeightTrackedData);
  }

  const onCloseDatePicker = () => {
    datePicker.close();
    setDatePickerAnchorElement(null);
  }


  useEffect(() => {
    const updatedWeightValue = parseFloat(debouncedWeightValue);

    setWeightValue(isNaN(updatedWeightValue) ? NaN : updatedWeightValue);
  }, [debouncedWeightValue]);

  useEffect(() => {
    const displayWeightValue = weightValue?.toString() || '';
    setInputValue(displayWeightValue === 'NaN' ? '' : displayWeightValue);
  }, [weightValue]);

  return (
    <>
      <Stack padding={4} spacing={2} position={'relative'}>
        <Stack>
          <Typography variant="h5" fontWeight={'bold'} component={'h3'}>Week's Avg</Typography>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography variant="h1" fontWeight='semi-bold' >{currentWeekAverage}</Typography>
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingX: '1rem',
                marginY: '0.5rem',
                borderRadius: '0.40rem',
              }}
              onClick={() => {
                goalDialog.open();
              }}
            >
              <Typography fontWeight={'bold'} textAlign={'center'}>Goal</Typography>
              <Typography variant="h3" textAlign={'center'}>{weightsTrackedData.goal}</Typography>
            </Paper></Stack>

        </Stack>
        <Typography variant="h5" fontWeight={'semi-bold'} component={'h3'}>Tracked Weights</Typography>
        {weightsTrackedData.weights.sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf()).map((weight) => {
          const isWeightCurrentWeek = currentWeekWeights?.weights?.map(({ id }) => id)?.includes(weight.id);
          const textStyleProps = isWeightCurrentWeek ? {
            fontWeight: 'bold',
          } : {
            color: 'GrayText',
          }
          return (
            <React.Fragment key={weight.id as string}>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                px={'0.25rem'}
                onClick={isWeightCurrentWeek ? () => {
                  setSelectedWeight(weight.id);
                  bottomDrawer.open();
                } : () => { }}
              >
                <Typography {...textStyleProps}>{weight.timestamp.toLocaleDateString('en-GB', { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' })}</Typography>
                <Typography {...textStyleProps}>{weight.value} Kg</Typography>
              </Stack>
              <Divider />
            </React.Fragment>
          )
        })}
      </Stack>
      <Box sx={{ position: "fixed", bottom: '4rem', right: '1rem' }}>
        <Fab size="medium" color="primary" aria-label="add workout"
          onClick={() => {
            resetSelectedWeight();
            bottomDrawer.open();
          }}
        >
          <Add />
        </Fab>
      </Box>
      <Dialog open={goalDialog.isOpen as boolean}
        onClose={() => {
          weightsTrackedData?.goal && setGoalWeight(weightsTrackedData.goal);
        }}
      >
        <DialogContent>
          <Stack direction={'row'} justifyContent={'space-around'} alignItems={'center'}>
            <Typography width={'100%'}>
              Set Weight Goal
            </Typography>

            <OutlinedInput
              autoFocus
              endAdornment="Kg"
              inputProps={{
                shrink: "true",
              }}
              sx={{
                alignSelf: 'end'
              }}
              value={goalWeight}
              onChange={(event) => {
                const {
                  target: {
                    value
                  } } = event;

                setGoalWeight(Number(value));
              }}
            />

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              const updatedWeightTrackedData = weightsTrackedData.getCopy();
              updatedWeightTrackedData.goal = goalWeight;
              updateWeightsTrackedData(updatedWeightTrackedData);
              goalDialog.close();
            }}
          >
            Save
          </Button>
          <Button color="error" onClick={() => { goalDialog.close() }}>Close</Button>
        </DialogActions>
      </Dialog>
      <SwipeableDrawer
        anchor="bottom"
        open={bottomDrawer.isOpen as boolean}
        onOpen={() => {
          bottomDrawer.open();
        }}
        onClose={() => {
          bottomDrawer.close();
        }}
      >
        <Puller />
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
              {selectedWeight &&
                weightsTrackedData
                  .getWeightById(selectedWeight)
                  ?.timestamp
                  .toLocaleDateString(
                    'en-GB',
                    { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' }
                  )
              }
            </Button>
            <Menu
              anchorEl={datePickerAnchorElement}
              open={datePicker.isOpen as boolean}
              onClose={onCloseDatePicker}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={selectedWeight && dayjs(
                    weightsTrackedData
                      .getWeightById(selectedWeight)
                      ?.timestamp
                      .toLocaleDateString(
                        'en-GB',
                        { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' }
                      )
                  )}
                  onChange={(date, state) => {
                    if (state === 'finish') {
                      console.log('DATE_CHANGED:', date.valueOf(), state);
                      /**
                       * TODO
                       * Update State with the new date Value
                       */
                    }
                  }}
                />
              </LocalizationProvider>
            </Menu>
          </>
          <OutlinedInput
            autoFocus
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
            <Button variant="text" color="error" onClick={() => bottomDrawer.close()}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                selectedWeight ? onUpdateWeight(selectedWeight, Number(weightValue)) : onAddWeight(Number(weightValue));
                bottomDrawer.close();
              }}
            >Save</Button>
          </Stack>
        </Stack>
      </SwipeableDrawer>
    </>
  )
}
