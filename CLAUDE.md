# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (loads mock data automatically)
npm run build     # tsc + vite build (TypeScript errors block the build)
npm run lint      # ESLint with --max-warnings 0 (zero tolerance)
npm run preview   # Preview the production build locally
```

There is no test suite. Verification is done manually via the dev server.

## Architecture

**GymBooku** is a client-only, local-first PWA (Progressive Web App). There is no backend — all data lives in the browser's IndexedDB via `idb-keyval`.

### State & Persistence: `useStoredReducer`

The core pattern is a custom hook `src/hooks/useStoredReducer.ts` that wraps React's `useReducer` and automatically syncs state to IndexedDB. Every reducer has a versioned storage key:

```
WORKOUT_1.0.1       → WorkoutReducer
WORKOUT_PLAN_1.0.1  → PlanReducer
WEIGHT_1.0.1        → WeightReducer
```

**Warning:** Changing a storage key version causes that data slice to reset for all users — it acts as a migration strategy that discards old data.

On app load, each reducer receives an `INIT` action with the persisted data, which reconstructs class instances from plain JSON. This deserialization step is required because IndexedDB stores plain objects, not class instances.

### Routing

There is no React Router. Navigation is enum-based page-switching in `src/App.tsx` via MUI's `BottomNavigation`. Pages: `Home`, `Plans`, `Workouts`, `Weight`.

### Data Models

Models in `src/models/` are class-based (not plain interfaces). They use getters/setters and require explicit reconstruction after deserialization. When adding a new model field, make sure the reducer's `INIT` action correctly reconstructs instances with the new field.

### Dev vs. Production Data

`src/data.mock.ts` is loaded when `import.meta.env.DEV` is true, prepopulating the app with workout/plan data. Production uses `src/data.default.ts` (empty state).

### Path Aliases

`src/*` is aliased to `./src/*` in both `vite.config.ts` and `tsconfig.json`. Use `src/` prefix for all internal imports.

### Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root: initializes all reducers, owns all dispatch callbacks, handles routing |
| `src/hooks/useStoredReducer.ts` | The persistence glue — understand this before touching reducers |
| `src/reducers/WorkoutReducer.ts` | Primary reducer; shows the INIT deserialization pattern |
| `src/components/SetTrackCard.tsx` | Most complex UI component; handles per-set workout tracking with debounced input |
