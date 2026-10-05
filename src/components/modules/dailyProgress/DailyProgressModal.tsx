import React, { useState, useEffect } from 'react';
import { DailyProgressUpdate } from '../../../types/dailyProgress';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Textarea } from '../../common/Textarea';
import { Button } from '../../common/Button';

interface DailyProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (update: Omit<DailyProgressUpdate, 'id' | 'createdAt'>, editingId?: string) => void;
  editingUpdate?: DailyProgressUpdate | null;
  currentProjectProgress: number;
  projectId: string;
}

export const DailyProgressModal: React.FC<DailyProgressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingUpdate,
  currentProjectProgress,
  projectId
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [overallProgress, setOverallProgress] = useState(currentProjectProgress);
  const [completedWork, setCompletedWork] = useState('');
  const [workInProgress, setWorkInProgress] = useState('');
  const [blockers, setBlockers] = useState('');
  const [weatherConditions, setWeatherConditions] = useState('Clear, normal site conditions');
  const [notes, setNotes] = useState('');
  const [reportedBy, setReportedBy] = useState('Marcus Vance (Project Manager)');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingUpdate) {
      setDate(editingUpdate.date);
      setOverallProgress(editingUpdate.overallProgress);
      setCompletedWork(editingUpdate.completedWork);
      setWorkInProgress(editingUpdate.workInProgress);
      setBlockers(editingUpdate.blockers || '');
      setWeatherConditions(editingUpdate.weatherConditions || 'Clear, normal site conditions');
      setNotes(editingUpdate.notes || '');
      setReportedBy(editingUpdate.reportedBy);
    } else {
      setOverallProgress(currentProjectProgress);
      setDate(new Date().toISOString().split('T')[0]);
      setCompletedWork('');
      setWorkInProgress('');
      setBlockers('');
      setNotes('');
      setWeatherConditions('Clear, normal site conditions');
      setReportedBy('Marcus Vance (Project Manager)');
    }
    setErrors({});
  }, [editingUpdate, isOpen, currentProjectProgress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!completedWork.trim()) {
      newErrors.completedWork = 'Completed work summary is required.';
    }
    if (!workInProgress.trim()) {
      newErrors.workInProgress = 'Work in progress summary is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        projectId,
        date,
        overallProgress: Math.min(100, Math.max(0, Number(overallProgress) || 0)),
        completedWork: completedWork.trim(),
        workInProgress: workInProgress.trim(),
        blockers: blockers.trim() || undefined,
        weatherConditions: weatherConditions.trim() || undefined,
        notes: notes.trim() || undefined,
        reportedBy: reportedBy.trim()
      },
      editingUpdate?.id
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUpdate ? 'Edit Daily Progress Update' : 'Add Daily Site Progress Update'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingUpdate ? 'Save Progress Updates' : 'Publish Progress Log'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-row">
          <Input
            label="Log Date *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <Input
            label="Reported By *"
            value={reportedBy}
            onChange={(e) => setReportedBy(e.target.value)}
            required
          />
        </div>

        {/* Updated Overall Progress Slider */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              Updated Project Overall Completion %
            </label>
            <span style={{ color: 'var(--blue-primary)', fontFamily: 'var(--font-mono)' }}>
              {overallProgress}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={overallProgress}
            onChange={(e) => setOverallProgress(parseInt(e.target.value, 10))}
            style={{ width: '100%', height: '8px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            This will update the project's overall progress across all modules.
          </span>
        </div>

        <Textarea
          label="Completed Work (Closed out today) *"
          placeholder="e.g. Level 4 HVAC primary ductwork fully hung and pressure tested..."
          value={completedWork}
          onChange={(e) => {
            setCompletedWork(e.target.value);
            if (errors.completedWork) setErrors({ ...errors, completedWork: '' });
          }}
          error={errors.completedWork}
          rows={3}
          required
        />

        <Textarea
          label="Work in Progress (Currently executing) *"
          placeholder="e.g. Laser alignment of executive glass partition channels..."
          value={workInProgress}
          onChange={(e) => {
            setWorkInProgress(e.target.value);
            if (errors.workInProgress) setErrors({ ...errors, workInProgress: '' });
          }}
          error={errors.workInProgress}
          rows={2}
          required
        />

        <Textarea
          label="Field Blockers / Site Issues (Optional)"
          placeholder="e.g. Awaiting client spec sign-off; freight lift scheduled maintenance..."
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          rows={2}
        />

        <div className="form-row">
          <Input
            label="Site / Weather Conditions"
            placeholder="e.g. Clear, 22°C - Dry site conditions"
            value={weatherConditions}
            onChange={(e) => setWeatherConditions(e.target.value)}
          />

          <Input
            label="General Site Notes"
            placeholder="e.g. Material delivery scheduled for 07:00 tomorrow"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
