import { DAYS_OF_WEEK, Plan } from "./models/Plan";
import { TrackingValues, Workout } from "./models/Workout";
import { WorkoutTrackCollection, WorkoutTrackRecord } from "./models/WorkoutRecord";

const workout1 = new Workout("Push-ups", [TrackingValues.TIME, TrackingValues.COUNT]);
const workout2 = new Workout("Squats", [TrackingValues.COUNT, TrackingValues.WEIGHT]);
const workout3 = new Workout("Running", [TrackingValues.TIME]);
const workout4 = new Workout("Bench Press", [TrackingValues.COUNT, TrackingValues.WEIGHT, TrackingValues.TIME]);

export const TEST_WORKOUTS = [workout1, workout2, workout3, workout4];

const plan1 = new Plan("Full Body Workout", [workout1.id, workout2.id], [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.FRIDAY]);
const plan2 = new Plan("Leg Day", [workout2.id], [DAYS_OF_WEEK.TUESDAY, DAYS_OF_WEEK.THURSDAY]);
const plan3 = new Plan("Cardio", [workout3.id], [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY]);
const plan4 = new Plan("Upper Body Workout", [workout1.id, workout4.id], [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.FRIDAY]);

export const TEST_PLANS = [plan1, plan2, plan3, plan4];

// Create a helper function to generate random numbers within a range
function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomTimestamp() {
    // Generate a random timestamp within the past week
    const currentTime = Date.now();
    const pastWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const randomTimestamp = currentTime - Math.floor(Math.random() * pastWeek);
    return new Date(randomTimestamp);
}

// Generate unique ID
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

// Generate sample data for WorkoutTrackCollection
const workoutTrackCollection1 = new WorkoutTrackCollection(
    workout1.id,
    [
        new WorkoutTrackRecord({ count: getRandomNumber(10, 20), time: getRandomNumber(30, 60) }, generateUniqueId(), getRandomTimestamp()),
        new WorkoutTrackRecord({ count: getRandomNumber(10, 20), time: getRandomNumber(30, 60) }, generateUniqueId(), getRandomTimestamp()),
        new WorkoutTrackRecord({ count: getRandomNumber(10, 20), time: getRandomNumber(30, 60) }, generateUniqueId(), getRandomTimestamp()),
        // Add more WorkoutTrackRecord instances as needed
    ],
    generateUniqueId(),
    getRandomTimestamp()
);

const workoutTrackCollection2 = new WorkoutTrackCollection(
    workout2.id,
    [
        new WorkoutTrackRecord({ weight: getRandomNumber(20, 50), time: getRandomNumber(30, 60) }, generateUniqueId(), getRandomTimestamp()),
        new WorkoutTrackRecord({ weight: getRandomNumber(20, 50), time: getRandomNumber(30, 60) }, generateUniqueId(), getRandomTimestamp()),
        new WorkoutTrackRecord({ weight: getRandomNumber(20, 50), time: getRandomNumber(30, 60) }, generateUniqueId(), getRandomTimestamp()),
        // Add more WorkoutTrackRecord instances as needed
    ],
    generateUniqueId(),
    getRandomTimestamp()
);

const workoutTrackCollection3 = new WorkoutTrackCollection(
    workout3.id,
    [
        new WorkoutTrackRecord({ time: getRandomNumber(30, 60) }, generateUniqueId(), getRandomTimestamp()),
        new WorkoutTrackRecord({ time: getRandomNumber(30, 60) }, generateUniqueId(), getRandomTimestamp()),
        new WorkoutTrackRecord({ time: getRandomNumber(30, 60) }, generateUniqueId(), getRandomTimestamp()),
        // Add more WorkoutTrackRecord instances as needed
    ],
    generateUniqueId(),
    getRandomTimestamp()
);

export const TEST_TRACKED_COLLECTION = [workoutTrackCollection1, workoutTrackCollection2, workoutTrackCollection3];
// Generate additional WorkoutTrackCollection instances
const additionalDataEntries = 12; // Adjust the number of additional data entries as needed

for (let i = 0; i < additionalDataEntries; i++) {
    const randomWorkoutId = TEST_TRACKED_COLLECTION[Math.floor(Math.random() * TEST_TRACKED_COLLECTION.length)].workout;
    const randomWorkout = TEST_TRACKED_COLLECTION.find((workout) => workout.id === randomWorkoutId);

    const randomWorkoutTrackRecord = new WorkoutTrackRecord(
        {
            count: getRandomNumber(10, 20),
            weight: getRandomNumber(20, 50),
            time: getRandomNumber(30, 60),
        },
        generateUniqueId(),
        getRandomTimestamp()
    );

    const workoutTrackCollection = new WorkoutTrackCollection(randomWorkoutId, [randomWorkoutTrackRecord], generateUniqueId(), getRandomTimestamp());
    randomWorkout?.trackedData.push(randomWorkoutTrackRecord);
    TEST_TRACKED_COLLECTION.push(workoutTrackCollection);
}

// Add the initial WorkoutTrackCollection instances to the sampleData array
TEST_TRACKED_COLLECTION.push(workoutTrackCollection1, workoutTrackCollection2, workoutTrackCollection3);

// Ensure at least 15 data entries
while (TEST_TRACKED_COLLECTION.length < 15) {
    const randomWorkoutId = TEST_TRACKED_COLLECTION[Math.floor(Math.random() * TEST_TRACKED_COLLECTION.length)].workout;
    const randomWorkout = TEST_TRACKED_COLLECTION.find((workout) => workout.id === randomWorkoutId);

    const randomWorkoutTrackRecord = new WorkoutTrackRecord(
        {
            count: getRandomNumber(10, 20),
            weight: getRandomNumber(20, 50),
            time: getRandomNumber(30, 60),
        },
        generateUniqueId(),
        getRandomTimestamp()
    );

    randomWorkout?.trackedData.push(randomWorkoutTrackRecord);
    TEST_TRACKED_COLLECTION.push(new WorkoutTrackCollection(randomWorkoutId, [randomWorkoutTrackRecord], generateUniqueId(), getRandomTimestamp()));
}
