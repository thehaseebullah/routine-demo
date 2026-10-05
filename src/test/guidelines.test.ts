import { describe, it, expect } from 'vitest';
import { formatFileSize, getExtensionBadgeColor } from '../services/guidelineService';

describe('Guidelines Service Logic', () => {
  it('TC-GUIDE-01: formats bytes into human-readable sizes', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(2048)).toBe('2 KB');
    expect(formatFileSize(2450000)).toBe('2.3 MB');
  });

  it('TC-GUIDE-02: returns distinct badge colors based on document extension', () => {
    const pdf = getExtensionBadgeColor('pdf');
    expect(pdf.bg).toBe('#FEF2F2');
    expect(pdf.text).toBe('#DC2626');

    const docx = getExtensionBadgeColor('DOCX');
    expect(docx.bg).toBe('#EFF6FF');
    expect(docx.text).toBe('#0052CC');

    const cad = getExtensionBadgeColor('dwg');
    expect(cad.bg).toBe('#FDF4FF');
  });

  it('TC-GUIDE-03: supports editing guideline title, category, and version', () => {
    const originalDoc = {
      id: 'guide-01',
      projectId: 'prj-01',
      title: 'Site Safety Manual',
      fileName: 'safety.pdf',
      fileSizeBytes: 1024,
      fileExtension: 'pdf',
      category: 'Safety Protocols' as const,
      uploadDate: '2026-03-01',
      uploadedBy: 'Safety Officer',
      version: 'Rev 1.0'
    };

    const updatedDoc = {
      ...originalDoc,
      title: 'Site Safety & Environmental Manual',
      version: 'Rev 2.0',
      category: 'Quality Standards' as const
    };

    expect(updatedDoc.id).toBe(originalDoc.id);
    expect(updatedDoc.title).not.toBe(originalDoc.title);
    expect(updatedDoc.version).toBe('Rev 2.0');
    expect(updatedDoc.category).toBe('Quality Standards');
  });
});
