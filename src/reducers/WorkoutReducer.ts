import { Workout } from "src/models/Workout";

export enum WorkoutActionType {
    ADD_WORKOUT = "ADD_WORKOUT",
    UPDATE_WORKOUT = "UPDATE_WORKOUT",
    DELETE_WORKOUT = "DELETE_WORKOUT",
}

export interface WorkoutAction {
    type: WorkoutActionType,
    payload: Workout
};

export default function workoutReducer(state: Workout[], action: WorkoutAction) {
    switch (action.type) {
        case WorkoutActionType.ADD_WORKOUT:
            state = [...state, action.payload];
            return state;
        case WorkoutActionType.UPDATE_WORKOUT:
            const updatedWorkoutIndex = state.findIndex(({id}) => action.payload.id === id);
            state[updatedWorkoutIndex] = action.payload;
            return [...state];
        case WorkoutActionType.DELETE_WORKOUT:
            state = state.filter(({id}) => id !== action.payload.id);
            return state;
        default:
            return state;
    }
}