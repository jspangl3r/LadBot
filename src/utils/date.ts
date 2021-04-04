/**
 * Calculates the difference between 2 dates in days.
 * @param date1 The earlier date.
 * @param date2 The later date.
 * @return The number of days between the 2 dates.
 */
export function getDifferenceInDays(date1: Date, date2: Date): number {
  // To calculate the time difference of two dates
  const differenceInTime = date2.getTime() - date1.getTime();

  // To calculate the number of days between two dates
  return Math.round(differenceInTime / (1000 * 3600 * 24));
}

/**
 * Returns an ISO date string from the input {@code #date}.
 * @param date Expected to be a valid {@code Date} object.
 * @returns ISO date string from the input {@code #date}.
 */
export function toISODateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}
