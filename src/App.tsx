import { CalendarViewWeekOutlined, FitnessCenterOutlined, HomeOutlined } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Workout } from 'src/models/Workout';
import { DEFAULT_PLANS } from './data.default';
import { TEST_PLANS, TEST_WORKOUTS } from './data.mock';
import useStoredReducer from './hooks/useStoredReducer';
import { Plan } from './models/Plan';
import Home from './pages/Home';
import { WorkoutList } from './pages/WorkoutList';
import WorkoutPlanner from './pages/WorkoutPlanner';
import planReducer, { PlanActionType } from './reducers/PlanReducer';
import workoutReducer, { WorkoutAction, WorkoutActionType } from './reducers/WorkoutReducer';

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

const DATA_VERSION = '1.0'
const INITIAL_WORKOUTS = import.meta.env.DEV ? TEST_WORKOUTS : DEFAULT_PLANS;
const INITIAL_PLANS = import.meta.env.DEV ? TEST_PLANS : [];

function App() {
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.Home);

  const [workoutsList, workoutDispatch] = useStoredReducer(
    `WORKOUT_${DATA_VERSION}`,
    workoutReducer,
    INITIAL_WORKOUTS,
    (state) => ({ type: WorkoutActionType.INIT_WORKOUT, payload: state })
  );
  const [plansList, planDispatch] = useStoredReducer(
    `WORKOUT_PLAN_${DATA_VERSION}`,
    planReducer,
    INITIAL_PLANS,
    (state) => ({ type: PlanActionType.INIT_PLAN, payload: state })
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Helmet>
        <base href={import.meta.env.DEV ? '/' : 'https://infantajayvenus.github.io/GymBooku/'} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>GymBooku</title>
        <meta name="description" content="A web app that helps keep track of our work out progress and helps us through a transformation journey." />
        <link rel="icon" href="/calendar.ico" />
        <link rel="apple-touch-icon" href="/calendar.png" sizes="180x180" />
        <link rel="mask-icon" href="/calendar.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>

      <main>
        {currentPage === Pages.Home &&
          <Home
            workoutsList={workoutsList}
            plansList={plansList}
            onDelete={(deletedWorkout: Workout) => {
              workoutDispatch({ type: WorkoutActionType.DELETE_WORKOUT, payload: [deletedWorkout] })
            }}
            onUpdate={(updatedWorkout: Workout) => {
              workoutDispatch({ type: WorkoutActionType.UPDATE_WORKOUT, payload: [updatedWorkout] })
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
