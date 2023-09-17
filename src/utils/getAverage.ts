export default function getAverage(values: number[], roundOff = 2): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((sumAcc, item) => sumAcc + item, 0);

  console.log("DEBUG:GET_AVG:", values, sum);
  return parseFloat((sum / values.length).toFixed(roundOff));
}
