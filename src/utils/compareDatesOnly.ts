export default function compareDatesOnly(date1: Date, date2: Date): boolean {
  // Get the date components of the objects
  const day1 = date1.getDate();
  const month1 = date1.getMonth();
  const year1 = date1.getFullYear();

  const day2 = date2.getDate();
  const month2 = date2.getMonth();
  const year2 = date2.getFullYear();

  // Compare the date components
  return (year1 === year2 && month1 === month2 && day1 === day2);
}