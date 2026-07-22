import {
  Button,
  OutlinedInput,
  Stack,
  SwipeableDrawer,
  Typography
} from "@mui/material";
import Puller from "src/components/Puller";
import { WeightCollection } from "src/models/WeightCollection";
import { ID } from "src/utils/getRandomId";

interface TrackWeightDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedWeight: ID | null;
  weightsTrackedData: WeightCollection;
  inputValue: string;
  setInputValue: (value: string) => void;
  weightValue: number;
  onAddWeight: (weightValue: number) => void;
  onUpdateWeight: (updatedWeightId: ID, updatedWeightValue: number) => void;
}

export default function TrackWeightDrawer({
  isOpen,
  onOpen,
  onClose,
  selectedWeight,
  weightsTrackedData,
  inputValue,
  setInputValue,
  weightValue,
  onAddWeight,
  onUpdateWeight
}: TrackWeightDrawerProps) {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
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
          type="text"
          inputProps={{ inputMode: 'decimal' }}
          endAdornment="kg"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <Stack direction={'row'} justifyContent={'flex-end'}>
          <Button variant="text" color="error" onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              selectedWeight ? onUpdateWeight(selectedWeight, Number(weightValue)) : onAddWeight(Number(weightValue));
              onClose();
            }}
          >Save</Button>
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
}
