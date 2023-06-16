import { WorkoutTrackCollection, WorkoutTrackRecord } from "src/models/WorkoutRecord";

export enum WorkoutRecordActionType {
    INIT_WORKOUT_RECORD = "INIT_WORKOUT_RECORD",
    ADD_WORKOUT_RECORD = "ADD_WORKOUT_RECORD",
    UPDATE_WORKOUT_RECORD = "UPDATE_WORKOUT_RECORD",
    UPSERT_WORKOUT_RECORD = "UPSERT_WORKOUT_RECORD",
    DELETE_WORKOUT_RECORD = "DELETE_WORKOUT_RECORD",
}

export interface WorkoutRecordAction {
    type: WorkoutRecordActionType,
    payload: WorkoutTrackCollection[],
};

export default function workoutRecordReducer(state: WorkoutTrackCollection[], action: WorkoutRecordAction) {
    switch (action.type) {
        case WorkoutRecordActionType.INIT_WORKOUT_RECORD: {
            const restoredState = action.payload.map(stateItem => {
                if('id' in stateItem) return stateItem;
                const rawJson = JSON.parse(JSON.stringify(stateItem));
                return new WorkoutTrackCollection(rawJson._workout,rawJson._trackedData.map((data:any) => new WorkoutTrackRecord({time: data._time, count: data._count, weight: data._weight}, data._id, new Date(data._timestamp))), rawJson._id, new Date(rawJson._timestamp));
            })

            return restoredState;
        }
        case WorkoutRecordActionType.ADD_WORKOUT_RECORD: {
            state = [...state, ...action.payload];
            return state;
        }
        case WorkoutRecordActionType.UPDATE_WORKOUT_RECORD: {
            action.payload.forEach(recordItem => {
                const updatedWorkoutTrackIndex = state.findIndex(({id}) => recordItem.id === id);
                updatedWorkoutTrackIndex && (state[updatedWorkoutTrackIndex] = recordItem);
            })
            
            return [...state];
        }
        case WorkoutRecordActionType.UPSERT_WORKOUT_RECORD: {
            action.payload.forEach(recordItem => {
                const updatedWorkoutTrackIndex = state.findIndex(({id}) => recordItem.id === id);

                state[updatedWorkoutTrackIndex >= 0 ? updatedWorkoutTrackIndex : state.length] = recordItem;
            })
            
            return [...state];
        }
        case WorkoutRecordActionType.DELETE_WORKOUT_RECORD: {
            state = state.filter(({id}) => !action.payload.some((deleteItem) => deleteItem.id === id));
            return state;
        }
        default:
            return state;
    }
}