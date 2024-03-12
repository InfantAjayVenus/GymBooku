import getRandomId, { ID } from "src/utils/getRandomId";

export class WeightCollection {
  _id: ID;
  _weights: Weight[];
  _goal: number;
  _duration: Duration;

  constructor(weights: Weight[] = [], id = getRandomId(), goal = 0, duration = { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }) {
    this._id = id;
    this._weights = weights;
    this._goal = goal;
    this._duration = duration;
  }

  static fromJSON(rawJSON: any) {
    return new WeightCollection(
      rawJSON._weights.map((rawWeight: any) => Weight.fromJSON(rawWeight)),
      rawJSON._id,
      rawJSON._goal,
      rawJSON._duration
    );
  }

  set weights(value: Weight[]) {
    this._weights = value;
  }

  set goal(value: number) {
    this._goal = value;
  }

  set duration(value: Duration) {
    this._duration = value;
  }

  get id() {
    return this._id;
  }

  get weights() {
    return this._weights;
  }

  get goal() {
    return this._goal;
  }

  get duration() {
    return this._duration;
  }

  getCopy() {
    return new WeightCollection([...this._weights], this._id, this._goal, this._duration);
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

  static fromJSON(rawJSON: any) {
    return new Weight(rawJSON._weightValue, new Date(rawJSON._timestamp), rawJSON._id);
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

  getCopy({updatedWeightValue=this._weightValue, updatedDate=this._timestamp}) {
    return new Weight(updatedWeightValue, updatedDate, this._id);
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
