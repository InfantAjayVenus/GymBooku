import getRandomId, { ID } from "src/utils/getRandomId";
import { TrackingValues } from "./Workout";

export interface TrackedValuesData {
    id: ID,
    [TrackingValues.COUNT]: undefined | number,
    [TrackingValues.WEIGHT]: undefined | number,
    [TrackingValues.TIME]: undefined | number,
}

export class WorkoutTrackRecord {
    private _id: ID;
    private _time?: Number;
    private _count?: Number;
    private _weight?: Number;
    private _timestamp: Date;

    constructor({ time, count, weight }: { time?: Number, count?: Number, weight?: Number } = {},) {
        this._id = getRandomId();
        this._timestamp = new Date();
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