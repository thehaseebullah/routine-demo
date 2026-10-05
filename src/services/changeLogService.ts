import { ChangeLogItem } from '../types/changeLog';

/**
 * Calculates net cost impact of all approved changes.
 */
export function calculateNetApprovedCostImpact(changes: ChangeLogItem[]): number {
  return changes
    .filter((c) => c.status === 'Approved')
    .reduce((sum, c) => sum + (Number(c.costImpact) || 0), 0);
}

/**
 * Calculates net schedule impact days of approved changes.
 */
export function calculateNetApprovedScheduleImpactDays(changes: ChangeLogItem[]): number {
  return changes
    .filter((c) => c.status === 'Approved')
    .reduce((sum, c) => sum + (Number(c.scheduleImpactDays) || 0), 0);
}

/**
 * Counts pending review changes.
 */
export function countPendingChanges(changes: ChangeLogItem[]): number {
  return changes.filter((c) => c.status === 'Pending Review').length;
}
