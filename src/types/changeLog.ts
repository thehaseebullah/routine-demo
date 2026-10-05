export type ChangeReviewStatus = 'Pending Review' | 'Approved' | 'Rejected';

export interface ChangeLogItem {
  id: string;
  projectId: string;
  changeNumber: string; // e.g. "CR-001"
  title: string;
  dateRequested: string;
  requestedBy: string;
  description: string;
  reason: string;
  costImpact: number; // Positive = added cost, Negative = savings, 0 = neutral
  scheduleImpactDays: number; // Days added or removed
  status: ChangeReviewStatus;
  reviewNotes?: string;
  reviewedDate?: string;
  reviewedBy?: string;
}
