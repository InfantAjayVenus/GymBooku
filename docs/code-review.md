# Codebase Review

**Project:** GymBooku (workout-tracker)
**Branch reviewed:** `dev` @ `df35277`
**Scope:** Full codebase — architecture, TypeScript usage, React patterns, performance, correctness, and maintainability.

---

## Summary

The codebase is a well-scoped, client-only PWA with a clean conceptual design. The `useStoredReducer` + IndexedDB persistence abstraction is a sound idea, the drag-and-drop component structure is clean, and TypeScript strictness settings are appropriately strong. However, there are several **bugs with user-visible effects**, pervasive misuse of TypeScript's boxed object types, React anti-patterns (stale closures, state mutation before dispatch), and dead code that should be resolved before the codebase grows further.

Findings are grouped by severity within each section.

---

## 1. Bugs & Correctness

### 1.1 `UPDATE_WORKOUT_RECORD` Silently Skips the First Set

**File:** `src/reducers/WorkoutTrackReducer.ts:50`

```ts
updatedWorkoutTrackIndex && (state[updatedWorkoutTrackIndex] = recordItem);
```

`Array.findIndex` returns `0` when the match is the first element. `0` is falsy in JavaScript, so the assignment is skipped entirely — the first set of a workout can never be updated.

**Reasoning:** This is the classic falsy-zero bug. `&&` short-circuits on `0` identically to how it would on `false`.

**Alternative:** Use `updatedWorkoutTrackIndex !== -1`, which is the semantically correct guard. `UPSERT_WORKOUT_RECORD` at line 58 already uses `>= 0` correctly — apply the same standard here.

---

### 1.2 `useBackButton` Leaks Listeners on Every Render

**File:** `src/hooks/useBackButton.ts:10–20`

```ts
useEffect(() => {
    window.addEventListener("popstate", (event: PopStateEvent) => { ... handleBack(event) });
    return () => { window.removeEventListener("popstate", handleBack); };
});  // no dependency array
```

Two bugs:
1. No dependency array means the effect runs after **every render**, adding a new anonymous listener each time.
2. The cleanup calls `removeEventListener(handleBack)`, but the registered listener is a different anonymous function — they are different references, so the listener is never removed.

**Reasoning:** `removeEventListener` only removes a listener if the function reference is identical to the one passed to `addEventListener`. Anonymous functions create new references each call.

**Alternative:** Capture the listener in a `useCallback` or `useRef`, pass that same reference to both `add` and `remove`, and add a dependency array. Example:

```ts
const handler = useCallback((event: PopStateEvent) => { ... handleBack(event) }, [handleBack]);
useEffect(() => {
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
}, [handler]);
```

---

### 1.3 `getDeepCleanedObject` Throws on `null` Fields

**File:** `src/hooks/useStoredReducer.ts:35–51`

```ts
if (typeof object !== 'object') return object;
// null check is missing — typeof null === 'object'
```

If any field in the state tree is `null` (e.g., an optional model field), the function reaches `Object.fromEntries(Object.entries(null))`, which throws a `TypeError`. This would crash the IDB write silently (caught in `.catch`) and the data would be lost on next reload.

**Reasoning:** `typeof null === 'object'` is a well-known JavaScript quirk. Every function processing `object` types needs an explicit `null` guard.

**Alternative:** Add `if (object === null) return object;` as the first check in the function, before all others.

---

### 1.4 State Is Mutated Before Being Dispatched

**File:** `src/pages/Home/index.tsx:126–136`

```ts
// Mutates live state before dispatch:
selectedWorkout.workoutTrackData.push(updatedWorkoutTrackCollection);
onUpdate(Workout.copyFrom(selectedWorkout));

// And in onDelete:
selectedWorkout.workoutTrackData = selectedWorkout.workoutTrackData.filter(...)
onUpdate(Workout.copyFrom(Workout.copyFrom(selectedWorkout)));  // double copyFrom is a patch
```

The same pattern exists in `WorkoutTrackCard.tsx:60–61` and `WeightTracker.tsx`.

**Reasoning:** React reducers assume state is immutable between dispatches. Mutating the live state object before dispatching means the reducer receives an already-modified reference. The double `Workout.copyFrom(Workout.copyFrom(...))` call suggests this was discovered as a bug and worked around rather than fixed at the root.

