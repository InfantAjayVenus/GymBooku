import { AccessTimeOutlined, FitnessCenterOutlined, PinOutlined } from "@mui/icons-material";
import React, { Key } from "react";
import getRandomId, { ID } from "src/utils/getRandomId";

export enum TrackingValues {
    TIME = 'TIME',
    COUNT = 'COUNT',
    WEIGHT = 'WEIGHT',

};

interface TrackingMixin {
    [TrackingValues.TIME]: (key: Key) => React.ReactElement;
    [TrackingValues.COUNT]: (key: Key) => React.ReactElement;
    [TrackingValues.WEIGHT]: (key: Key) => React.ReactElement;
};

export const TRACKING_VALUES_ICON: TrackingMixin = {
    [TrackingValues.TIME]: (key) => React.createElement(AccessTimeOutlined, {key}),
    [TrackingValues.COUNT]: (key) => React.createElement(PinOutlined, {key}),
    [TrackingValues.WEIGHT]: (key) => React.createElement(FitnessCenterOutlined, {key}),
};


export class Workout {
    private _id: ID;
    private _workoutName: String;
    private _trackingValues: TrackingValues[];

    constructor(name: String, trackingValues: TrackingValues[], id: ID = getRandomId()) {

        this._id = id;
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