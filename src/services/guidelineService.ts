import { ProjectGuideline } from '../types/guideline';

/**
 * Format bytes into human-readable string (e.g. 2.4 MB, 890 KB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Helper to get file extension label or badge styling.
 */
export function getExtensionBadgeColor(extension: string): { bg: string; text: string } {
  const ext = extension.toLowerCase();
  switch (ext) {
    case 'pdf':
      return { bg: '#FEF2F2', text: '#DC2626' };
    case 'docx':
    case 'doc':
      return { bg: '#EFF6FF', text: '#0052CC' };
    case 'xlsx':
    case 'xls':
      return { bg: '#ECFDF5', text: '#059669' };
    case 'dwg':
    case 'cad':
      return { bg: '#FDF4FF', text: '#9333EA' };
    default:
      return { bg: '#F1F5F9', text: '#475569' };
  }
}
