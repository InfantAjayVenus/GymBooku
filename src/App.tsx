import { CalendarViewWeekOutlined, FitnessCenterOutlined, HomeOutlined } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Workout } from 'src/models/Workout';
import useStoredReducer from './hooks/useStoredReducer';
import { Plan } from './models/Plan';
import Home from './pages/Home';
import { WorkoutList } from './pages/WorkoutList';
import WorkoutPlanner from './pages/WorkoutPlanner';
import planReducer, { PlanActionType } from './reducers/PlanReducer';
import workoutReducer, { WorkoutAction, WorkoutActionType } from './reducers/WorkoutReducer';
import workoutRecordReducer, { WorkoutRecordActionType } from './reducers/WorkoutTrackReducer';
import getCurrentDay from './utils/getCurrentDay';
import { ID } from './utils/getRandomId';
import isTimestampToday from './utils/isTimestampToday';
import { TEST_PLANS, TEST_TRACKED_COLLECTION, TEST_WORKOUTS } from './data.mock';
import useStreakData from './hooks/useStreakData';
import useLatestTrackData from './hooks/useLatestTrackData';
import { WorkoutTrackCollection } from './models/WorkoutRecord';
import { DEFAULT_PLANS } from './data.default';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

enum Pages {
  Home,
  Plans,
  Workouts,
}

const INITIAL_WORKOUTS = import.meta.env.DEV ? TEST_WORKOUTS : DEFAULT_PLANS;
const INITIAL_PLANS = import.meta.env.DEV ? TEST_PLANS : [];
const INITIAL_TRACK_COLLECTIONS = import.meta.env.DEV ? TEST_TRACKED_COLLECTION : [];

function App() {
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.Home);
  const [currentDayWorkoutsList, setCurrentDayWorkoutsList] = useState<Workout[]>([]);
  const [workoutRecordedToday, setWorkoutRecordedToday] = useState<WorkoutTrackCollection[]>([])

  const [workoutsList, workoutDispatch] = useStoredReducer(
    "WORKOUT", 
    workoutReducer, 
    INITIAL_WORKOUTS, 
    (state) => ({ type: WorkoutActionType.INIT_WORKOUT, payload: state })
  );
  const [plansList, planDispatch] = useStoredReducer(
    "WORKOUT_PLAN", 
    planReducer, 
    INITIAL_PLANS, 
    (state) => ({type: PlanActionType.INIT_PLAN, payload: state})
  )
  const [workoutRecordList, workoutRecordDispatch] = useStoredReducer(
    "WORKOUT_TRACKING_DATA", 
    workoutRecordReducer, 
    INITIAL_TRACK_COLLECTIONS, 
    (state) => ({type: WorkoutRecordActionType.INIT_WORKOUT_RECORD, payload: state})
  );

  const streakData = useStreakData(workoutRecordList);
  const pairedRecordList = useLatestTrackData(workoutRecordedToday)

  useEffect(() => {
    const currentDay = getCurrentDay();
    const currentDayPlans = plansList.filter(({ daysList }) => daysList.includes(currentDay));
    const currentDayWorkouts = Array.from(new Set([
      ...(currentDayPlans.reduce(
        (list, { workoutsList }) => [...list, ...workoutsList],
        [] as ID[]
      )),
      ...workoutRecordList.filter(item => isTimestampToday(item.timestamp)).map(item => item.workout)
      ])).reduce((workoutList, workoutId) => {
      const workout = workoutsList.find(({id}) => id === workoutId);
      workout && (workoutList.push(workout));

      return workoutList;
    }, [] as Workout[]);

    setCurrentDayWorkoutsList(currentDayWorkouts);
  }, [plansList]);

  useEffect(() => {
    const workoutsRecordedToday = workoutRecordList.filter(({workout}) => currentDayWorkoutsList.some(({id}) => id === workout));
    const workoutsNotRecordedYet = currentDayWorkoutsList
        .filter(({id}) => !workoutsRecordedToday.some(({workout}) => workout === id))
        .map(workoutItem => new WorkoutTrackCollection(workoutItem.id));
    setWorkoutRecordedToday([...workoutsRecordedToday, ...workoutsNotRecordedYet]);
  }, [currentDayWorkoutsList])


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <main>
        {currentPage === Pages.Home &&
          <Home
            allWorkoutsList={workoutsList}
            streakData={streakData}
            trackedWorkoutData={pairedRecordList}
            onAdd={(savedWorkoutRecordCollection) => {
              const currentWorkout = workoutsList.find(({id}) => id === savedWorkoutRecordCollection.workout);
              if(!currentWorkout || !savedWorkoutRecordCollection.trackedData.every(data => data.hasAllRequiredValues(currentWorkout.trackingValues))) return;

              workoutRecordDispatch({ type: WorkoutRecordActionType.ADD_WORKOUT_RECORD, payload: [savedWorkoutRecordCollection] })
            }}
            onUpdate={(savedWorkoutRecordCollection) => {
              const currentWorkout = workoutsList.find(({id}) => id === savedWorkoutRecordCollection.workout);
              if(!currentWorkout || !savedWorkoutRecordCollection.trackedData.every(data => data.hasAllRequiredValues(currentWorkout.trackingValues))) return;
              
              workoutRecordDispatch({ type: WorkoutRecordActionType.UPSERT_WORKOUT_RECORD, payload: [savedWorkoutRecordCollection] })
            }}
            onAddTrackedWorkout={(workout) => {
              setCurrentDayWorkoutsList([...currentDayWorkoutsList, workout]);
            }}
          />
        }
        {currentPage === Pages.Plans &&
          <WorkoutPlanner
            values={plansList}
            workoutsList={workoutsList}
            onAdd={(savedPlan: Plan) => {
              planDispatch({ type: PlanActionType.ADD_PLAN, payload: [savedPlan] });
            }}
            onDelete={(deletedPlan: Plan) => {
              planDispatch({ type: PlanActionType.DELETE_PLAN, payload: [deletedPlan] });
            }}
            onUpdate={(updatedPlan: Plan) => {
              planDispatch({ type: PlanActionType.UPDATE_PLAN, payload: [updatedPlan] });
            }}
          />
        }
        {currentPage === Pages.Workouts &&
          <WorkoutList
            onAdd={(savedWorkout: Workout) => {
              workoutDispatch({ type: WorkoutActionType.ADD_WORKOUT, payload: [savedWorkout] } as WorkoutAction)
            }}
            onDelete={(deletedWorkout: Workout) => {
              workoutDispatch({ type: WorkoutActionType.DELETE_WORKOUT, payload: [deletedWorkout] })
            }}
            onUpdate={(updatedWorkout: Workout) => {
              workoutDispatch({ type: WorkoutActionType.UPDATE_WORKOUT, payload: [updatedWorkout] })
            }}
            values={workoutsList}
          />
        }
      </main>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={currentPage}
          onChange={(_, newValue) => {
            setCurrentPage(newValue as Pages);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeOutlined />} />
          <BottomNavigationAction label="Plans" icon={<CalendarViewWeekOutlined />} />
          <BottomNavigationAction label="Workouts" icon={<FitnessCenterOutlined />} />
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