**Alternative:** Always create the new data structure first, then dispatch. Never call `.push()`, `.pop()`, or direct property assignment on an object that came from reducer state:

```ts
const updatedWorkout = Workout.copyFrom(selectedWorkout);
updatedWorkout.workoutTrackData = [...selectedWorkout.workoutTrackData, updatedWorkoutTrackCollection];
onUpdate(updatedWorkout);
```

---

### 1.5 `WorkoutTrackerScreen`: `onClose` Fires on Mount

**File:** `src/pages/Home/WorkoutTrackerScreen.tsx:41–44`

```tsx
useEffect(() => {
    if (workoutTrackPage.isOpen) return;
    onClose();  // also fires when isOpen is initially false (on mount)
}, [workoutTrackPage.isOpen]);
```

On mount, `workoutTrackPage.isOpen` is `false`, so `onClose()` is called immediately. In the current app this is a no-op (it sets `null` to `null`), but it is a latent bug waiting to cause real issues if `onClose` ever gains side effects.

**Reasoning:** Effects should model transitions, not initial states. The effect currently triggers for both "closed from the start" and "transitioned to closed".

**Alternative:** Track the previous value:

```ts
const wasOpen = useRef(false);
useEffect(() => {
    if (!workoutTrackPage.isOpen && wasOpen.current) onClose();
    wasOpen.current = workoutTrackPage.isOpen;
}, [workoutTrackPage.isOpen]);
```

---

### 1.6 `StreakCard` Renders "undefined" in Loading State

**File:** `src/components/StreakCard.tsx:74`

```tsx
(weeklyStreak || new Array(7).fill(false)).map((streakItem, index) => (
    <Typography>{streakItem.day}</Typography>  // 'day' on false === undefined
))
```

When `weeklyStreak` is not yet populated, the fallback array of `false` values is used. Accessing `.day` on `false` returns `undefined`, rendering `<Typography>undefined</Typography>` for each skeleton day label.

**Reasoning:** `false` was chosen as a skeleton sentinel value but is not structurally compatible with the actual data shape, creating a type gap that the compiler misses.

**Alternative:** Use a typed skeleton sentinel instead:

```ts
const SKELETON_WEEK = Array(7).fill({ day: '', isInStreak: false, isToday: false });
(weeklyStreak ?? SKELETON_WEEK).map(...)
```

Or use a separate loading boolean flag and conditionally render a `<Skeleton>` entirely.

---

### 1.7 `getToday` Day Matching Is Locale-Dependent

**File:** `src/utils/getToday.ts:6–8`

```ts
const localeDay = localeToday.toDateString().split(' ')[0].toLowerCase(); // "mon", "tue"...
return Object.keys(DAYS_OF_WEEK).filter(day => day.toLowerCase().includes(localeDay)).shift() as DAYS_OF_WEEK
```

`toDateString()` returns locale-specific output in some environments (e.g., non-English OS locale). If the abbreviated day name is not an English 3-letter abbreviation, `filter` returns an empty array, `shift()` returns `undefined`, and the `as DAYS_OF_WEEK` cast masks it silently.

**Reasoning:** `toDateString()` output format is implementation-defined; the spec does not guarantee English output.

**Alternative:** Use `Date.getDay()` which always returns `0–6` (Sunday–Saturday) regardless of locale:

```ts
const dayIndex = new Date().getDay(); // 0 = Sunday
const days = Object.values(DAYS_OF_WEEK);
return days[dayIndex];
```

---

## 2. TypeScript Usage

### 2.1 Boxed `String` and `Number` Types Throughout Models

**Files:** `src/models/Workout.ts`, `src/models/WorkoutRecord.ts`, `src/models/Plan.ts`, `src/utils/getRandomId.ts`

```ts
// getRandomId.ts:1
export type ID = String;  // boxed object type, not primitive

// WorkoutRecord.ts:52–55
private _index: Number;
private _time?: Number;
private _count?: Number;
private _weight?: Number;
```

