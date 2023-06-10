import getRandomId, { ID } from "src/utils/getRandomId";
import { TrackingValues, Workout } from "./Workout";

export interface TrackedValuesData {
    id: ID,
    [TrackingValues.COUNT]: undefined | number,
    [TrackingValues.WEIGHT]: undefined | number,
    [TrackingValues.TIME]: undefined | number,
}

export class WorkoutTrackRecord {
    private _id: ID;
    private _workout: Workout;
    private _time?: Number;
    private _count?: Number;
    private _weight?: Number;
    private _timestamp: Date;

    constructor(workout: Workout, { time, count, weight }: { time?: Number, count?: Number, weight?: Number } = {}, id: ID = getRandomId(), timestamp: Date = new Date()) {
        this._workout = workout;
        this._id = id;
        this._timestamp = timestamp;
        this._time = time;
        this._count = count;
        this._weight = weight;
    }

    set time(updatedTime: Number | undefined) {
        this._time = updatedTime;
    }

    set count(updatedCount: Number | undefined) {
        this._count = updatedCount;
    }

    set weight(updatedWeight: Number | undefined) {
        this._weight = updatedWeight;
    }

    get id() {
        return this._id;
    }

    get workout() {
        return this._workout;
    }

    get count() {
        return this._count;
    }

    get weight() {
        return this._weight;
    }

    get time() {
        return this._time;
    }

    get timestamp() {
        return this._timestamp;
    }

    get hasAllMandatoryValues() {
        const shouldHaveTime = this.workout.trackingValues.includes(TrackingValues.TIME);
        const shouldHaveWeight = this.workout.trackingValues.includes(TrackingValues.WEIGHT);
        const shouldHaveCount = this.workout.trackingValues.includes(TrackingValues.COUNT);

        return (shouldHaveCount && !!this.count) || (shouldHaveWeight && !!this.weight) || (shouldHaveTime && !!this.time);
    }

    get formattedDate() {
        return `${this._timestamp.getDate()}/${this._timestamp.getMonth() + 1}/${this._timestamp.getFullYear()}`;
    }
}