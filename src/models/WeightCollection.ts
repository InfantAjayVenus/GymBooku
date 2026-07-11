import getRandomId, { ID } from "src/utils/getRandomId";

export class WeightCollection {
  _id: ID;
  _weights: Weight[];
  _goal: number;
  _duration: Duration;
  _isOnboarded: boolean;
  _rateOfReduction: number;

  constructor(
    weights: Weight[] = [],
    id = getRandomId(),
    goal = 0,
    duration = { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
    isOnboarded = false,
    rateOfReduction = 0
  ) {
    this._id = id;
    this._weights = weights;
    this._goal = goal;
    this._duration = duration;
    this._isOnboarded = isOnboarded;
    this._rateOfReduction = rateOfReduction;
  }

  get id() {
    return this._id;
  }

  get weights() {
    return this._weights;
  }

  set weights(value: Weight[]) {
    this._weights = value;
  }

  get goal() {
    return this._goal;
  }

  set goal(value: number) {
    this._goal = value;
  }

  get duration() {
    return this._duration;
  }

  set duration(value: Duration) {
    this._duration = value;
  }

  get isOnboarded() {
    return this._isOnboarded;
  }

  set isOnboarded(value: boolean) {
    this._isOnboarded = value;
  }

  get rateOfReduction() {
    return this._rateOfReduction;
  }

  set rateOfReduction(value: number) {
    this._rateOfReduction = value;
  }

  getCopy() {
    return new WeightCollection(
      [...this._weights],
      this._id,
      this._goal,
      this._duration,
      this._isOnboarded,
      this._rateOfReduction
    );
  }

  getWeightById(searchId: ID) {
    return this._weights.find(item => item._id === searchId);
  }

  getWeightByDate(date: Date) {
    return this._weights.find(item => item.timestamp.toDateString() === date.toDateString());
  }
}

export class Weight {
  _id: ID;
  _weightValue: number;
  _timestamp: Date;

  constructor(weight: number, timestamp = new Date(), id = getRandomId()) {
    this._id = id;
    this._timestamp = timestamp;
    this._weightValue = weight;
  }

  get value() {
    return this._weightValue;
  }

  get id() {
    return this._id;
  }

  get timestamp() {
    return this._timestamp;
  }

  getCopy(updatedWeightValue = this._weightValue) {
    return new Weight(updatedWeightValue, this._timestamp, this._id);
  }
}

interface Duration {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
