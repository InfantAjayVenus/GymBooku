import getRandomId, { ID } from "src/utils/getRandomId";
import { Workout } from "./Workout";

export enum DAYS_OF_WEEK {
    SUNDAY="SUNDAY",
    MONDAY="MONDAY",
    TUESDAY="TUESDAY",
    WEDNESDAY="WEDNESDAY",
    THURSDAY="THURSDAY",
    FRIDAY="FRIDAY",
    SATURDAY="SATURDAY",
}

export class Plan {
    private _id: ID;
    private _name: String;
    private _workoutsList: Workout[];
    private _daysList: DAYS_OF_WEEK[];

    constructor(name:String, workoutsList: Workout[], daysList: DAYS_OF_WEEK[], id: ID = getRandomId()) {
        this._id = id;
        this._name = name;
        this._workoutsList = workoutsList;
        this._daysList = daysList;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get workoutsList() {
        return this._workoutsList;
    }

    get daysList() {
        const returnList = [] as DAYS_OF_WEEK[];
        for(const day in DAYS_OF_WEEK) {
            (this._daysList.includes(day as DAYS_OF_WEEK)) && returnList.push(day as DAYS_OF_WEEK);
        }
        return returnList;
    }

    set name(updatedName: String) {
        this._name = updatedName;
    }

    set daysList(updatedDaysList: DAYS_OF_WEEK[]) {
        this._daysList = updatedDaysList;
    }

    set workoutsList (updatedWorkoutsList: Workout[]) {
        this._workoutsList = updatedWorkoutsList;
    }

    hasDay(day: DAYS_OF_WEEK) {
        return this._daysList.includes(day);
    }
}