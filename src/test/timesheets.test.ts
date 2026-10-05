import { describe, it, expect } from 'vitest';
import { calculateTotalHours, groupTimesheetsByDate } from '../services/timesheetService';
import { TimesheetEntry } from '../types/timesheet';

describe('Timesheet Service Logic', () => {
  it('TC-TIME-01: calculates total cumulative hours accurately', () => {
    const entries: TimesheetEntry[] = [
      {
        id: '1',
        projectId: 'p1',
        date: '2026-10-05',
        workerName: 'Dave',
        taskTitle: 'HVAC',
        hours: 8.5,
        description: 'Ductwork'
      },
      {
        id: '2',
        projectId: 'p1',
        date: '2026-10-05',
        workerName: 'Liam',
        taskTitle: 'Cables',
        hours: 7.25,
        description: 'Wiring'
      }
    ];

    expect(calculateTotalHours(entries)).toBe(15.8);
  });

  it('TC-TIME-02: groups timesheet entries by date descending with daily sums', () => {
    const entries: TimesheetEntry[] = [
      {
        id: '1',
        projectId: 'p1',
        date: '2026-10-04',
        workerName: 'Dave',
        taskTitle: 'HVAC',
        hours: 8.0,
        description: ''
      },
      {
        id: '2',
        projectId: 'p1',
        date: '2026-10-05',
        workerName: 'Liam',
        taskTitle: 'Cables',
        hours: 6.0,
        description: ''
      },
      {
        id: '3',
        projectId: 'p1',
        date: '2026-10-05',
        workerName: 'Sarah',
        taskTitle: 'Paint',
        hours: 4.5,
        description: ''
      }
    ];

    const groups = groupTimesheetsByDate(entries);
    expect(groups).toHaveLength(2);
    expect(groups[0].date).toBe('2026-10-05');
    expect(groups[0].totalHours).toBe(10.5);
    expect(groups[0].entries).toHaveLength(2);

    expect(groups[1].date).toBe('2026-10-04');
    expect(groups[1].totalHours).toBe(8.0);
  });

  it('TC-TIME-03: returns empty array for empty timesheet list', () => {
    expect(calculateTotalHours([])).toBe(0);
    expect(groupTimesheetsByDate([])).toHaveLength(0);
  });
});
