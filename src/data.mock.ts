import { DAYS_OF_WEEK, Plan } from "./models/Plan";
import { TrackingValues, Workout } from "./models/Workout";
import { WorkoutTrackCollection, WorkoutTrackRecord } from "./models/WorkoutRecord";
import getRandomId from "./utils/getRandomId";

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

const PREVIOUS_TRACKDATA_DATE_LIMIT = 7;
const PREVIOUS_TRACKDATA_MIN_LIMIT = 4;
TEST_WORKOUTS.forEach(workout => {
    /**
     * TODO
     * Choose Random Dates for the past n days
     * Create a workout track collection for each day
     */
    const randomDates = new Array(PREVIOUS_TRACKDATA_MIN_LIMIT).fill(0)
        .map(_ => getRandomNumber(0, PREVIOUS_TRACKDATA_DATE_LIMIT))
        .map(index => {
            const date = new Date();
            date.setDate(date.getDate() - index);
            return date;
        });

    workout.workoutTrackData = randomDates.map(date => {
        const trackedData = new Array(getRandomNumber(1, 5)).fill(0).map(_ => {
            return workout.trackingValues.reduce((acc, value) => {
                const label = value === TrackingValues.TIME ? 'time' : value === TrackingValues.COUNT ? 'count' : 'weight';
                acc[label] = getRandomNumber(5, 15);
                return acc;
            }, {} as {
                time?: Number | undefined;
                count?: Number | undefined;
                weight?: Number | undefined;
            })
            
        }).map(data => {
            const timestamp = new Date(date);
            timestamp.setHours(getRandomNumber(0, 23), getRandomNumber(0, 59), getRandomNumber(0, 59), getRandomNumber(0, 59));
            return new WorkoutTrackRecord(getRandomNumber(0, 100), data, getRandomId(), timestamp);
        });

        return new WorkoutTrackCollection(workout.id, trackedData, getRandomId(), date);
    })
})



// function getRandomTimestamp() {
//     // Generate a random timestamp within the past week
//     const currentTime = Date.now();
//     const pastWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
//     const randomTimestamp = currentTime - Math.floor(Math.random() * pastWeek);
//     return new Date(randomTimestamp);
// }

// function generateUniqueId() {
//     const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
//     const length = 9;
//     let uniqueId = '';

//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         uniqueId += characters.charAt(randomIndex);
//     }

//     return uniqueId;
// }
