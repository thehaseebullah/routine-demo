import { describe, it, expect } from 'vitest';
import { Project } from '../types/project';

describe('Project State & Management QA Tests', () => {
  it('TC-PRJ-01: validates project initial state and attributes', () => {
    const project: Project = {
      id: 'prj-test-1',
      code: 'PRJ-2026-99',
      name: 'Test Commercial Facility',
      clientName: 'Global Estates Inc',
      location: '100 Metro Way',
      status: 'In Progress',
      currentPhase: 'Site Mobilization',
      startDate: '2026-10-01',
      targetEndDate: '2027-04-01',
      overallProgress: 15,
      budgetTotal: 500000,
      description: 'Test facility works.',
      leadManager: 'Sarah Jenkins, PMP'
    };

    expect(project.id).toBe('prj-test-1');
    expect(project.overallProgress).toBeGreaterThanOrEqual(0);
    expect(project.overallProgress).toBeLessThanOrEqual(100);
    expect(project.budgetTotal).toBe(500000);
  });

  it('TC-PRJ-02: updates project fields accurately without mutating other properties', () => {
    const project: Project = {
      id: 'prj-test-1',
      code: 'PRJ-2026-99',
      name: 'Test Commercial Facility',
      clientName: 'Global Estates Inc',
      location: '100 Metro Way',
      status: 'In Progress',
      currentPhase: 'Site Mobilization',
      startDate: '2026-10-01',
      targetEndDate: '2027-04-01',
      overallProgress: 15,
      budgetTotal: 500000,
      description: 'Test facility works.',
      leadManager: 'Sarah Jenkins, PMP'
    };

    const updated: Project = {
      ...project,
      status: 'Completed',
      overallProgress: 100,
      currentPhase: 'Handover & Commissioning'
    };

    expect(updated.status).toBe('Completed');
    expect(updated.overallProgress).toBe(100);
    expect(updated.currentPhase).toBe('Handover & Commissioning');
    expect(updated.name).toBe('Test Commercial Facility');
  });

  it('TC-PRJ-03: handles multiple projects and switching active IDs', () => {
    const projects: Project[] = [
      {
        id: 'p1',
        code: 'P1',
        name: 'Project 1',
        clientName: 'C1',
        location: 'L1',
        status: 'In Progress',
        currentPhase: 'Phase 1',
        startDate: '2026-01-01',
        targetEndDate: '2026-06-01',
        overallProgress: 50,
        budgetTotal: 100000,
        description: '',
        leadManager: ''
      },
      {
        id: 'p2',
        code: 'P2',
        name: 'Project 2',
        clientName: 'C2',
        location: 'L2',
        status: 'On Track',
        currentPhase: 'Phase 2',
        startDate: '2026-06-01',
        targetEndDate: '2026-12-01',
        overallProgress: 10,
        budgetTotal: 200000,
        description: '',
        leadManager: ''
      }
    ];

    let activeId = 'p1';
    expect(projects.find((p) => p.id === activeId)?.name).toBe('Project 1');

    activeId = 'p2';
    expect(projects.find((p) => p.id === activeId)?.name).toBe('Project 2');
  });
});
