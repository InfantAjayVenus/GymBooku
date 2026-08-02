import getRandomId, { ID } from "src/utils/getRandomId";

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
    private _name: string;
    private _workoutsList: ID[];
    private _daysList: DAYS_OF_WEEK[];

    constructor(name:string, workoutsList: ID[], daysList: DAYS_OF_WEEK[], id: ID = getRandomId()) {
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

    set name(updatedName: string) {
        this._name = updatedName;
    }

    get workoutsList() {
        return this._workoutsList;
    }

    set workoutsList (updatedWorkoutsList: ID[]) {
        this._workoutsList = updatedWorkoutsList;
    }

    get daysList() {
        const returnList = [] as DAYS_OF_WEEK[];
        for(const day in DAYS_OF_WEEK) {
            (this._daysList.includes(day as DAYS_OF_WEEK)) && returnList.push(day as DAYS_OF_WEEK);
        }
        return returnList;
    }

    set daysList(updatedDaysList: DAYS_OF_WEEK[]) {
        this._daysList = updatedDaysList;
    }

    hasDay(day: DAYS_OF_WEEK) {
        return this._daysList.includes(day);
    }
}