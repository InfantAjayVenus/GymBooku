# Codebase View

## High-Level Architecture
This project is a single-page web application (monolith) built with React and bundled with Vite. It is a client-only application that stores data locally in the browser (IndexedDB via idb-keyval). There are no separate backend services in this repository.

## Mapping Code to the User Journey
- App shell / routing: src/main.tsx and src/App.tsx provide the application bootstrap and routing between pages.
- Home / Dashboard: src/pages/Home.tsx shows the main dashboard and aggregate widgets (streak, charts).
- Workout management (Add/Edit/Delete): src/components/WorkoutForm.tsx and src/components/WorkoutList.tsx handle creating, editing and listing workouts; state is managed by reducers in src/reducers/WorkoutReducer.ts.
- Workout tracking (recording workout sessions): src/components/WorkoutTrackCard.tsx and reducers/WorkoutTrackReducer.ts manage recording and storing workout records.
- Workout planning: src/pages/WorkoutPlanner.tsx and src/components/PlanForm.tsx along with src/reducers/PlanReducer.ts manage plans and scheduled workouts.
- Weight tracking: src/pages/WeightTracker.tsx and src/reducers/WeightReducer.ts handle weight logs and related visualizations.
- Shared models and utils: src/models (Plan, Workout, WorkoutRecord, etc.) define types and data shapes; src/utils contains small helpers (getToday, getWeek, getRandomId, etc.).
- Persistence and hooks: custom hooks in src/hooks (useStoredReducer.ts, usePlannedWorkoutsList.ts, useLatestTrackData.ts) coordinate state with IndexedDB and local storage.

## Starting Points
1. src/App.tsx and src/main.tsx - app bootstrap, routing and high-level composition.
2. src/reducers and src/hooks - core application state management and persistence glue (start with useStoredReducer.ts and WorkoutReducer.ts).
3. src/components and src/pages - UI components that implement the user flows: Workouts, Tracking, Planner and Weight pages.

*Notes*: This is a client-only monolith for local-first usage. To understand core logic, trace how useStoredReducer hooks into reducers and how components dispatch actions to those reducers.
