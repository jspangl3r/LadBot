/**
 * Returns a date label for the difference between two dates in days.
 * @param date1 The earlier date.
 * @param date2 The later date.
 * @return The date label for the difference the two dates.
 */
export function daysAgoLabel(date1: Date, date2: Date): string {
  // To calculate the time difference of two dates
  const differenceInTime = date2.getTime() - date1.getTime();

  // To calculate the number of days between two dates
  const daysAgo = Math.round(differenceInTime / (1000 * 3600 * 24));

  if (daysAgo === 0) return "Today";
  else if (daysAgo === 1) return "Yesterday";
  else return `${daysAgo} days ago`;
}
