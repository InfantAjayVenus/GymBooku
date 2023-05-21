import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useReducer } from 'react';
import { TrackingValues, Workout } from 'src/models/Workout';
import { WorkoutList } from './pages/WorkoutList';
import workoutReducer, { WorkoutAction, WorkoutActionType } from './reducers/WorkoutReducer';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});



function App() {
  const [workoutList, dispatch] = useReducer(workoutReducer, [
    new Workout('Push Ups', [TrackingValues.COUNT]),
    new Workout('Pull Ups', [TrackingValues.COUNT]),
    new Workout('Machine Fly', [TrackingValues.COUNT, TrackingValues.WEIGHT]),
    new Workout('Reverse Delt Fly', [TrackingValues.COUNT, TrackingValues.WEIGHT]),
  ] as Workout[]);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <WorkoutList
        onAdd={(savedWorkout: Workout) => {
          dispatch({ type: WorkoutActionType.ADD_WORKOUT, payload: savedWorkout } as WorkoutAction)
        }}
        onDelete={(deletedWorkout: Workout) => {
          dispatch({type: WorkoutActionType.DELETE_WORKOUT, payload: deletedWorkout})
        }}
        onUpdate={(updatedWorkout: Workout) => {
          dispatch({type: WorkoutActionType.UPDATE_WORKOUT, payload: updatedWorkout})
        }}
        values={workoutList}
      />
    </ThemeProvider>
  );
}

export default App;
