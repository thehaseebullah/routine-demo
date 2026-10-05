import { describe, it, expect } from 'vitest';
import { syncTaskStatusAndProgress, filterTasks } from '../services/taskService';
import { Task } from '../types/task';

describe('Task Service Logic', () => {
  it('TC-TSK-01: moving status to Completed sets progress to 100%', () => {
    const result = syncTaskStatusAndProgress(
      { status: 'In Progress', progress: 50 },
      'status',
      'Completed'
    );
    expect(result.status).toBe('Completed');
    expect(result.progress).toBe(100);
  });

  it('TC-TSK-02: moving progress to 100% sets status to Completed', () => {
    const result = syncTaskStatusAndProgress(
      { status: 'In Progress', progress: 40 },
      'progress',
      100
    );
    expect(result.status).toBe('Completed');
    expect(result.progress).toBe(100);
  });

  it('TC-TSK-03: moving progress from 0 to 50% updates status to In Progress', () => {
    const result = syncTaskStatusAndProgress(
      { status: 'Not Started', progress: 0 },
      'progress',
      50
    );
    expect(result.status).toBe('In Progress');
    expect(result.progress).toBe(50);
  });

  it('TC-TSK-04: moving progress to 0% when previously Completed updates status to Not Started', () => {
    const result = syncTaskStatusAndProgress(
      { status: 'Completed', progress: 100 },
      'progress',
      0
    );
    expect(result.status).toBe('Not Started');
    expect(result.progress).toBe(0);
  });

  it('TC-TSK-05: filters tasks accurately by status and priority', () => {
    const tasks: Task[] = [
      {
        id: '1',
        projectId: 'p1',
        title: 'Task A',
        description: '',
        assignee: 'Alice',
        status: 'In Progress',
        priority: 'High',
        progress: 40,
        dueDate: '2026-10-10'
      },
      {
        id: '2',
        projectId: 'p1',
        title: 'Task B',
        description: '',
        assignee: 'Bob',
        status: 'Completed',
        priority: 'High',
        progress: 100,
        dueDate: '2026-10-12'
      },
      {
        id: '3',
        projectId: 'p1',
        title: 'Task C',
        description: '',
        assignee: 'Charlie',
        status: 'In Progress',
        priority: 'Low',
        progress: 20,
        dueDate: '2026-10-15'
      }
    ];

    const highTasks = filterTasks(tasks, 'ALL', 'High');
    expect(highTasks).toHaveLength(2);

    const inProgressHigh = filterTasks(tasks, 'In Progress', 'High');
    expect(inProgressHigh).toHaveLength(1);
    expect(inProgressHigh[0].title).toBe('Task A');
  });
});
