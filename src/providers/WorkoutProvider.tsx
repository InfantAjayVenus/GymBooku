import { ReactNode, createContext } from "react";
import { DEFAULT_PLANS } from "src/data.default";
import { TEST_WORKOUTS } from "src/data.mock";
import useStoredReducer from "src/hooks/useStoredReducer";
import { Workout } from "src/models/Workout";
import workoutReducer, { WorkoutActionType } from "src/reducers/WorkoutReducer";

const WORKOUT_VERSION = "1.0";
const INITIAL_WORKOUTS = import.meta.env.DEV ? TEST_WORKOUTS : DEFAULT_PLANS;

type WorkoutEventType = (workout: Workout) => void;
interface WorkoutContextType {
    workoutsList: Workout[];
    addWorkout: WorkoutEventType;
    deleteWorkout: WorkoutEventType;
    updateWorkout: WorkoutEventType;
}

export const WorkoutContext = createContext<WorkoutContextType>({
    workoutsList: [] as Workout[],
    addWorkout: (_: Workout) => { },
    deleteWorkout: (_: Workout) => { },
    updateWorkout: (_: Workout) => { },
});

export default function WorkoutProvider({ children }: { children: ReactNode }) {

    const [workoutsList, workoutDispatch] = useStoredReducer(
        `WORKOUT_${WORKOUT_VERSION}`,
        workoutReducer,
        INITIAL_WORKOUTS,
        (state) => ({ type: WorkoutActionType.INIT_WORKOUT, payload: state })
    );
    return (
        <WorkoutContext.Provider
            value={{
                workoutsList,
                addWorkout: (workout: Workout) => workoutDispatch({ type: WorkoutActionType.ADD_WORKOUT, payload: [workout] }),
                deleteWorkout: (workout: Workout) => workoutDispatch({ type: WorkoutActionType.DELETE_WORKOUT, payload: [workout] }),
                updateWorkout: (workout: Workout) => workoutDispatch({ type: WorkoutActionType.UPDATE_WORKOUT, payload: [workout] }),
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}