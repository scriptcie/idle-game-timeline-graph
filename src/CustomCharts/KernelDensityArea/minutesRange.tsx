// Returns an array of dates where each date is separated with the amount of
// minutes given by interval
export const minutesRange = (start: Date, end: Date, interval = 1) => {
  const dates = [];
  for (
    var date = new Date(start);
    date <= end;
    date.setMinutes(date.getMinutes() + interval)
  ) {
    dates.push(new Date(date));
  }
  return dates;
};
