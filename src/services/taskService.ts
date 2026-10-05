import { Task, TaskStatus } from '../types/task';

/**
 * Synchronizes status and progress:
 * - If status is set to 'Completed', progress becomes 100
 * - If progress becomes 100, status becomes 'Completed'
 * - If progress is between 1-99 and status was 'Not Started', status becomes 'In Progress'
 * - If progress becomes 0 and status was 'Completed', status becomes 'Not Started'
 */
export function syncTaskStatusAndProgress(
  current: { status: TaskStatus; progress: number },
  changedField: 'status' | 'progress',
  newValue: TaskStatus | number
): { status: TaskStatus; progress: number } {
  let status = current.status;
  let progress = current.progress;

  if (changedField === 'status') {
    status = newValue as TaskStatus;
    if (status === 'Completed') {
      progress = 100;
    } else if (status === 'Not Started' && progress === 100) {
      progress = 0;
    } else if (status === 'In Progress' && progress === 0) {
      progress = 25; // Sensible default when moving to in-progress
    }
  } else {
    progress = Math.min(100, Math.max(0, Number(newValue) || 0));
    if (progress === 100) {
      status = 'Completed';
    } else if (progress > 0 && status === 'Not Started') {
      status = 'In Progress';
    } else if (progress === 0 && status === 'Completed') {
      status = 'Not Started';
    }
  }

  return { status, progress };
}

export function filterTasks(
  tasks: Task[],
  statusFilter: string,
  priorityFilter: string
): Task[] {
  return tasks.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });
}
