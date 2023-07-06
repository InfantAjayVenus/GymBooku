import { useEffect, useState } from "react";
import { Plan } from "src/models/Plan";
import { Workout } from "src/models/Workout";
import { WorkoutTrackCollection } from "src/models/WorkoutRecord";
import { ID } from "src/utils/getRandomId";
import getToday from "src/utils/getToday";
import isTimestampToday from "src/utils/isTimestampToday";

export default function usePlannedWorkoutRecords(workoutsList: Workout[], plansList: Plan[], workoutRecordsList: WorkoutTrackCollection[]): WorkoutTrackCollection[] {
    const [plannedWorkoutRecords, setPlannedWorkoutRecords] = useState<WorkoutTrackCollection[]>([])
    
    useEffect(() => {
        const today = getToday();
        const todayPlans = plansList.filter(planItem => planItem.hasDay(today));
        const previouslyTrackedToday = workoutRecordsList.filter(({timestamp}) => isTimestampToday(timestamp)); 
        const todayWorkouts = todayPlans
            .reduce(    //Collect all unique Workout ID that are planned for today
                (workoutsCollection, planItem) => ([...workoutsCollection, ...planItem.workoutsList.filter(workoutId => !workoutsCollection.includes(workoutId))]), 
                [] as ID[]
            ).map(workoutId => workoutsList.find(({id}) => id === workoutId)) // map all the collected workout IDs to workout Objects
            .filter((workoutItem): workoutItem is Workout => !!workoutItem) // filter elements that were not found
            .filter(workoutItem => !previouslyTrackedToday.some(({workout}) => workout === workoutItem?.id))    // filter workouts that were already tracked
            .map(workoutItem => workoutItem && new WorkoutTrackCollection(workoutItem?.id))
            .filter(workoutTrackItem => !!workoutTrackItem);
            
        setPlannedWorkoutRecords([...previouslyTrackedToday, ...todayWorkouts]);
    }, [workoutsList, plansList])

    return plannedWorkoutRecords;
}