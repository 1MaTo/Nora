export const getPassedTime = (startTime: number, endTime: number) => {
  const passedTime = endTime - startTime;

  const days = passedTime / (1000 * 60 * 60 * 24);
  const absoluteDays = Math.floor(days);
  const d = absoluteDays > 9 ? absoluteDays : "0" + absoluteDays;

  const hours = (days - absoluteDays) * 24;
  const absoluteHours = Math.floor(hours);
  const h = absoluteHours > 9 ? absoluteHours : "0" + absoluteHours;

  const minutes = (hours - absoluteHours) * 60;
  const absoluteMinutes = Math.floor(minutes);
  const m = absoluteMinutes > 9 ? absoluteMinutes : "0" + absoluteMinutes;

  const seconds = (minutes - absoluteMinutes) * 60;
  const absoluteSeconds = Math.floor(seconds);
  const s = absoluteSeconds > 9 ? absoluteSeconds : "0" + absoluteSeconds;

  if (+d > 0) return `${d}d : ${h}h : ${m}m : ${s}s`;

  if (+h > 0) return `${h}h : ${m}m : ${s}s`;

  if (+m > 0) return `${m}m : ${s}s`;

  return `${s}s`;
};