`String` and `Number` (capital letters) are boxed object wrapper types in TypeScript, not the primitive `string` and `number`. They are not interchangeable: `new String('a') === 'a'` is `false`. TypeScript accepts `String` as a type but it is almost never the right choice.

**Reasoning:** The bug is subtle — most operations appear to work because JS auto-unboxes primitives in most contexts, but strict equality, certain type guards, and third-party library integrations can break silently.

**Alternative:** Replace all instances of `String`, `Number`, and `Boolean` types with their lowercase primitive equivalents (`string`, `number`, `boolean`). Start with the `ID` type alias in `getRandomId.ts` as it propagates throughout the model layer.

---

### 2.2 `any` in Deserialization Paths

**Files:** `src/reducers/WorkoutReducer.ts:23–25`, `src/reducers/WeightReducer.ts:21`, `src/hooks/useWeeklyWeightTrackedData.ts:11,14`

All `INIT_*` reducer cases cast restored JSON to `any` before accessing private backing fields:

```ts
const rawJSON = JSON.parse(JSON.stringify(stateItem));
const restoredWorkoutTrackData = rawJSON._workoutTrackData.map((data: any) => ...)
```

A typo in `_workoutTrackData` would produce `undefined` silently; TypeScript cannot help here.

**Reasoning:** Deserialization is the most critical code path for data integrity. Using `any` is the highest-risk place to abandon type checking.

**Alternative:** Define typed raw JSON interfaces that mirror the serialized shape, then use `as RawWorkout` instead of `as any`. Even better: move deserialization into static `fromJSON(raw: RawWorkout)` factory methods on each model class, where types can be checked:

```ts
// models/Workout.ts
static fromJSON(raw: RawWorkout): Workout {
    return new Workout(raw._workoutName, raw._trackingValues, ...);
}
```

---

### 2.3 `StreakData.weeklyStreak` is a Tuple, Not an Array

**File:** `src/models/StreakData.ts:4`

```ts
weeklyStreak: [{day: string, isInStreak: boolean, isToday?: boolean}];
```

The type `[{...}]` is a TypeScript tuple with **exactly one element**, not an array of arbitrary length. A 7-element array is assigned to it and TypeScript accepts it due to structural subtyping, but the declared type is wrong.

**Alternative:** `{day: string, isInStreak: boolean, isToday?: boolean}[]`

---

### 2.4 `StreakData.nextMileStone` Is Not Optional But Can Be `undefined`

**File:** `src/models/StreakData.ts:5`, `src/hooks/useStreakData.ts:44`

```ts
// Interface: non-optional
nextMileStone: {level: number, streakCount: number};

// Assignment uses Array.find which returns T | undefined:
nextMileStone: streakMileStones.find(({streakCount}) => streakCount > currentStreak)
```

When the user's streak exceeds the highest milestone (365 days), `find` returns `undefined`. The interface lie is hidden by an `as StreakData` cast.

**Alternative:** Mark the field as optional (`nextMileStone?: ...`) and handle the `undefined` case in the render.

---

### 2.5 Unsafe Non-Null Assertions

**File:** `src/components/SetTrackCard.tsx:59`

```ts
const inputElements = inputContainerRef.current?.querySelectorAll(...);
inputElements![focussedInputIndex + 1]?.focus();
```

`inputContainerRef.current?.querySelectorAll(...)` returns `NodeListOf<...> | undefined`. The `!` assertion on the next line overrides the `undefined` case — if the ref is not mounted, this throws.

**Alternative:** Guard with `if (!inputElements) return;` before using `inputElements`.

---

## 3. React Patterns

### 3.1 Three Chained `useEffect`s for Derived State in `useStreakData`

**File:** `src/hooks/useStreakData.ts:15–46`

Three sequential effects, each setting state that triggers the next:

```
workoutsList → [render] → trackedData → [render] → trackedDatesList → [render] → streakData
```

This requires three render cycles after `workoutsList` changes before `streakData` is correct. The two intermediate values (`trackedData`, `trackedDatesList`) exist only as stepping stones.

**Reasoning:** `useEffect` + `setState` for derived state is an anti-pattern when the transformation is synchronous. It adds renders and produces briefly stale UI.

**Alternative:** Collapse all three into a single `useMemo` or a single `useEffect` with local variables:

