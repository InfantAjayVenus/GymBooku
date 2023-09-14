export default function getWeek(date: Date): number {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const daysDifference = (date.valueOf() - yearStart.valueOf()) / (24 * 60 * 60 * 1000);
  return Math.ceil((daysDifference + yearStart.getDay() + 1) / 7);
}
