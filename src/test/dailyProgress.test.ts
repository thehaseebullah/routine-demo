import { describe, it, expect } from 'vitest';
import {
  sortProgressUpdatesDescending,
  getLatestProgressUpdate
} from '../services/dailyProgressService';
import { DailyProgressUpdate } from '../types/dailyProgress';

describe('Daily Progress Service Logic', () => {
  const updates: DailyProgressUpdate[] = [
    {
      id: '1',
      projectId: 'p1',
      date: '2026-09-28',
      overallProgress: 50,
      completedWork: 'Demolition',
      workInProgress: 'Framing',
      reportedBy: 'Marcus',
      createdAt: '2026-09-28T10:00:00Z'
    },
    {
      id: '2',
      projectId: 'p1',
      date: '2026-10-05',
      overallProgress: 65,
      completedWork: 'HVAC',
      workInProgress: 'Drywall',
      reportedBy: 'Marcus',
      createdAt: '2026-10-05T15:00:00Z'
    },
    {
      id: '3',
      projectId: 'p1',
      date: '2026-10-02',
      overallProgress: 58,
      completedWork: 'Inspection',
      workInProgress: 'HVAC',
      reportedBy: 'Marcus',
      createdAt: '2026-10-02T12:00:00Z'
    }
  ];

  it('TC-PROG-01: sorts updates chronologically descending (latest date first)', () => {
    const sorted = sortProgressUpdatesDescending(updates);
    expect(sorted[0].date).toBe('2026-10-05');
    expect(sorted[1].date).toBe('2026-10-02');
    expect(sorted[2].date).toBe('2026-09-28');
  });

  it('TC-PROG-02: returns the single latest progress update correctly', () => {
    const latest = getLatestProgressUpdate(updates);
    expect(latest?.id).toBe('2');
    expect(latest?.overallProgress).toBe(65);
  });

  it('TC-PROG-03: returns undefined when updates array is empty', () => {
    expect(getLatestProgressUpdate([])).toBeUndefined();
  });
});