```ts
const streakData = useMemo(() => {
    const trackedData = workoutsList.flatMap(w => w.workoutTrackData);
    const trackedDatesList = trackedData.map(tc => new Date(tc.timestamp));
    const { currentStreak, ... } = computeStreaks(trackedDatesList);
    return { currentStreak, nextMileStone: streakMileStones.find(...), weeklyStreak: ... };
}, [workoutsList]);
```

---

### 3.2 `useDrawer.toggle` Has a Stale Closure

**File:** `src/hooks/useDrawer.ts:14–16`

```ts
toggle: () => { setIsDrawerOpen(!isDrawerOpen); }
```

If `toggle` is called multiple times before a re-render, each call reads the same captured `isDrawerOpen` value from the closure and the state does not alternate correctly.

**Reasoning:** This is a standard React stale closure pitfall with state updaters.

**Alternative:** Use the functional updater form:

```ts
toggle: () => setIsDrawerOpen(prev => !prev)
```

---

### 3.3 `usePlannedWorkoutsList`: Unnecessary `useEffect + useState` for Derived State

**File:** `src/hooks/usePlannedWorkoutsList.ts:8–25`

The hook computes filtered workouts from props in a `useEffect`, stores the result in a `useState`, and returns it. This causes an extra render cycle each time `workoutsList` or `plansList` changes — the component briefly sees the stale list.

**Reasoning:** When derived state can be computed synchronously from existing state/props, `useEffect + useState` should not be used. It adds a render and a stale frame.

**Alternative:** Replace with `useMemo`:

```ts
const plannedWorkouts = useMemo(
    () => workoutsList.filter(w => plannedIds.has(w.id)),
    [workoutsList, plansList]
);
return plannedWorkouts;
```

---

### 3.4 Array Index Used as `key` Prop

**Files:** `src/pages/Home/WorkoutTrackerScreen.tsx:119`, `src/components/WorkoutTrackCard.tsx:56`, `src/pages/WorkoutPlanner.tsx:103`, `src/components/StreakCard.tsx:48`

```tsx
trackedData.map((_, index) => <SetTrackCard key={index} ... />)
```

Using array index as `key` causes React to reuse DOM nodes incorrectly when items are removed from the middle of the list. For workout sets (which can be added and removed), this can produce incorrect state in controlled inputs.

**Alternative:** Use stable unique IDs as keys. For sets in `WorkoutTrackCard`, the `WorkoutTrackRecord` has an `id` field — use `key={record.id}`.

---

### 3.5 `workoutIndex` in `Home` Is a Parallel Shadow Array

**File:** `src/pages/Home/index.tsx:38,48`

```ts
setWorkoutIndex(new Array(plannedWorkouts.length).fill(0).map((_, index) => index.toString()));
```

Instead of using actual `Workout.id` values as dnd-kit item identifiers, the code creates a parallel array of stringified numeric indices. Workout lookup then goes through `plannedWorkouts[Number(workoutItemIndex)]`.

**Reasoning:** If `plannedWorkouts` changes while a drag is in progress, the indices could reference the wrong workouts. The semantic meaning of the ID is lost.

**Alternative:** Use `workout.id` directly as the sortable item identifier:

```ts
setWorkoutIndex(plannedWorkouts.map(w => w.id));
// Access via: plannedWorkouts.find(w => w.id === workoutItemIndex)
```

---

### 3.6 `onUpdate` Missing from `SetTrackCard` Effect Dependencies

**File:** `src/components/SetTrackCard.tsx:64–68`

```tsx
useEffect(() => {
    if (!trackedValues) return;
    onUpdate(trackedValues, index);
}, [trackedValues]);  // onUpdate not listed
```

`onUpdate` is an inline function created in `WorkoutTrackCard` on every render. The eslint-plugin-react-hooks exhaustive-deps rule would flag this. With a stale `onUpdate`, the callback called after a debounce may close over state from a previous render.

**Alternative:** Either add `onUpdate` to the dependency array (and stabilize the callback in `WorkoutTrackCard` with `useCallback`), or restructure to use a ref for the callback:

