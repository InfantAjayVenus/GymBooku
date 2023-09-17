import { useEffect, useState } from "react";
import { Weight } from "src/models/WeightCollection";
import getWeek from "src/utils/getWeek";

export interface WeeklyWeights {
  week: number;
  weights: Weight[];
}

export default function useWeeklyWeightTrackedData(weightsList: Weight[]): WeeklyWeights[] {
  const [weeklyWeights, setWeeklyWeights] = useState<any>([]);

  useEffect(() => {
    const weekMappedWeights = Object.entries(weightsList.reduce((accumulate: any, weightItem) => {
      const week = getWeek(weightItem.timestamp);
      if (!accumulate[week]) {
        accumulate[week] = [];
      }

      accumulate[week].push(weightItem);

      return { ...accumulate };
    }, {})).map(([week, weightsList]) => ({ week: Number(week), weights: weightsList }))
    setWeeklyWeights(weekMappedWeights);
  }, [weightsList])

  return weeklyWeights;
}
