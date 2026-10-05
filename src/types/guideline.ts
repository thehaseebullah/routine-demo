export type GuidelineCategory =
  | 'Safety Protocols'
  | 'Quality Standards'
  | 'Site Logistics'
  | 'Contractual Guidelines'
  | 'Technical Specs';

export interface ProjectGuideline {
  id: string;
  projectId: string; // "ALL" or specific project ID
  title: string;
  fileName: string;
  fileSizeBytes: number;
  fileExtension: string; // "pdf", "docx", "dwg", "xlsx"
  category: GuidelineCategory;
  uploadDate: string;
  description: string;
  uploadedBy: string;
  version: string;
}