```ts
const onUpdateRef = useRef(onUpdate);
onUpdateRef.current = onUpdate;
// Use onUpdateRef.current(...) in the effect
```

---

## 4. Architecture & Design

### 4.1 All Dispatch Callbacks Defined Inline in `App.tsx`

**File:** `src/App.tsx:128–178`

The same action (e.g., `DELETE_WORKOUT`) is dispatched via separate inline arrow functions passed to `Home` and `WorkoutList`. Any change to delete behavior requires edits in multiple places.

**Reasoning:** As the app grows, this pattern creates maintenance overhead. It also means any `App` state change creates new callback references for all pages.

**Alternative:** Extract named callback functions (e.g., `const handleDeleteWorkout = useCallback(...)`) or use React Context to expose the dispatchers. This also makes it easier to eventually add `React.memo` to pages.

---

### 4.2 Model Classes Lack `fromJSON` Factory Methods

**Files:** `src/reducers/WorkoutReducer.ts:22–40`, `src/reducers/PlanReducer.ts:18–23`, `src/reducers/WeightReducer.ts:16–25`

The reconstruction of class instances from raw IDB JSON is implemented inline in each reducer's `INIT_*` case, accessing private backing fields (e.g., `rawJSON._workoutName`) via `any`. This is tight coupling between reducers and the private implementation details of models. A refactor of a private field name breaks deserialization silently.

**Reasoning:** The class that owns a field should own the logic for restoring it from JSON. Reducers should not know about `_workoutName`.

**Alternative:** Add `static fromJSON(raw: unknown): Workout` factory methods to each model class. The reducer's `INIT` case becomes:

```ts
case WorkoutActionType.INIT_WORKOUT:
    return action.payload.map(Workout.fromJSON);
```

---

### 4.3 `WorkoutTrackReducer` Is Dead Code

**File:** `src/reducers/WorkoutTrackReducer.ts`

The `workoutRecordReducer` is defined but not used anywhere. Workout tracking data is embedded in `Workout.workoutTrackData` and managed through `WorkoutReducer`. The separate reducer, its action types, and the `WorkoutTrackRecord` constructor calls within it are never invoked.

**Alternative:** Delete the file, or — if tracking records were intended to be stored independently — implement the architecture change intentionally.

---

### 4.4 Weight Tracker Page Is Unreachable

**File:** `src/App.tsx:191`

```tsx
{/* <BottomNavigationAction label="Weight" icon={<MonitorWeightOutlined />} /> */}
```

The `WeightTracker` page, `weightCollection` state, `WeightReducer`, `WeightCollection` model, and `useWeeklyWeightTrackedData` hook are all fully wired but the navigation entry point is commented out. From a user perspective this feature does not exist.

**Alternative:** Either uncomment the navigation action to ship the feature, or remove all the dead weight-tracking code until the feature is ready. Leaving partially-built features wired into the main state tree adds complexity and maintenance burden.

---

### 4.5 `base` href Hardcoded to GitHub Pages URL

**File:** `src/App.tsx:69`

```tsx
<base href={import.meta.env.DEV ? '/' : 'https://infantajayvenus.github.io/GymBooku/'} />
```

This hardcodes the deployment URL into the JavaScript bundle. Deploying to any other host breaks all relative resource URLs.

**Alternative:** Set the base URL as an environment variable (`VITE_BASE_URL`) in `.env.production`:

```tsx
<base href={import.meta.env.VITE_BASE_URL ?? '/'} />
```

---

## 5. Performance

### 5.1 `getDeepCleanedObject` Is O(n) on Every Dispatch

**File:** `src/hooks/useStoredReducer.ts:12–13`

On every `dispatch` call, the entire state tree is deep-traversed synchronously to strip function properties before writing to IDB. For a large workout history with many `WorkoutTrackCollection` and `WorkoutTrackRecord` instances, this grows linearly with data size.

**Reasoning:** The traversal is synchronous and runs before React processes the state update.

**Alternative:** Two options:
1. Switch from class instances to plain objects — eliminate the need for the traversal entirely, since plain objects have no methods to strip.
2. Debounce the IDB write: apply `getDeepCleanedObject` and write asynchronously on a trailing debounce (e.g., 500ms), so rapid sequential dispatches only trigger one write.

