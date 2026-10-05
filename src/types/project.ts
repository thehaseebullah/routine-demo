export type ProjectStatus = 'In Progress' | 'On Track' | 'Delayed' | 'Completed';

export interface Project {
  id: string;
  code: string;
  name: string;
  clientName: string;
  location: string;
  status: ProjectStatus;
  currentPhase: string;
  startDate: string;
  targetEndDate: string;
  overallProgress: number; // 0 to 100
  budgetTotal: number;
  description: string;
  leadManager: string;
}
