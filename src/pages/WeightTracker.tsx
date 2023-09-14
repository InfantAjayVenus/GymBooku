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
import { ID } from "src/utils/getRandomId";

interface WeightTrackerProps {
  weightsTrackedData: WeightCollection;
  updateWeightsTrackedData: (updatedWeightCollection: WeightCollection) => void;
}

export default function WeightTracker({ weightsTrackedData, updateWeightsTrackedData }: WeightTrackerProps) {
  const bottomDrawer = useDrawer();
  const [inputValue, setInputValue] = useState('');
  const [weightValue, setWeightValue] = useState(NaN);
  const [selectedWeight, setSelectedWeight] = useState<ID | null>(null);

  const debouncedWeightValue = useDebounce(inputValue, 600);

  const resetSelectedWeight = () => {
    if (!selectedWeight) return;
    const selectedWeightValue = weightsTrackedData.getWeightById(selectedWeight)?.value || null;
    selectedWeightValue && setWeightValue(selectedWeightValue);
  }

  useEffect(() => {
    const todayWeight = weightsTrackedData.getWeightByDate(new Date());
    todayWeight && setSelectedWeight(todayWeight.id);
  }, [])

  useEffect(resetSelectedWeight, [selectedWeight])

  const onWeightChange = (updatedWeightId: ID, updatedWeightValue: number) => {
    const updatedWeight = weightsTrackedData.getWeightById(updatedWeightId);
    const updateWeightIndex = weightsTrackedData.weights.findIndex(item => item.id === updatedWeightId);
    const updatedWeightTrackedData = weightsTrackedData.getCopy();
    updatedWeightTrackedData.weights[updateWeightIndex] = new Weight(updatedWeightValue, updatedWeight?.timestamp, updatedWeight?.id);
    updateWeightsTrackedData(updatedWeightTrackedData);
  }


  useEffect(() => {
    const updatedWeightValue = parseFloat(debouncedWeightValue);

    setWeightValue(isNaN(updatedWeightValue) ? NaN : updatedWeightValue);
  }, [debouncedWeightValue]);

  useEffect(() => {
    setInputValue(weightValue?.toString() || '');
  }, [weightValue]);

  return (
    <>
      <Stack padding={4} spacing={2} position={'relative'}>
        <Typography variant="h5" fontWeight={'bold'} component={'h3'}>Weight Tracker</Typography>
        {weightsTrackedData.weights.map((weight) => {
          return (
            <Stack key={weight.id as string} direction={'row'} alignItems={'center'} justifyContent={'space-between'}
              onClick={() => {
                setSelectedWeight(weight.id);
                bottomDrawer.open();
              }}
            >
              <Typography >{weight.timestamp.toLocaleDateString('en-GB', { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' })}</Typography>
              <Typography >{weight.value} Kg</Typography>
            </Stack>
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
          <Typography variant="caption">
            {selectedWeight &&
              weightsTrackedData
                .getWeightById(selectedWeight)
                ?.timestamp
                .toLocaleDateString(
                  'en-GB',
                  { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' }
                )
            }
          </Typography>
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
                selectedWeight && onWeightChange(selectedWeight, Number(weightValue));
                bottomDrawer.close();
              }}
            >Save</Button>
          </Stack>
        </Stack>
      </SwipeableDrawer>
    </>
  )
}
