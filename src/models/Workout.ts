import { AccessTimeOutlined, FitnessCenterOutlined, PinOutlined } from "@mui/icons-material";
import React from "react";
import getRandomId, { ID } from "src/utils/getRandomId";

export enum TrackingValues {
    TIME = 'TIME',
    COUNT = 'COUNT',
    WEIGHT = 'WEIGHT',

};

interface TrackingMixin {
    [TrackingValues.TIME]: () => React.ReactElement;
    [TrackingValues.COUNT]: () => React.ReactElement;
    [TrackingValues.WEIGHT]: () => React.ReactElement;
};

export const TRACKING_VALUES_ICON: TrackingMixin = {
    [TrackingValues.TIME]: () => React.createElement(AccessTimeOutlined),
    [TrackingValues.COUNT]: () => React.createElement(FitnessCenterOutlined),
    [TrackingValues.WEIGHT]: () => React.createElement(PinOutlined),
};


export class Workout {
    private _id: ID;
    private _workoutName: String;
    private _trackingValues: TrackingValues[];

    constructor(name: String, trackingValues: TrackingValues[]) {

        this._id = getRandomId();
        this._workoutName = name;
        this._trackingValues = trackingValues;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._workoutName;
    }

    get trackingValues() {
        return this._trackingValues;
    }

    set name(updatedName: String) {
        this._workoutName = updatedName;
    }

    set trackingValues(updatedValues: TrackingValues[]) {
        this._trackingValues = updatedValues;
    }

}