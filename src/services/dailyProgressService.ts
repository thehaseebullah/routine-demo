import { DailyProgressUpdate } from '../types/dailyProgress';

/**
 * Sorts daily progress updates chronologically descending (latest first).
 */
export function sortProgressUpdatesDescending(
  updates: DailyProgressUpdate[]
): DailyProgressUpdate[] {
  return [...updates].sort((a, b) => {
    const dateComp = b.date.localeCompare(a.date);
    if (dateComp !== 0) return dateComp;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
}

/**
 * Retrieves the most recent progress update.
 */
export function getLatestProgressUpdate(
  updates: DailyProgressUpdate[]
): DailyProgressUpdate | undefined {
  const sorted = sortProgressUpdatesDescending(updates);
  return sorted[0];
}
