import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Download,
  Eye,
  FileText,
  Calendar,
  User,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { ProjectGuideline, GuidelineCategory } from '../../../types/guideline';
import { useProject } from '../../../context/ProjectContext';
import { useRole } from '../../../context/RoleContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';
import { GuidelineUploadModal } from './GuidelineUploadModal';
import { formatFileSize, getExtensionBadgeColor } from '../../../services/guidelineService';
import { APP_CONFIG } from '../../../config/appConfig';

export const GuidelineList: React.FC = () => {
  const { guidelines, activeProject, addGuideline, updateGuideline, deleteGuideline } = useProject();
  const { role } = useRole();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<ProjectGuideline | null>(null);
  const [inspectingGuideline, setInspectingGuideline] = useState<ProjectGuideline | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  if (!activeProject) return null;

  const isAdminRole = role === 'admin';

  const filteredGuidelines = guidelines.filter((g) => {
    if (categoryFilter === 'ALL') return true;
    return g.category === categoryFilter;
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete guideline: "${title}"?`)) {
      deleteGuideline(id);
    }
  };

  const handleSimulateDownload = (guideline: ProjectGuideline) => {
    setDownloadToast(`Simulated download started for "${guideline.fileName}"`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="main-view-container">
      {/* Toast Alert */}
      {downloadToast && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-modal)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 100
          }}
        >
          <CheckCircle2 size={16} color="#34D399" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Header Card */}
      <Card>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--blue-primary)" />
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>
                {isAdminRole ? 'Project Guidelines & Standards (Admin Module)' : 'Project Guidelines'}
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Official project standards, safety manuals, technical specifications, and site protocols
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAdminRole && (
              <Button
                variant="primary"
                onClick={() => {
                  setEditingGuideline(null);
                  setIsUploadModalOpen(true);
                }}
                icon={<Plus size={16} />}
              >
                Upload Guideline
              </Button>
            )}

            {!isAdminRole && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditingGuideline(null);
                  setIsUploadModalOpen(true);
                }}
                icon={<Plus size={14} />}
              >
                Simulate Upload
              </Button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <button
            type="button"
            className={`role-tab-btn ${categoryFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('ALL')}
          >
            All Standards ({guidelines.length})
          </button>
          {APP_CONFIG.guidelineCategories.map((c) => {
            const count = guidelines.filter((g) => g.category === c).length;
            return (
              <button
                key={c}
                type="button"
                className={`role-tab-btn ${categoryFilter === c ? 'active' : ''}`}
                onClick={() => setCategoryFilter(c)}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Guidelines List or Empty State */}
      {guidelines.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="empty-state-icon" />}
          title="No project guidelines uploaded yet."
          description="Upload safety protocols, QA/QC standards, and contractual rules for this project."
          actionText="Upload First Guideline"
          onAction={() => setIsUploadModalOpen(true)}
          actionIcon={<Plus size={15} />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredGuidelines.map((doc) => {
            const badgeStyle = getExtensionBadgeColor(doc.fileExtension);
            return (
              <Card key={doc.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Extension Badge */}
                    <div
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: badgeStyle.bg,
                        color: badgeStyle.text,
                        fontWeight: 700,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {doc.fileExtension}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {doc.title}
                        </h3>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {doc.version}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        File: <code>{doc.fileName}</code> &bull; {formatFileSize(doc.fileSizeBytes)}
                      </div>

                      {doc.description && (
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setInspectingGuideline(doc)}
                      title="Inspect Document"
                      icon={<Eye size={13} />}
                    >
                      View
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSimulateDownload(doc)}
                      title="Download File"
                      icon={<Download size={13} />}
                    >
                      Download
                    </Button>

                    {isAdminRole && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditingGuideline(doc);
                            setIsUploadModalOpen(true);
                          }}
                          title="Edit Guideline"
                          icon={<Edit2 size={13} />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(doc.id, doc.title)}
                          aria-label={`Delete ${doc.title}`}
                          icon={<Trash2 size={13} />}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Footer metadata */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    paddingTop: '8px',
                    marginTop: '8px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Shield size={12} color="var(--blue-primary)" />
                    Category: <strong>{doc.category}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} />
                    Uploaded by: {doc.uploadedBy}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    Registered: {doc.uploadDate}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <GuidelineUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={(data) => addGuideline(data)}
        projectId={activeProject.id}
      />

      {/* Inspect Document Modal */}
      <Modal
        isOpen={Boolean(inspectingGuideline)}
        onClose={() => setInspectingGuideline(null)}
        title={inspectingGuideline ? inspectingGuideline.title : 'Document Details'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setInspectingGuideline(null)}>
              Close
            </Button>
            {inspectingGuideline && (
              <Button
                variant="primary"
                onClick={() => {
                  handleSimulateDownload(inspectingGuideline);
                  setInspectingGuideline(null);
                }}
                icon={<Download size={14} />}
              >
                Download {inspectingGuideline.fileExtension.toUpperCase()}
              </Button>
            )}
          </>
        }
      >
        {inspectingGuideline && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Document Identifier
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {inspectingGuideline.fileName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Category: <strong>{inspectingGuideline.category}</strong> &bull; Size: {formatFileSize(inspectingGuideline.fileSizeBytes)} &bull; {inspectingGuideline.version}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Compliance Scope &amp; Application:
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
                {inspectingGuideline.description || 'Standard technical guidelines and quality criteria for this operational phase.'}
              </p>
            </div>

            <div
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                background: 'var(--bg-canvas)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Simulated Document Content Preview:
              </div>
              <p>
                1. <strong>Mandatory Compliance:</strong> All subcontractors, site engineers, and trade foremen must adhere strictly to the protocols described in this document.
              </p>
              <p style={{ marginTop: '6px' }}>
                2. <strong>Inspection Sign-Off:</strong> Pre-pour and pre-close inspections require consultant signature 24 hours prior to covering works.
              </p>
              <p style={{ marginTop: '6px' }}>
                3. <strong>Discrepancies:</strong> Any variance between architectural drawings and site as-builts must be logged immediately into the Change Review Log.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Guideline Upload / Edit Modal */}
      <GuidelineUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingGuideline(null);
        }}
        onSave={addGuideline}
        onUpdate={updateGuideline}
        initialData={editingGuideline}
        projectId={activeProject.id}
      />
    </div>
  );
};
