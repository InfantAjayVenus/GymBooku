import { useEffect, useState } from "react";
import { Plan } from "src/models/Plan";
import { Workout } from "src/models/Workout";
import { ID } from "src/utils/getRandomId";
import getToday from "src/utils/getEnumDay";

export default function usePlannedWorkoutsList(workoutsList: Workout[], plansList: Plan[]): Workout[] {
    const [plannedWorkoutsList, setPlannedWorkoutsList] = useState<Workout[]>([])
    
    useEffect(() => {
        const today = getToday();
        
        const todayWorkouts = plansList
            .filter(planItem => planItem.hasDay(today)) //filter plans for today
            .reduce((previouslyTrackedToday, planItem) => {
                return [...previouslyTrackedToday, ...planItem.workoutsList.filter(workoutItem => !previouslyTrackedToday.includes(workoutItem))];
            }, [] as ID[]) // collect all the workouts for today
            .map(workout => workoutsList.find(workoutItem => workoutItem.id === workout)) // map the collected workout IDs to workout Object
            .filter(workout => workout !== undefined); // remove undefined
        
            
        setPlannedWorkoutsList(todayWorkouts as Workout[]);
    }, [workoutsList, plansList])

    return plannedWorkoutsList;
}