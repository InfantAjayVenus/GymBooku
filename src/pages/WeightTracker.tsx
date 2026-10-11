import { Add, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Fab,
  Paper,
  Stack,
  Typography,
  SwipeableDrawer
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import TrackWeightDrawer from "src/components/TrackWeightDrawer";
import ProjectionListDrawer from "src/components/ProjectionListDrawer";
import Puller from "src/components/Puller";
import WeightTrackerOnboarding from "src/pages/WeightTrackerOnboarding";
import useDebounce from "src/hooks/useDebounce";
import useDrawer from "src/hooks/useDrawer";
import useWeeklyWeightTrackedData, { WeeklyWeights } from "src/hooks/useWeeklyWeightTrackedData";
import { Weight, WeightCollection } from "src/models/WeightCollection";
import getAverage from "src/utils/getAverage";
import { ID } from "src/utils/getRandomId";
import getWeek from "src/utils/getWeek";
import useWeightTrackerStats from "src/hooks/useWeightTrackerStats";

interface WeightTrackerProps {
  weightsTrackedData: WeightCollection;
  updateWeightsTrackedData: (updatedWeightCollection: WeightCollection) => void;
}

export default function WeightTracker({ weightsTrackedData, updateWeightsTrackedData }: WeightTrackerProps) {
  const bottomDrawer = useDrawer();
  const weeksDrawer = useDrawer();
  const onboardingDrawer = useDrawer();
  const [inputValue, setInputValue] = useState('');
  const [weightValue, setWeightValue] = useState(NaN);
  const [selectedWeight, setSelectedWeight] = useState<ID | null>(null);

  const debouncedWeightValue = useDebounce(inputValue, 600);
  const weeklyWeights = useWeeklyWeightTrackedData(weightsTrackedData.weights);
  const currentWeekWeights = weeklyWeights.find(({ week }) => Number(week) === getWeek(new Date())) || {} as WeeklyWeights;
  const currentWeekAverage = getAverage(currentWeekWeights?.weights?.map(item => item.value) || [], 2);

  const {
    displayTargetWeekAvg,
    weeksToGo,
    displayDiffToTarget,
    displayDiffFromLastWeek,
    isTargetReached,
  } = useWeightTrackerStats(weightsTrackedData, weeklyWeights, currentWeekAverage);

  const { currentProgramWeek, programWeeks } = useMemo(() => {
    if (!weightsTrackedData.weights.length) return { currentProgramWeek: 0, programWeeks: [] };
    const startDate = weightsTrackedData.weights.reduce((oldest, current) => 
      current.timestamp < oldest.timestamp ? current : oldest
    ).timestamp;
    
    const startDay = startDate.getDay();
    const getMonday = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        date.setDate(diff);
        date.setHours(0,0,0,0);
        return date;
    };
    
    const startMonday = getMonday(startDate);
    
    const getWeekNumber = (d: Date) => {
      const targetMonday = getMonday(d);
      const diffTime = targetMonday.getTime() - startMonday.getTime();
      const diffWeeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));
      return Math.max(0, diffWeeks + (startDay === 1 ? 1 : 0));
    };

    const currentProgramWeek = getWeekNumber(new Date());

    const grouped = weightsTrackedData.weights.reduce((acc, weight) => {
      const weekN = getWeekNumber(weight.timestamp);
      if (!acc[weekN]) acc[weekN] = [];
      acc[weekN].push(weight);
      return acc;
    }, {} as Record<number, typeof weightsTrackedData.weights>);

    const programWeeks = Object.entries(grouped)
      .map(([weekStr, weights]) => ({
        week: Number(weekStr),
        weights: weights.sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())
      }))
      .sort((a, b) => b.week - a.week);

    return { currentProgramWeek, programWeeks };
  }, [weightsTrackedData.weights]);

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


  useEffect(() => {
    const updatedWeightValue = parseFloat(debouncedWeightValue);

    setWeightValue(isNaN(updatedWeightValue) ? NaN : updatedWeightValue);
  }, [debouncedWeightValue]);

  useEffect(() => {
    setInputValue(Number.isNaN(weightValue) ? '' : weightValue.toString());
  }, [weightValue]);

  return (
    <>
      <Stack padding={4} spacing={4} position={'relative'}>

        <Stack direction={'row'} justifyContent={'space-between'}>
          <Paper
            onClick={() => weeksDrawer.open()}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              padding: '1rem',
              borderRadius: '0.40rem',
            }}
          >
            <Typography variant="h5" fontWeight={'bold'} component={'h3'}>Week {currentProgramWeek} Avg</Typography>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
              <Typography variant="h5" fontWeight='semi-bold' >{currentWeekAverage}/</Typography>
              <Typography variant="h5" fontWeight='semi-bold' color={'GrayText'}>{displayTargetWeekAvg}</Typography>
            </Stack>
          </Paper>
          <Paper
            onClick={() => onboardingDrawer.open()}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              padding: '1rem',
              borderRadius: '0.40rem',
            }}
          >
            <Typography variant="h4" textAlign={'center'}>{weightsTrackedData.goal} Kg</Typography>
            <Typography variant="h5" textAlign={'center'}>{weeksToGo} Weeks</Typography>
          </Paper>
        </Stack>

        <Paper
          variant="outlined"
          style={{
            padding: '1rem 1rem',
            borderRadius: '0.4rem'
          }}>
          <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
            <Typography>
              {displayDiffToTarget} Kg {displayDiffToTarget === '-' ? 'to target' : isTargetReached ? 'past target' : 'to target'}
            </Typography>
            <Typography>
              {displayDiffFromLastWeek} Kg from last week
            </Typography>
          </Stack>
        </Paper>
        <Typography variant="h5" fontWeight={'semi-bold'} component={'h3'}>Tracked Weights</Typography>
        {programWeeks.map(({ week, weights }) => {
          const weekAvg = getAverage(weights.map(w => w.value), 2);
          return (
          <Accordion key={`week-${week}`} defaultExpanded={week === currentProgramWeek} sx={{ mb: 1, backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 0, minHeight: 'auto', '& .MuiAccordionSummary-content': { my: 1 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" px="0.25rem">
                <Typography variant="subtitle1" fontWeight="bold">
                  Week-{week}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  Avg: {weekAvg} Kg
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, px: 0 }}>
              {weights.map((weight) => {
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
                      px={'1rem'}
                      py={'0.5rem'}
                      onClick={isWeightCurrentWeek ? () => {
                        setSelectedWeight(weight.id);
                        bottomDrawer.open();
                      } : undefined}
                    >
                      <Typography {...textStyleProps}>{weight.timestamp.toLocaleDateString('en-GB', { weekday: 'short', year: '2-digit', month: 'short', day: '2-digit' })}</Typography>
                      <Typography {...textStyleProps}>{weight.value} Kg</Typography>
                    </Stack>
                    <Divider />
                  </React.Fragment>
                )
              })}
            </AccordionDetails>
          </Accordion>
        );
        })}
      </Stack>
      <Box sx={{ position: "fixed", bottom: '4rem', right: '1rem' }}>
        <Fab size="medium" color="primary" aria-label="record weight"
          onClick={() => {
            resetSelectedWeight();
            bottomDrawer.open();
          }}
        >
          <Add />
        </Fab>
      </Box>
      <TrackWeightDrawer
        isOpen={bottomDrawer.isOpen as boolean}
        onOpen={() => bottomDrawer.open()}
        onClose={() => bottomDrawer.close()}
        selectedWeight={selectedWeight}
        weightsTrackedData={weightsTrackedData}
        inputValue={inputValue}
        setInputValue={setInputValue}
        weightValue={weightValue}
        onAddWeight={onAddWeight}
        onUpdateWeight={onUpdateWeight}
      />
      <ProjectionListDrawer
        isOpen={weeksDrawer.isOpen as boolean}
        onOpen={() => weeksDrawer.open()}
        onClose={() => weeksDrawer.close()}
        weightsTrackedData={weightsTrackedData}
        currentProgramWeek={currentProgramWeek}
        weeksToGo={weeksToGo}
        programWeeks={programWeeks}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={onboardingDrawer.isOpen as boolean}
        onOpen={() => onboardingDrawer.open()}
        onClose={() => onboardingDrawer.close()}
      >
        <Puller />
        <WeightTrackerOnboarding 
          initialData={weightsTrackedData}
          onComplete={(initialData) => {
            updateWeightsTrackedData(initialData);
            onboardingDrawer.close();
          }} 
        />
      </SwipeableDrawer>
    </>
  )
}