---

### 5.2 `WeightTracker` Mutates and Sorts State Array on Every Render

**File:** `src/pages/WeightTracker.tsx:113`

```tsx
{weightsTrackedData.weights.sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf()).map(...)}
```

`Array.sort` mutates the array **in place**. This mutates the array inside the `WeightCollection` state object on every render, and is an O(n log n) operation on every render cycle.

**Alternative:** Sort a copy with `[...weightsTrackedData.weights].sort(...)`, or sort once in the `WeightReducer` when data is added, or use `useMemo`.

---

### 5.3 `WorkoutTrackerScreen` Graph Computation Is Not Memoized

**File:** `src/pages/Home/WorkoutTrackerScreen.tsx:46–73`

`graphData` is computed by sorting, reducing, and mapping over `selectedWorkout.workoutTrackData` in the render body of a `Dialog`. The dialog re-renders whenever any parent state changes.

**Alternative:** Wrap in `useMemo`:

```ts
const graphData = useMemo(
    () => computeGraphData(selectedWorkout),
    [selectedWorkout.id, selectedWorkout.workoutTrackData]
);
```

---

## 6. Code Quality

### 6.1 Debug `console.log` Statements in Production Code

**Files:** `src/App.tsx:173`, `src/pages/Home/index.tsx:83`, `src/reducers/WeightReducer.ts:18`

```ts
console.log("DEBUG:UPDATE_DISPATCH:", ...)
console.log('DEBUG:event', event)
console.log('DEBUG:RAW_WEIGHT:', rawJson)
```

**Alternative:** Remove before merging. Consider adding an ESLint `no-console` rule (with `warn` severity) to prevent recurrence.

---

### 6.2 `getToday` and `isTimestampToday` Contain Redundant Date Copies

**Files:** `src/utils/getToday.ts:4–6`, `src/utils/isTimestampToday.ts:3–4`

```ts
const today = new Date();
const localeToday = new Date(today.valueOf());  // identical to today
```

`localeToday` is never mutated. The copy is dead code.

**Alternative:** Remove the intermediate variable: `const today = new Date()`.

---

### 6.3 Typos and Inconsistent Naming

| Location | Issue | Correct |
|---|---|---|
| `src/data.default.ts:25` | `'Hammstring Curl'` | `'Hamstring Curl'` |
| `src/components/WorkoutForm.tsx:26` | `INITIAL_WOURKOUT_NAME` | `INITIAL_WORKOUT_NAME` |
| `src/hooks/useDrawer.ts:3` | parameter typed `Boolean` (boxed) | `boolean` |
| Multiple files | `focussed` (non-standard British spelling) | `focused` |
| `src/data.default.ts:3` | Export `DEFAULT_PLANS` contains `Workout[]` | Should be `DEFAULT_WORKOUTS` |

---

### 6.4 `WorkoutForm.tsx` Title Does Not Reflect Edit Mode

**File:** `src/components/WorkoutForm.tsx:40`

```tsx
<Typography variant='h5'>Add Workout</Typography>
```

The form handles both add and edit cases, but the heading always reads "Add Workout".

**Alternative:** `{workoutData ? 'Edit Workout' : 'Add Workout'}`

---

### 6.5 `SortableListItem` Uses Unnecessary `as any` Cast

**File:** `src/components/SortableList/SortableListItem.tsx:20`

```ts
const { ... } = useSortable({ id: id } as any);
```

`id` is typed as `string` and `useSortable` accepts `UniqueIdentifier` (`string | number`). The cast is unnecessary.

**Alternative:** Remove the cast: `useSortable({ id })`.

---

### 6.6 Dead Code in `data.mock.ts`

**File:** `src/data.mock.ts:84–103`

A block of utility functions (`getRandomTimestamp`, `generateUniqueId`) is commented out. This is unreachable code of no documentation value.

**Alternative:** Delete the commented-out block.

---

### 6.7 Commented-Out Navigation Action and Stale Comments

**Files:** `src/App.tsx:191`, `src/pages/WorkoutPlanner.tsx:47`

```tsx
{/* <BottomNavigationAction label="Weight" ... /> */}
// setFocussedValueId(null);
```

