export interface TimesheetEntry {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  workerName: string;
  taskId?: string;
  taskTitle: string;
  hours: number;
  description: string;
}

export interface DailyTimesheetSummary {
  date: string;
  totalHours: number;
  entries: TimesheetEntry[];
}
