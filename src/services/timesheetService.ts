import { TimesheetEntry, DailyTimesheetSummary } from '../types/timesheet';

/**
 * Calculates total cumulative hours for a given set of entries.
 */
export function calculateTotalHours(entries: TimesheetEntry[]): number {
  return Math.round(entries.reduce((sum, e) => sum + (Number(e.hours) || 0), 0) * 10) / 10;
}

/**
 * Groups timesheet entries by date descending, calculating total daily hours.
 */
export function groupTimesheetsByDate(entries: TimesheetEntry[]): DailyTimesheetSummary[] {
  const groups: Record<string, TimesheetEntry[]> = {};

  entries.forEach((entry) => {
    const d = entry.date || 'Undated';
    if (!groups[d]) {
      groups[d] = [];
    }
    groups[d].push(entry);
  });

  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => {
      const dayEntries = groups[date];
      const totalHours = calculateTotalHours(dayEntries);
      return {
        date,
        totalHours,
        entries: dayEntries
      };
    });
}
