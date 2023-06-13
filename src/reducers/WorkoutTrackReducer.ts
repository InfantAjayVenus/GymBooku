import { WorkoutTrackCollection } from "src/models/WorkoutRecord";

export enum WorkoutRecordActionType {
    ADD_WORKOUT_RECORD = "ADD_WORKOUT_RECORD",
    UPDATE_WORKOUT_RECORD = "UPDATE_WORKOUT_RECORD",
    UPSERT_WORKOUT_RECORD = "UPSERT_WORKOUT_RECORD",
    DELETE_WORKOUT_RECORD = "DELETE_WORKOUT_RECORD",
}

export interface WorkoutRecordAction {
    type: WorkoutRecordActionType,
    payload: WorkoutTrackCollection
};

export default function workoutRecordReducer(state: WorkoutTrackCollection[], action: WorkoutRecordAction) {
    switch (action.type) {
        case WorkoutRecordActionType.ADD_WORKOUT_RECORD: {
            state = [...state, action.payload];
            return state;
        }
        case WorkoutRecordActionType.UPDATE_WORKOUT_RECORD: {
            const updatedWorkoutTrackIndex = state.findIndex(({id}) => action.payload.id === id);
            updatedWorkoutTrackIndex && (state[updatedWorkoutTrackIndex] = action.payload);
            return [...state];
        }
        case WorkoutRecordActionType.UPSERT_WORKOUT_RECORD: {
            const updatedWorkoutTrackIndex = state.findIndex(({id}) => action.payload.id === id);

            state[updatedWorkoutTrackIndex >= 0 ? updatedWorkoutTrackIndex : state.length] = action.payload;
            return [...state];
        }
        case WorkoutRecordActionType.DELETE_WORKOUT_RECORD: {
            state = state.filter(({id}) => id !== action.payload.id);
            return state;
        }
        default:
            return state;
    }
}