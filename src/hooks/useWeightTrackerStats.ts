import { useMemo } from 'react';
import { WeightCollection } from 'src/models/WeightCollection';
import { WeeklyWeights } from 'src/hooks/useWeeklyWeightTrackedData';
import getWeek from 'src/utils/getWeek';
import getAverage from 'src/utils/getAverage';

export interface WeightTrackerStats {
  displayTargetWeekAvg: number | string;
  weeksToGo: number | string;
  displayDiffToTarget: number | string;
  displayDiffFromLastWeek: number | string;
  isTargetReached: boolean;
}

export default function useWeightTrackerStats(
  weightsTrackedData: WeightCollection,
  weeklyWeights: WeeklyWeights[],
  currentWeekAverage: number
): WeightTrackerStats {
  return useMemo(() => {
    // Target Week Avg
    const sortedWeights = [...weightsTrackedData.weights].sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());
    const initialWeight = sortedWeights.length > 0 ? sortedWeights[0].value : NaN;
    const initialDate = sortedWeights.length > 0 ? sortedWeights[0].timestamp : new Date();

    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksElapsed = Math.floor((new Date().getTime() - initialDate.getTime()) / msInWeek);
    const rate = weightsTrackedData.rateOfReduction / 100;
    const targetWeekAvg = isNaN(initialWeight) ? NaN : (initialWeight * Math.pow(1 - rate, weeksElapsed));
    const displayTargetWeekAvg = isNaN(targetWeekAvg) ? '-' : Number(targetWeekAvg.toFixed(2));

    // Weeks to go
    const currentOrLastWeight = !isNaN(currentWeekAverage) ? currentWeekAverage : (sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1].value : NaN);
    const target = weightsTrackedData.goal;

    let weeksToGo = 0;
    if (!isNaN(currentOrLastWeight) && !isNaN(target) && currentOrLastWeight > target && rate > 0) {
      weeksToGo = Math.ceil(Math.log(target / currentOrLastWeight) / Math.log(1 - rate));
    }

    // Kg left to target of the week
    const diffToTarget = (!isNaN(currentWeekAverage) && !isNaN(targetWeekAvg)) ? (currentWeekAverage - targetWeekAvg) : NaN;
    const displayDiffToTarget = isNaN(diffToTarget) ? '-' : Number(Math.abs(diffToTarget).toFixed(2));
    const isTargetReached = !isNaN(diffToTarget) && diffToTarget <= 0;

    // Kg diff from last week's average
    const sortedWeeklyWeights = [...weeklyWeights].sort((a, b) => {
      const maxA = a.weights?.length ? Math.max(...a.weights.map(w => w.timestamp.valueOf())) : 0;
      const maxB = b.weights?.length ? Math.max(...b.weights.map(w => w.timestamp.valueOf())) : 0;
      return maxB - maxA;
    });
    
    const lastWeekObj = sortedWeeklyWeights.find(w => w.week !== getWeek(new Date()));
    const lastWeekAverage = lastWeekObj ? getAverage(lastWeekObj.weights.map(item => item.value), 2) : NaN;
    const diffFromLastWeek = (!isNaN(currentWeekAverage) && !isNaN(lastWeekAverage)) ? (currentWeekAverage - lastWeekAverage) : NaN;
    
    const displayDiffFromLastWeek = isNaN(diffFromLastWeek) 
      ? '-' 
      : diffFromLastWeek > 0 
        ? `+${Number(diffFromLastWeek.toFixed(2))}` 
        : `${Number(diffFromLastWeek.toFixed(2))}`;

    return {
      displayTargetWeekAvg,
      weeksToGo,
      displayDiffToTarget,
      displayDiffFromLastWeek,
      isTargetReached,
    };
  }, [weightsTrackedData, weeklyWeights, currentWeekAverage]);
}
