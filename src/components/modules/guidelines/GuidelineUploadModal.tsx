import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { ProjectGuideline, GuidelineCategory } from '../../../types/guideline';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Textarea } from '../../common/Textarea';
import { Button } from '../../common/Button';
import { APP_CONFIG } from '../../../config/appConfig';

interface GuidelineUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Omit<ProjectGuideline, 'id' | 'uploadDate'>) => void;
  onUpdate?: (doc: ProjectGuideline) => void;
  initialData?: ProjectGuideline | null;
  projectId: string;
}

export const GuidelineUploadModal: React.FC<GuidelineUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  initialData,
  projectId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GuidelineCategory>(APP_CONFIG.guidelineCategories[0] as GuidelineCategory);
  const [fileName, setFileName] = useState('');
  const [fileSizeBytes, setFileSizeBytes] = useState(1500000);
  const [fileExtension, setFileExtension] = useState('pdf');
  const [version, setVersion] = useState('Rev 1.0');
  const [description, setDescription] = useState('');
  const [uploadedBy, setUploadedBy] = useState('Compliance Administrator');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setFileName(initialData.fileName);
      setFileSizeBytes(initialData.fileSizeBytes);
      setFileExtension(initialData.fileExtension);
      setVersion(initialData.version);
      setDescription(initialData.description || '');
      setUploadedBy(initialData.uploadedBy);
    } else {
      setTitle('');
      setCategory(APP_CONFIG.guidelineCategories[0] as GuidelineCategory);
      setFileName('');
      setFileSizeBytes(1500000);
      setFileExtension('pdf');
      setVersion('Rev 1.0');
      setDescription('');
      setUploadedBy('Compliance Administrator');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSizeBytes(file.size || 1200000);
      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      setFileExtension(ext);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleApplyPreset = (presetName: string, presetFile: string, presetCategory: GuidelineCategory, ext: string) => {
    setTitle(presetName);
    setFileName(presetFile);
    setCategory(presetCategory);
    setFileExtension(ext);
    setFileSizeBytes(1850000);
    setDescription(`Official project guideline covering ${presetCategory.toLowerCase()} and compliance.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Document title is required.';
    }
    if (!fileName.trim()) {
      newErrors.fileName = 'File attachment simulation is required (choose file or template).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (initialData && onUpdate) {
      onUpdate({
        ...initialData,
        title: title.trim(),
        fileName: fileName.trim(),
        fileSizeBytes,
        fileExtension,
        category,
        description: description.trim(),
        uploadedBy: uploadedBy.trim(),
        version: version.trim() || 'Rev 1.0'
      });
    } else {
      onSave({
        projectId,
        title: title.trim(),
        fileName: fileName.trim(),
        fileSizeBytes,
        fileExtension,
        category,
        description: description.trim(),
        uploadedBy: uploadedBy.trim(),
        version: version.trim() || 'Rev 1.0'
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Project Guideline" : "Upload Project Guideline (Simulation)"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {initialData ? "Save Changes" : "Register Guideline"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* File Dropzone Simulation */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: fileName ? 'var(--blue-subtle)' : 'var(--bg-subtle)',
            transition: 'background 120ms ease'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {fileName ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={28} color="var(--blue-primary)" />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Attached: {fileName}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Click to choose a different local file
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <UploadCloud size={28} color="var(--text-muted)" />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Select local document or click below for standard templates
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Supports PDF, DOCX, DWG, XLSX (simulated upload)
              </span>
            </div>
          )}
        </div>
        {errors.fileName && <span className="form-error-hint">{errors.fileName}</span>}

        {/* Quick Industry Presets */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Or choose a quick preset guideline:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            <button
              type="button"
              className="role-tab-btn"
              onClick={() => handleApplyPreset('Site Fire Safety & Hot-Work Code', 'Site_Fire_Safety_Code_V2.pdf', 'Safety Protocols', 'pdf')}
            >
              + Fire Safety Code (.pdf)
            </button>
            <button
              type="button"
              className="role-tab-btn"
              onClick={() => handleApplyPreset('HVAC Duct Pressure Testing Spec', 'HVAC_Testing_Spec_09_RevB.docx', 'Quality Standards', 'docx')}
            >
              + HVAC Spec (.docx)
            </button>
            <button
              type="button"
              className="role-tab-btn"
              onClick={() => handleApplyPreset('Curtain Wall Anchor Standard DWG', 'Facade_Anchor_Detail_Rev3.dwg', 'Technical Specs', 'dwg')}
            >
              + Facade Anchor (.dwg)
            </button>
          </div>
        </div>

        <Input
          label="Guideline Title *"
          placeholder="e.g. Site Safety Protocol & Emergency Evacuation Manual"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: '' });
          }}
          error={errors.title}
          required
        />

        <div className="form-row">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as GuidelineCategory)}
          >
            {APP_CONFIG.guidelineCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <Input
            label="Version / Revision"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>

        <Textarea
          label="Scope & Compliance Description"
          placeholder="Summary of requirements, mandatory standards, or application criteria..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />

        <Input
          label="Governance / Uploader Name"
          value={uploadedBy}
          onChange={(e) => setUploadedBy(e.target.value)}
        />
      </form>
    </Modal>
  );
};
