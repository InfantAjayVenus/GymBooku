import { Workout } from "src/models/Workout";

export enum WorkoutActionType {
  INIT_WORKOUT = "INIT_WORKOUT",
  ADD_WORKOUT = "ADD_WORKOUT",
  UPDATE_WORKOUT = "UPDATE_WORKOUT",
  DELETE_WORKOUT = "DELETE_WORKOUT",
}

export interface WorkoutAction {
  type: WorkoutActionType,
  payload: Workout[]
};

export default function workoutReducer(state: Workout[], action: WorkoutAction) {
  switch (action.type) {
    case WorkoutActionType.INIT_WORKOUT:
      const restoreState = action.payload.map(stateItem => {
        if ('id' in stateItem) return stateItem;

        const rawJSON = JSON.parse(JSON.stringify(stateItem));
        return Workout.fromJSON(rawJSON);
      })

      return restoreState;
    case WorkoutActionType.ADD_WORKOUT:
      state = [...state, ...action.payload];
      return state;
    case WorkoutActionType.UPDATE_WORKOUT:
      action.payload.forEach(updateItem => {
        const updatedWorkoutIndex = state.findIndex(({ id }) => updateItem.id === id);
        state[updatedWorkoutIndex] = updateItem;
      })
      return [...state];
    case WorkoutActionType.DELETE_WORKOUT:
      state = state.filter(({ id }) => !action.payload.some(deleteItem => deleteItem.id === id));
      return state;
    default:
      return state;
  }
}
