import getEnumDay from "src/utils/getEnumDay";
import getRandomId, { ID } from "src/utils/getRandomId";
import { Plan } from "./Plan";

export class WorkoutSession {
  _id: ID;
  _sessionDate: Date;
  _workouts: ID[];
  _plans: ID[];

  private constructor(plansList: ID[], workoutsList: ID[], id = getRandomId(), sessionDate = new Date()) {
    this._id = id;
    this._sessionDate = sessionDate;
    this._workouts = workoutsList;
    this._plans = plansList;
  }

  static getSession(plansList: Plan[], sessionDate = new Date()) {
    const today = getEnumDay(sessionDate);
    const plansForDate = plansList.filter(plan => plan.daysList.includes(today));
    const workoutsForFilteredPlans = Array.from(new Set(plansForDate.reduce((acc, plan) => [...acc, ...plan.workoutsList],[] as ID[])));  

    return new WorkoutSession(plansForDate.map(({id}) => id), workoutsForFilteredPlans, getRandomId(), sessionDate);
  }

  static getCopyFrom(session: WorkoutSession) {
    return new WorkoutSession(session._plans, session._workouts, session._id, session._sessionDate);   
  }

  static fromJSON(rawJSON: any) {
    if(!['_id', '_sessionDate', '_workouts', '_plans'].every((key) => key in rawJSON)) {
      console.error(rawJSON);
      throw new Error('Invalid JSON');
    }
    return new WorkoutSession(rawJSON._plans, rawJSON._workouts, rawJSON._id, new Date(rawJSON._sessionDate));
  }

  get id() {
    return this._id;
  }

  get date() {
    return this._sessionDate;
  }

  get workouts() {
    return this._workouts;
  }

  get plans() {
    return this._plans;
  }

  updateSessionByPlan(plansList: Plan[]) {
    const today = getEnumDay(this._sessionDate);
    const plansForDate = plansList.filter(plan => plan.daysList.includes(today));
    this._plans = Array.from(new Set([...plansForDate.map(item => item.id), ...this._plans]));
    return WorkoutSession.getCopyFrom(this);
  }

  updateSessionByWorkout(workoutsList: ID[]) {
    this._workouts = workoutsList;
    return WorkoutSession.getCopyFrom(this);
  }
  
}
