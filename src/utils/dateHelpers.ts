// Date utility functions

/**
 * Calculate which week index a given date falls into within its month
 * Returns 0 for the first week, 1 for the second week, etc.
 */
export function getWeekIndexForDate(date: Date): number {
  const dayOfMonth = date.getDate();
  return Math.floor((dayOfMonth - 1) / 7);
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}
