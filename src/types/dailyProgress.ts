export interface DailyProgressUpdate {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  overallProgress: number; // 0 - 100
  completedWork: string;
  workInProgress: string;
  blockers?: string;
  weatherConditions?: string;
  notes?: string;
  reportedBy: string;
  createdAt: string;
}
