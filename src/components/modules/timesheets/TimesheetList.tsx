import React, { useState } from 'react';
import { Clock, Plus, Trash2, Edit2, Calendar, User, CheckCircle2 } from 'lucide-react';
import { useProject } from '../../../context/ProjectContext';
import { TimesheetEntry } from '../../../types/timesheet';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { EmptyState } from '../../common/EmptyState';
import { TimesheetModal } from './TimesheetModal';
import { calculateTotalHours, groupTimesheetsByDate } from '../../../services/timesheetService';

export const TimesheetList: React.FC = () => {
  const { timesheets, activeProject, addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);

  if (!activeProject) return null;

  const totalHours = calculateTotalHours(timesheets);
  const groupedTimesheets = groupTimesheetsByDate(timesheets);

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleSave = (entryData: Omit<TimesheetEntry, 'id'>, editingId?: string) => {
    if (editingId) {
      updateTimesheetEntry({
        ...entryData,
        id: editingId
      });
    } else {
      addTimesheetEntry(entryData);
    }
  };

  const handleDelete = (id: string, workerName: string) => {
    if (window.confirm(`Delete timesheet entry for ${workerName}?`)) {
      deleteTimesheetEntry(id);
    }
  };

  return (
    <div className="main-view-container">
      {/* Header Summary */}
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
              <Clock size={18} color="var(--blue-primary)" />
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Project Timesheets</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Field labor hours, subcontractor tracking, and site effort logs
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Total Cumulative Hours
              </div>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blue-primary)'
                }}
              >
                {totalHours.toFixed(1)} hrs
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleOpenAdd}
              icon={<Plus size={16} />}
            >
              Log Hours
            </Button>
          </div>
        </div>
      </Card>

      {/* Grouped Daily Entries or Empty State */}
      {timesheets.length === 0 ? (
        <EmptyState
          icon={<Clock className="empty-state-icon" />}
          title="No timesheets recorded yet."
          description="Log labor hours and activity logs for field trades and project personnel."
          actionText="Log First Hours"
          onAction={handleOpenAdd}
          actionIcon={<Plus size={15} />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {groupedTimesheets.map((dayGroup) => (
            <div key={dayGroup.date} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Day Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 14px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <Calendar size={14} color="var(--blue-primary)" />
                  <span>{dayGroup.date}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Daily Total: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{dayGroup.totalHours.toFixed(1)} hrs</strong>
                </div>
              </div>

              {/* Entries for this Day */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dayGroup.entries.map((entry) => (
                  <Card key={entry.id} className="timesheet-entry-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {entry.workerName}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              background: 'var(--blue-subtle)',
                              color: 'var(--blue-primary)',
                              padding: '1px 6px',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: 600
                            }}
                          >
                            {entry.taskTitle}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          {entry.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            marginRight: '4px'
                          }}
                        >
                          {entry.hours} hrs
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEdit(entry)}
                          aria-label={`Edit timesheet for ${entry.workerName}`}
                          icon={<Edit2 size={12} />}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(entry.id, entry.workerName)}
                          aria-label={`Delete timesheet for ${entry.workerName}`}
                          icon={<Trash2 size={12} />}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timesheet Modal */}
      <TimesheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingEntry={editingEntry}
        projectId={activeProject.id}
      />
    </div>
  );
};
