export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number; // 0 - 100
  dueDate: string;
  boqReferenceId?: string;
  boqReferenceDesc?: string;
}
