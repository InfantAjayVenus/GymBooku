import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Fab,
  OutlinedInput,
  Paper,
  Stack,
  SwipeableDrawer,
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Puller from "src/components/Puller";
import useDrawer from "src/hooks/useDrawer";
import useWeeklyWeightTrackedData, { WeeklyWeights } from "src/hooks/useWeeklyWeightTrackedData";
import { Weight, WeightCollection } from "src/models/WeightCollection";
import { WeightTrackForm } from "src/pages/WeightTracker/WeightTrackForm";
import getAverage from "src/utils/getAverage";
import getWeek from "src/utils/getWeek";
import isTimestampToday from "src/utils/isTimestampToday";

interface WeightTrackerProps {
  weightsTrackedData: WeightCollection;
  updateWeightsTrackedData: (updatedWeightCollection: WeightCollection) => void;
}

export default function WeightTracker({ weightsTrackedData, updateWeightsTrackedData }: WeightTrackerProps) {
  const bottomDrawer = useDrawer();
  const goalDialog = useDrawer();

  const [selectedWeight, setSelectedWeight] = useState<Weight>(new Weight(0, new Date()));
  const [goalWeight, setGoalWeight] = useState<number>(0);

  const weeklyWeights = useWeeklyWeightTrackedData(weightsTrackedData.weights);
  const currentWeekWeights = weeklyWeights.find(({ week }) => Number(week) === getWeek(new Date())) || {} as WeeklyWeights;
  const currentWeekAverage = getAverage(currentWeekWeights?.weights?.map(item => item.value) || [], 1);

  useEffect(() => {
    const todayWeight = weightsTrackedData.getWeightByDate(new Date());
    todayWeight && setSelectedWeight(todayWeight);
    weightsTrackedData?.goal && setGoalWeight(weightsTrackedData.goal);
  }, [])



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
                  setSelectedWeight(weight);
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
            if (!isTimestampToday(selectedWeight.timestamp)) {
              setSelectedWeight(new Weight(0, new Date()));
            }
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
      {<SwipeableDrawer
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
        <WeightTrackForm weight={selectedWeight} onClose={() => {
          bottomDrawer.close();
        }} onSave={(updatedWeight) => {
          const updatedWeightIndex = weightsTrackedData.weights.findIndex(({ id, timestamp }) => id === updatedWeight.id 
          || dayjs(timestamp).isSame(updatedWeight.timestamp, 'date'));
          
          const updateIndex = updatedWeightIndex < 0 ? weightsTrackedData.weights.length : updatedWeightIndex;
          weightsTrackedData.weights[updateIndex] = updatedWeight;

          updateWeightsTrackedData(weightsTrackedData.getCopy());
        }} />
      </SwipeableDrawer>}
    </>
  )
}
