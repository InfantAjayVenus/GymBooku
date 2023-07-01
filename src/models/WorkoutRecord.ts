import getRandomId, { ID } from "src/utils/getRandomId";
import { TrackingValues } from "./Workout";

export interface TrackedValuesData {
    id: ID,
    [TrackingValues.COUNT]: undefined | number,
    [TrackingValues.WEIGHT]: undefined | number,
    [TrackingValues.TIME]: undefined | number,
}

export interface PairedTrackRecord {
    today: WorkoutTrackCollection;
    previous?: WorkoutTrackCollection;
}

export class WorkoutTrackCollection {
    private _id: ID;
    private _timestamp: Date;
    private _workout: ID;
    private _trackedData: WorkoutTrackRecord[];

    constructor(workout: ID, trackedData: WorkoutTrackRecord[] = [new WorkoutTrackRecord()], id: ID = getRandomId(), timestamp = new Date()) {
        this._id = id;
        this._timestamp = timestamp;
        this._workout = workout;
        this._trackedData = trackedData;
    }

    get id() {
        return this._id;
    }

    get timestamp() {
        return this._timestamp;
    }

    get workout() {
        return this._workout;
    }

    get trackedData() {
        return this._trackedData;
    }

    set trackedData(updatedTrackedData: WorkoutTrackRecord[]) {
        this._trackedData = updatedTrackedData;
    }
}

export class WorkoutTrackRecord {
    private _id: ID;
    private _time?: Number;
    private _count?: Number;
    private _weight?: Number;
    private _timestamp: Date;

    constructor({ time, count, weight }: { time?: Number, count?: Number, weight?: Number } = {},id=getRandomId(), timestamp=new Date()) {
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

    get formattedDate() {
        return `${this._timestamp.getDate()}/${this._timestamp.getMonth() + 1}/${this._timestamp.getFullYear()}`;
    }

    toString() {
        return `${this._count ? `${this._count} Reps `: ''}${this._time ? `for ${this._time}Sec `: ''}${this._weight ? `@${this._weight}Kg ` : ''}`;
    }

    hasAllRequiredValues = (trackingValues: TrackingValues[]) => {

        return trackingValues.reduce((flag, value) => {
            if(value === TrackingValues.COUNT)  {
                return (flag && !!this._count);
            }
            if(value === TrackingValues.WEIGHT)  {
                return (flag && !!this._weight);
            }
            if(value === TrackingValues.TIME)  {
                return (flag && !!this._time);
            }
            return flag;
        }, true);
    }
}