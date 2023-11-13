import getEnumDay from "src/utils/getEnumDay";
import getRandomId, { ID } from "src/utils/getRandomId";
import { Plan } from "./Plan";

export class WorkoutSession {
  _id: ID;
  _sessionDate: Date;
  _workouts: ID[];
  _plans: ID[];

  constructor(plansList: Plan[], id = getRandomId(), sessionDate = new Date()) {
    this._id = id;
    this._sessionDate = sessionDate;
    const today = getEnumDay(sessionDate);
    const plansForDate = plansList.filter(plan => plan.daysList.includes(today));
    const workoutsForFilteredPlans = Array.from(new Set(plansForDate.reduce((acc, plan) => [...acc, ...plan.workoutsList],[] as ID[])));  

    this._workouts = workoutsForFilteredPlans;
    this._plans = plansForDate.map(plan => plan.id);
  }

  get id() {
    return this._id;
  }

  get sessionDate() {
    return this._sessionDate;
  }

  get workouts() {
    return this._workouts;
  }

  get plans() {
    return this._plans;
  }

  updateWorkoutsList(workoutsList: ID[]) {
    this._workouts = workoutsList;
  }
  
}
