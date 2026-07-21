import React from 'react';
import { Close } from "@mui/icons-material";
import {
  Divider,
  IconButton,
  Stack,
  SwipeableDrawer,
  Typography
} from "@mui/material";
import Puller from "src/components/Puller";
import { WeightCollection, Weight } from "src/models/WeightCollection";
import getAverage from "src/utils/getAverage";

interface ProjectionListDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  weightsTrackedData: WeightCollection;
  currentProgramWeek: number;
  weeksToGo: number | string;
  programWeeks: { week: number; weights: Weight[] }[];
}

export default function ProjectionListDrawer({
  isOpen,
  onOpen,
  onClose,
  weightsTrackedData,
  currentProgramWeek,
  weeksToGo,
  programWeeks
}: ProjectionListDrawerProps) {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <Puller />
      <Stack spacing={2} padding={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Weekly Averages</Typography>
          <IconButton aria-label="close drawer" onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
        <Stack spacing={1}>
          {(() => {
            const sortedWeights = [...weightsTrackedData.weights].sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());
            const initialWeight = sortedWeights.length > 0 ? sortedWeights[0].value : NaN;
            const rate = weightsTrackedData.rateOfReduction / 100;

            return Array.from({ length: currentProgramWeek + (typeof weeksToGo === 'number' ? weeksToGo : 0) + 1 }, (_, i) => i).map((week) => {
              const programWeek = programWeeks.find(w => w.week === week);
              const weekAvg = programWeek ? getAverage(programWeek.weights.map(w => w.value), 2) : '-';
              const projectedAvg = isNaN(initialWeight) ? '-' : (initialWeight * Math.pow(1 - rate, week)).toFixed(2);
              
              const isCurrentWeek = week === currentProgramWeek;
              const textStyleProps = isCurrentWeek ? { fontWeight: 'bold' } : {};

              const displayWeight = weekAvg !== '-' ? `${weekAvg}/${projectedAvg}` : projectedAvg;
              const displayUnit = displayWeight !== '-' ? 'Kg' : '';
              
              return (
                <React.Fragment key={`drawer-week-${week}`}>
                  <Stack direction={'row'} justifyContent={'space-between'} py={1}>
                    <Typography {...textStyleProps}>Week-{week}</Typography>
                    <Typography {...textStyleProps}>{displayWeight} {displayUnit}</Typography>
                  </Stack>
                  <Divider />
                </React.Fragment>
              );
            });
          })()}
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
}
