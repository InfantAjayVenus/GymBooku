import { DAYS_OF_WEEK, Plan } from "./models/Plan";
import { Weight, WeightCollection } from "./models/WeightCollection";
import { TrackingValues, Workout } from "./models/Workout";
import { WorkoutTrackCollection, WorkoutTrackRecord } from "./models/WorkoutRecord";

const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

const pushUps = new Workout(
    "Push-ups",
    [TrackingValues.TIME, TrackingValues.COUNT],
    [
        new WorkoutTrackCollection(
            "push-ups-history",
            [
                new WorkoutTrackRecord(0, { count: 10, time: 30 }, "push-ups-set-1", daysAgo(4)),
                new WorkoutTrackRecord(1, { count: 12, time: 35 }, "push-ups-set-2", daysAgo(4)),
            ],
            "push-ups-session",
            daysAgo(4),
        ),
    ],
    "push-ups",
);

const squats = new Workout("Squats", [TrackingValues.COUNT, TrackingValues.WEIGHT], [], "squats");
const running = new Workout("Running", [TrackingValues.TIME], [], "running");
const benchPress = new Workout("Bench Press", [TrackingValues.COUNT, TrackingValues.WEIGHT, TrackingValues.TIME], [], "bench-press");

export const TEST_WORKOUTS = [pushUps, squats, running, benchPress];

export const TEST_PLANS = [
    new Plan("Full Body Workout", [pushUps.id, squats.id], [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.FRIDAY], "full-body"),
    new Plan("Leg Day", [squats.id], [DAYS_OF_WEEK.TUESDAY, DAYS_OF_WEEK.THURSDAY], "leg-day"),
    new Plan("Cardio", [running.id], [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY], "cardio"),
    new Plan("Upper Body Workout", [pushUps.id, benchPress.id], [DAYS_OF_WEEK.MONDAY, DAYS_OF_WEEK.WEDNESDAY, DAYS_OF_WEEK.FRIDAY], "upper-body"),
];

export const TEST_WEIGHTS = new WeightCollection(
    [
        new Weight(82, daysAgo(7), "weight-1"),
        new Weight(81, daysAgo(5), "weight-2"),
        new Weight(80, daysAgo(3), "weight-3"),
    ],
    "weights",
);
