# E2E User Scenarios — GymBooku

> Format: Given-When-Then
> Scope: Full user-facing flows across all four pages (Home, Plans, Workouts, Weight is hidden)

---

## 1. Workout Library (Workouts Page)

### 1.1 Add a new workout

**Given** the user is on the Workouts page
**When** they tap the "+" FAB button
**Then** a bottom drawer slides up with an "Add Workout" form

**Given** the form is open
**When** the user enters a workout name and selects at least one tracking value (COUNT, WEIGHT, or TIME), then taps Save
**Then** the drawer closes and the new workout appears in the list with its name and tracking value icons

### 1.2 Add a workout — validation: name required

**Given** the Add Workout form is open
**When** the user leaves the name field empty and attempts to submit
**Then** the form does not submit and the name field shows a required error

### 1.3 Add a workout — validation: tracking value required

**Given** the Add Workout form is open
**When** the user fills in the name but selects no tracking values and attempts to submit
**Then** the form does not submit

### 1.4 Edit an existing workout

**Given** the Workouts page shows at least one workout
**When** the user taps the "⋮" menu on a workout and selects "Edit"
**Then** the bottom drawer opens pre-filled with the workout's current name and tracking values

**Given** the edit form is open
**When** the user updates the name or tracking values and taps Save
**Then** the drawer closes and the workout list reflects the updated details

### 1.5 Delete a workout

**Given** the Workouts page shows at least one workout
**When** the user taps "⋮" and selects "Delete" (shown in red)
**Then** the workout is removed from the list immediately

---

## 2. Workout Plans (Plans Page)

### 2.1 View empty state

**Given** no workout plans exist
**When** the user navigates to the Plans page
**Then** an empty-state message is shown: "You haven't planned for any workouts yet"

### 2.2 Create a new plan

**Given** at least one workout exists in the library
**And** the user is on the Plans page
**When** they tap the "+" FAB and fill in a plan name, select one or more workouts, and select one or more days of the week, then tap Save
**Then** the drawer closes and the new plan appears in the list showing its name, linked workout names, and day chips

### 2.3 Create a plan — validation: all fields required

**Given** the Create Workout Plan form is open
**When** the user submits without filling in name, workouts, or days
**Then** the form does not submit; the missing required field is highlighted

### 2.4 Edit an existing plan

**Given** at least one plan exists
**When** the user taps "⋮" on a plan and selects "Edit"
**Then** the form opens pre-populated with the plan's current name, workouts, and days

**Given** the edit form is open
**When** the user changes the plan name, adds/removes workouts, or changes days and saves
**Then** the list updates to reflect the new plan details

### 2.5 Delete a plan

**Given** at least one plan exists
**When** the user taps "⋮" and selects "Delete"
**Then** the plan is removed from the list immediately

---

## 3. Home — Today's Workout View

### 3.1 Workouts scheduled for today are listed

**Given** at least one plan has today's day of the week in its schedule
**And** that plan includes at least one workout
**When** the user opens the Home page
**Then** the workouts from that plan are listed under "Today's Workouts"

### 3.2 No workouts when no plan covers today

**Given** no plan has today's day in its schedule
**When** the user opens the Home page
**Then** the "Today's Workouts" list is empty

### 3.3 Filter today's workouts by plan

**Given** multiple plans are active today
**When** the user taps the "All" filter chip
**Then** a popover appears listing each plan that has today as a scheduled day

**Given** the plan filter popover is open
**When** the user selects a specific plan
**Then** the popover closes and only workouts belonging to that plan are shown

### 3.4 Open the workout tracker for a workout

**Given** the Home page shows at least one workout
**When** the user taps on a workout name
**Then** a full-screen dialog opens titled "Workout Details" for that workout

### 3.5 Log a workout session — add sets and save

**Given** the Workout Details dialog is open for a workout
**When** the user enters values for all required tracking fields (e.g. COUNT and WEIGHT) in Set 1 and taps Save
**Then** the dialog closes and that workout in the Today's list shows a checkmark and its name is greyed out

### 3.6 Save is disabled until all required fields are filled

**Given** the Workout Details dialog is open
**When** one or more tracking value fields in any set are empty
**Then** the Save button is disabled

### 3.7 Add multiple sets before saving

**Given** the Workout Details dialog is open
**When** the user fills Set 1 fully and taps "Add Set"
**Then** a new empty Set 2 row appears and the "Add Set" button is re-enabled only after Set 2 is filled

**Given** more than one set exists
**When** the user taps "Remove Set"
**Then** the last set row is removed

### 3.8 Remove Set is disabled when only one set remains

**Given** only one set row exists in the tracker
**When** the user views the "Remove Set" button
**Then** the button is disabled

### 3.9 Previously recorded data is shown in the tracker

**Given** the user has logged this workout in a previous session (not today)
**When** the Workout Details dialog is opened for the same workout
**Then** a "Previously Recorded" section shows each set's values from the most recent past session
**And** a line chart shows historical max values over time

### 3.10 Delete today's tracked session

**Given** the Workout Details dialog is open for a workout that has already been tracked today
**When** the user taps the Delete button
**Then** the dialog closes and the workout no longer shows as completed in the Today's list

### 3.11 Drag-and-drop reorder today's workouts

**Given** the Home page shows two or more workouts
**When** the user long-presses and drags a workout item to a new position
**Then** the list order updates to reflect the new sequence

---

## 4. Streak & Progress (Home Page — Streak Card)

### 4.1 Current streak is displayed

**Given** the user has logged workouts on consecutive days
**When** they open the Home page
**Then** the Streak card shows the current consecutive-day streak count

### 4.2 Weekly streak visualization

**Given** the user is on the Home page
**When** they view the "This Week" section of the Streak card
**Then** each day of the current week is shown — days with a logged workout display a 🔥 icon, today's column has a distinct outline, and days without a workout show an empty chip

### 4.3 Longest streak is displayed

**Given** the user has historical workout data
**When** they view the Streak card
**Then** a "Longest: N" label appears below the card showing their all-time best streak

### 4.4 Next milestone is displayed

**Given** the user has an active streak
**When** they view the Streak card
**Then** a "MileStone: N" label shows the next streak target count

---

## 5. Navigation

### 5.1 Navigate between pages via bottom navigation

**Given** the app is open
**When** the user taps "Plans" in the bottom navigation bar
**Then** the Plans page is shown

**When** the user taps "Workouts"
**Then** the Workout List page is shown

**When** the user taps "Home"
**Then** the Home page is shown

---

## 6. Desktop Banner

### 6.1 Banner shown on desktop viewport

**Given** the app is opened in a browser with a viewport width ≥ 900px (md breakpoint)
**When** the page loads
**Then** a banner appears at the top of the screen stating the app is designed for mobile

### 6.2 Banner can be dismissed

**Given** the desktop banner is visible
**When** the user taps "Okay"
**Then** the banner is no longer visible

---

## 7. Data Persistence

### 7.1 Workouts persist across page refreshes

**Given** the user has added a workout
**When** they refresh the browser
**Then** the workout is still present in the Workout List page

### 7.2 Plans persist across page refreshes

**Given** the user has created a plan
**When** they refresh the browser
**Then** the plan is still present in the Plans page

### 7.3 Tracked session persists across page refreshes

**Given** the user has logged a workout session today
**When** they refresh the browser and return to the Home page
**Then** the workout still shows as completed (greyed out with checkmark)
