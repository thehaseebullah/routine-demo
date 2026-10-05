import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  CloudSun,
  Edit2,
  Trash2
} from 'lucide-react';
import { useProject } from '../../../context/ProjectContext';
import { useRole } from '../../../context/RoleContext';
import { DailyProgressUpdate } from '../../../types/dailyProgress';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { ProgressBar } from '../../common/ProgressBar';
import { EmptyState } from '../../common/EmptyState';
import { DailyProgressModal } from './DailyProgressModal';
import { sortProgressUpdatesDescending } from '../../../services/dailyProgressService';

export const DailyProgressTimeline: React.FC = () => {
  const {
    dailyProgressUpdates,
    activeProject,
    addDailyProgressUpdate,
    updateDailyProgressUpdate,
    deleteDailyProgressUpdate
  } = useProject();
  const { role } = useRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<DailyProgressUpdate | null>(null);

  if (!activeProject) return null;

  const isClientRole = role === 'client';
  const sortedUpdates = sortProgressUpdatesDescending(dailyProgressUpdates);
  const latestUpdate = sortedUpdates[0];

  const handleOpenAdd = () => {
    setEditingUpdate(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (update: DailyProgressUpdate) => {
    setEditingUpdate(update);
    setIsModalOpen(true);
  };

  const handleSave = (data: Omit<DailyProgressUpdate, 'id' | 'createdAt'>, editingId?: string) => {
    if (editingId) {
      const existing = dailyProgressUpdates.find((u) => u.id === editingId);
      if (existing) {
        updateDailyProgressUpdate({
          ...existing,
          ...data
        });
      }
    } else {
      addDailyProgressUpdate(data);
    }
  };

  const handleDelete = (id: string, date: string) => {
    if (window.confirm(`Delete site progress log for ${date}?`)) {
      deleteDailyProgressUpdate(id);
    }
  };

  return (
    <div className="main-view-container">
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
              <TrendingUp size={18} color="var(--blue-primary)" />
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>
                {isClientRole ? 'Verified Field Progress Timeline' : 'Daily Project Progress'}
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Chronological site execution record, milestone completions, and active blockers
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Current Milestone Status
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blue-primary)'
                }}
              >
                {activeProject.overallProgress}% Complete
              </div>
            </div>

            {!isClientRole && (
              <Button
                variant="primary"
                onClick={handleOpenAdd}
                icon={<Plus size={16} />}
              >
                Add Daily Update
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Latest Highlight Banner */}
      {latestUpdate && (
        <Card
          className="latest-progress-card"
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--blue-primary)',
                  display: 'inline-block'
                }}
              />
              <span>Latest Verified Site Log — {latestUpdate.date}</span>
            </div>
          }
          subtitle={`Reported by ${latestUpdate.reportedBy}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Cumulative Completion
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <ProgressBar progress={latestUpdate.overallProgress} />
                <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', minWidth: '40px' }}>
                  {latestUpdate.overallProgress}%
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '6px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--emerald-primary)', textTransform: 'uppercase' }}>
                  Work Completed Today
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {latestUpdate.completedWork}
                </p>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--blue-primary)', textTransform: 'uppercase' }}>
                  Current In-Progress Focus
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {latestUpdate.workInProgress}
                </p>
              </div>
            </div>

            {latestUpdate.blockers && (
              <div className="alert-callout warning">
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Active Field Blocker:</strong>
                  <p style={{ marginTop: '2px' }}>{latestUpdate.blockers}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Chronological Timeline */}
      {sortedUpdates.length === 0 ? (
        <EmptyState
          icon={<TrendingUp className="empty-state-icon" />}
          title="No daily progress updates yet."
          description="Log daily progress updates to establish a verified chronological site timeline."
          actionText={!isClientRole ? 'Record First Update' : undefined}
          onAction={!isClientRole ? handleOpenAdd : undefined}
          actionIcon={<Plus size={15} />}
        />
      ) : (
        <div className="timeline-container">
          {sortedUpdates.map((update, idx) => (
            <div key={update.id} className="timeline-node">
              <div className="timeline-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="var(--blue-primary)" />
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {update.date}
                    </strong>
                    {idx === 0 && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: 'var(--blue-subtle)',
                          color: 'var(--blue-primary)',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        Most Recent
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)' }}>
                      {update.overallProgress}% Overall
                    </span>

                    {!isClientRole && (
                      <div style={{ display: 'inline-flex', gap: '2px', marginLeft: '6px' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEdit(update)}
                          aria-label={`Edit update for ${update.date}`}
                          icon={<Edit2 size={12} />}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(update.id, update.date)}
                          aria-label={`Delete update for ${update.date}`}
                          icon={<Trash2 size={12} />}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Executed &amp; Completed:
                    </span>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {update.completedWork}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Active Works:
                    </span>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {update.workInProgress}
                    </p>
                  </div>

                  {update.blockers && (
                    <div className="alert-callout warning">
                      <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ fontSize: '12px' }}>
                        <strong>Site Blocker: </strong>
                        {update.blockers}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '14px',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span>Reported by: <strong>{update.reportedBy}</strong></span>
                    {update.weatherConditions && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CloudSun size={12} />
                        {update.weatherConditions}
                      </span>
                    )}
                    {update.notes && <span>Notes: {update.notes}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <DailyProgressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingUpdate={editingUpdate}
        currentProjectProgress={activeProject.overallProgress}
        projectId={activeProject.id}
      />
    </div>
  );
};