These indicate in-progress work left in the codebase. Commented-out code in version-controlled files provides no value over the git history.

**Alternative:** Remove. Restore from git history if needed.

---

### 6.8 `registerServiceWorker.js` Uses `process.env` Instead of `import.meta.env`

**File:** `src/registerServiceWorker.js:5–7`

```js
if (process.env.NODE_ENV === "production") { registerSW(); }
```

In a Vite project, `process.env.NODE_ENV` is not automatically defined. The correct Vite idiom is `import.meta.env.PROD`.

Additionally, `vite-plugin-pwa` with `registerType: 'autoUpdate'` already injects its own service worker registration script into the HTML output. This file may be causing a double-registration.

**Alternative:** Replace `process.env.NODE_ENV` with `import.meta.env.PROD`. Verify whether this file is even needed given the plugin's auto-registration, and remove it if redundant.

---

## 7. Maintainability

### 7.1 IDB Write Failures Produce Silent Data Loss

**File:** `src/hooks/useStoredReducer.ts:15–16`

```ts
update(storeKey, () => updatedState)
    .catch(err => console.log(storeKey, updatedState, err));
```

An IDB write failure (e.g., storage quota exceeded) is caught, logged, but never surfaced to the user. The in-memory state has changed but the persisted state has not — the user's data will be lost on next page load.

**Alternative:** Show a MUI `Snackbar` or `Alert` on IDB write failure informing the user that their change was not saved. Consider exposing an error state from `useStoredReducer`.

---

### 7.2 `WeightCollection` Uses Inconsistent Model Convention

**File:** `src/models/WeightCollection.ts:4–7`

Unlike `Workout`, `Plan`, and `WorkoutRecord` which use TypeScript `private` keyword, `WeightCollection` and `Weight` use public underscore-prefixed fields. This means external code can bypass the getter/setter API and directly mutate these fields.

**Alternative:** Convert to proper `private` fields to match the rest of the model layer. This also allows `getDeepCleanedObject` semantics to be consistent across models.

---

### 7.3 Data Version Constant Is Embedded in `App.tsx`

**File:** `src/App.tsx` (storage keys `'WORKOUT_1.0.1'`, `'WORKOUT_PLAN_1.0.1'`, `'WEIGHT_1.0.1'`)

The versioned storage keys are inline string literals. Bumping a version to force a schema migration requires finding and updating strings scattered in `App.tsx`.

**Alternative:** Extract to a single constants file:

```ts
// src/constants/storageKeys.ts
export const STORAGE_KEYS = {
    WORKOUTS: 'WORKOUT_1.0.1',
    PLANS: 'WORKOUT_PLAN_1.0.1',
    WEIGHT: 'WEIGHT_1.0.1',
} as const;
```

---

## 8. Positive Findings

- **`useDebounce`** — Textbook correct implementation: cleanup via returned function, generic typing, proper dependency handling.
- **`getAverage`** — Zero-length guard prevents division by zero; `parseFloat(toFixed(n))` correctly returns a `number` (not a string) with controlled precision.
- **`SortableList` structure** — Clean separation between `SortableListContainer` (dnd context) and `SortableListItem` (draggable behavior). Composable and reusable.
- **`Plan.daysList` getter** — Iterates `DAYS_OF_WEEK` in canonical enum order rather than returning the stored array, guaranteeing consistent Sunday–Saturday ordering regardless of insertion order.
- **`WorkoutTrackRecord.hasAllRequiredValues`** — Uses `reduce` over tracking values to enforce required fields; called consistently for save-button validation.
- **TypeScript strictness configuration** — `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are all enabled. The codebase compiles clean under these settings.
- **PWA configuration** — Workbox caching strategy (CacheFirst for fonts with 365-day TTL, precache for static assets), maskable icons, and complete web app manifest show careful PWA setup.
- **`useStoredReducer` concept** — The abstraction of wrapping `useReducer` with automatic IndexedDB persistence is sound. The `[state, dispatch]` API is familiar to any React developer. The `initializeActionGenerator` pattern for rehydration is the right structural choice.

---

*Review performed against `dev` @ `df35277`. File and line references may shift as the code evolves.*
