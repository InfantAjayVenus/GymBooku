import dayjs from "dayjs";
import WeekOfYear from 'dayjs/plugin/weekOfYear';

export default function getWeek(date: Date): number {
  dayjs.extend(WeekOfYear)
  return dayjs(date).week();
}
