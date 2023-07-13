import { useEffect, useState } from "react";
import { WorkoutTrackCollection } from "src/models/WorkoutRecord";
import { ID } from "src/utils/getRandomId";
import isTimestampToday from "src/utils/isTimestampToday";

interface WorkoutTrackDataTimeStamped {
    sortedByTimeDesc: WorkoutTrackCollection[];
    previouslyTrackedData: WorkoutTrackCollection | null;
    todayTrackedData: WorkoutTrackCollection | null
}

export default function useLabeledWorkoutData(workoutTrackData: WorkoutTrackCollection[], workoutId: ID | null) {
    const [sortedTrackData, setSortedTrackData] = useState<WorkoutTrackDataTimeStamped>();

    useEffect(() => {
        const sortedByTimeDesc = workoutTrackData
            .filter(({workout}) => workout === workoutId)
            .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf());
        const previouslyTrackedData = sortedByTimeDesc.find(item => !isTimestampToday(item.timestamp)) || null;
        const todayTrackedData = sortedByTimeDesc.find(item => isTimestampToday(item.timestamp)) || null;

        workoutId && setSortedTrackData({
            sortedByTimeDesc,
            previouslyTrackedData,
            todayTrackedData,
        } as WorkoutTrackDataTimeStamped)
    }, [workoutTrackData])

    return sortedTrackData;
}