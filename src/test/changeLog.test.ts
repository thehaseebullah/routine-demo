import { describe, it, expect } from 'vitest';
import {
  calculateNetApprovedCostImpact,
  calculateNetApprovedScheduleImpactDays,
  countPendingChanges
} from '../services/changeLogService';
import { ChangeLogItem } from '../types/changeLog';

describe('Change Log Service Logic', () => {
  const changes: ChangeLogItem[] = [
    {
      id: '1',
      projectId: 'p1',
      changeNumber: 'CR-001',
      title: 'Acoustic Glass',
      dateRequested: '2026-09-20',
      requestedBy: 'Client',
      description: 'Upgrade glass',
      reason: 'Privacy',
      costImpact: 5000,
      scheduleImpactDays: 2,
      status: 'Approved'
    },
    {
      id: '2',
      projectId: 'p1',
      changeNumber: 'CR-002',
      title: 'Floor Boxes',
      dateRequested: '2026-09-25',
      requestedBy: 'Designer',
      description: 'Add floor boxes',
      reason: 'Desks',
      costImpact: 2500,
      scheduleImpactDays: 0,
      status: 'Approved'
    },
    {
      id: '3',
      projectId: 'p1',
      changeNumber: 'CR-003',
      title: 'Pipe Offset',
      dateRequested: '2026-10-01',
      requestedBy: 'Engineer',
      description: 'Offset pipe',
      reason: 'Obstruction',
      costImpact: 1200,
      scheduleImpactDays: 1,
      status: 'Pending Review'
    },
    {
      id: '4',
      projectId: 'p1',
      changeNumber: 'CR-004',
      title: 'Unnecessary Tile',
      dateRequested: '2026-10-02',
      requestedBy: 'Contractor',
      description: 'Extra tiles',
      reason: 'Aesthetics',
      costImpact: 4000,
      scheduleImpactDays: 4,
      status: 'Rejected'
    }
  ];

  it('TC-CHG-01: calculates net approved cost impact accurately (omitting pending & rejected)', () => {
    const netCost = calculateNetApprovedCostImpact(changes);
    expect(netCost).toBe(7500); // 5000 + 2500
  });

  it('TC-CHG-02: calculates net approved schedule impact days', () => {
    const netDays = calculateNetApprovedScheduleImpactDays(changes);
    expect(netDays).toBe(2); // 2 + 0
  });

  it('TC-CHG-03: counts pending review changes accurately', () => {
    const pending = countPendingChanges(changes);
    expect(pending).toBe(1);
  });
});
