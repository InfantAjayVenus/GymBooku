import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Fab,
  OutlinedInput,
  Stack,
  SwipeableDrawer,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import Puller from "src/components/Puller";
import useDebounce from "src/hooks/useDebounce";
import useDrawer from "src/hooks/useDrawer";
import { Weight, WeightCollection } from "src/models/WeightCollection";

interface WeightTrackerProps {
  weightsTrackedData: WeightCollection;
  updateWeightsTrackedData: (updatedWeightCollection: WeightCollection) => void;
}

export default function WeightTracker({ weightsTrackedData, updateWeightsTrackedData }: WeightTrackerProps) {
  const bottomDrawer = useDrawer();
  const [weightValue, setWeightValue] = useState('');

  const debouncedWeightValue = useDebounce(weightValue, 500);

  useEffect(() => {
    const previousWeightToday = weightsTrackedData.getWeightByDate(new Date());
    previousWeightToday && setWeightValue(previousWeightToday.value.toString());
  })

  const onWeightChange = (updatedWeightValue: number) => {
    const previousWeightToday = weightsTrackedData.getWeightByDate(new Date());
    const updatedWeightTrackedData = weightsTrackedData.getCopy();
    updatedWeightTrackedData.weights = [
      ...weightsTrackedData.weights.filter((weight) => weight.id !== previousWeightToday?.id),
      new Weight(updatedWeightValue, new Date(), previousWeightToday?.id)
    ];
    updateWeightsTrackedData(updatedWeightTrackedData);
  }


  useEffect(() => {    
    const updatedWeightValue = parseFloat(debouncedWeightValue);
    setWeightValue(isNaN(updatedWeightValue) ? '' : updatedWeightValue.toString());
  }, [debouncedWeightValue]);

  return (
    <>
      <Stack padding={4} spacing={2} position={'relative'}>
        <Typography variant="h5" fontWeight={'bold'} component={'h3'}>Weight Tracker</Typography>
        {weightsTrackedData.weights.map((weight) => {
          return (
            <Stack key={weight.id as string} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography >{weight.timestamp.toLocaleDateString('en-GB', { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' })}</Typography>
              <Typography >{weight.value} Kg</Typography>
            </Stack>
          )
        })}
      </Stack>
      <Box sx={{ position: "fixed", bottom: '4rem', right: '1rem' }}>
        <Fab size="medium" color="primary" aria-label="add workout"
          onClick={() => {
            bottomDrawer.open();
          }}
        >
          <Add />
        </Fab>
      </Box>
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
          <OutlinedInput
            autoFocus
            endAdornment="kg"
            inputProps={{
              shrink: "true",
            }}
            value={weightValue}
            onChange={(e) => {
              setWeightValue(e.target.value);
            }}
          />
          <Stack direction={'row'} justifyContent={'flex-end'}>
            <Button variant="text" color="error" onClick={() => bottomDrawer.close()}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                onWeightChange(Number(weightValue));
                bottomDrawer.close();
              }}
            >Save</Button>
          </Stack>
        </Stack>
      </SwipeableDrawer>
    </>
  )
}
