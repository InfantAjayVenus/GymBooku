import getRandomId, { ID } from "src/utils/getRandomId";

export enum DAYS_OF_WEEK {
    SUNDAY = "SUNDAY",
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
}

export class Plan {
    private _id: ID;
    private _name: String;
    private _workoutsList: ID[];
    private _daysList: DAYS_OF_WEEK[];

    static fromJSON(rawJSON: any): Plan {

        return new Plan(rawJSON._name, rawJSON._workoutsList, rawJSON._daysList, rawJSON._id);
    }


    constructor(name: String, workoutsList: ID[], daysList: DAYS_OF_WEEK[], id: ID = getRandomId()) {
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
        for (const day in DAYS_OF_WEEK) {
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

    set workoutsList(updatedWorkoutsList: ID[]) {
        this._workoutsList = updatedWorkoutsList;
    }

    hasDay(day: DAYS_OF_WEEK) {
        return this._daysList.includes(day);
    }
}