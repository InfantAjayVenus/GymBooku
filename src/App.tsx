import { CalendarViewWeekOutlined, FitnessCenterOutlined, HomeOutlined, MonitorWeightOutlined } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Fade, Paper, Stack, Unstable_TrapFocus as TrapFocus, Typography, useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { TEST_WEIGHTS } from './data.mock';
import useDrawer from './hooks/useDrawer';
import useStoredReducer from './hooks/useStoredReducer';
import { WeightCollection } from './models/WeightCollection';
import Home from './pages/Home';
import WeightTracker from './pages/WeightTracker';
import { WorkoutList } from './pages/WorkoutList';
import WorkoutPlanner from './pages/WorkoutPlanner';
import PlanProvider from './providers/PlanProvider';
import WorkoutProvider from './providers/WorkoutProvider';
import weightReducer, { WeightReducerActionType } from './reducers/WeightReducer';
import SessionProvider from './providers/SessionProvider';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

enum Pages {
  Home,
  Plans,
  Workouts,
  Weight,
}

const DATA_VERSION = '1.0'
const INITIAL_WEIGHT = import.meta.env.DEV ? TEST_WEIGHTS : new WeightCollection();

function App() {
  const breakPoint = useMediaQuery(darkTheme.breakpoints.up('md'));
  const banner = useDrawer(true);
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.Home);

  const [weightCollection, weightDispatch] = useStoredReducer(
    `WEIGHT_${DATA_VERSION}`,
    weightReducer,
    INITIAL_WEIGHT,
    (state) => ({ type: WeightReducerActionType.INIT_WEIGHT, payload: state })
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
      <TrapFocus open={banner.isOpen && breakPoint} disableAutoFocus disableEnforceFocus>
        <Fade appear={false} in={breakPoint}>
          <Paper
            role="dialog"
            square
            tabIndex={-1}
            sx={{
              display: 'block',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              m: 0,
              p: 2,
              borderWidth: 0,
              borderTopWidth: 1,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              gap={2}
            >
              <Box
                sx={{
                  flexShrink: 1,
                  alignSelf: { xs: 'flex-start', sm: 'center' },
                }}
              >
                <Typography fontWeight="bold">This App is designed to suit mobile view and may not be best viewed in Desktop.</Typography>
              </Box>
              <Stack
                gap={2}
                direction={{
                  xs: 'row-reverse',
                  sm: 'row',
                }}
                sx={{
                  flexShrink: 0,
                  alignSelf: { xs: 'flex-end', sm: 'center' },
                }}
              >
                <Button size="small" onClick={banner.close} variant="contained">Okay</Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      </TrapFocus>
      <main>
        <WorkoutProvider>
          <PlanProvider>
            <SessionProvider>
              {currentPage === Pages.Home &&
                <Home />
              }
            </SessionProvider>
            {currentPage === Pages.Plans &&
              <WorkoutPlanner />
            }
          </PlanProvider>
          {currentPage === Pages.Workouts &&
            <WorkoutList />
          }
        </WorkoutProvider>
        {
          currentPage === Pages.Weight &&
          <WeightTracker
            weightsTrackedData={weightCollection}
            updateWeightsTrackedData={(updatedWeightCollection: WeightCollection) => {
              weightDispatch({ type: WeightReducerActionType.UPDATE_WEIGHT, payload: updatedWeightCollection })
            }}
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
          <BottomNavigationAction label="Weight" icon={<MonitorWeightOutlined />} />
        </BottomNavigation>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
