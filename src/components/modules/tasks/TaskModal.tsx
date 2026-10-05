import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../../../types/task';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Textarea } from '../../common/Textarea';
import { Button } from '../../common/Button';
import { APP_CONFIG } from '../../../config/appConfig';
import { useProject } from '../../../context/ProjectContext';
import { syncTaskStatusAndProgress } from '../../../services/taskService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>, editingId?: string) => void;
  editingTask?: Task | null;
  projectId: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
  projectId
}) => {
  const { boqItems } = useProject();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Not Started');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [progress, setProgress] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [boqReferenceId, setBoqReferenceId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setAssignee(editingTask.assignee);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setProgress(editingTask.progress);
      setDueDate(editingTask.dueDate);
      setBoqReferenceId(editingTask.boqReferenceId || '');
    } else {
      setTitle('');
      setDescription('');
      setAssignee('');
      setStatus('Not Started');
      setPriority('Medium');
      setProgress(0);
      const defaultDue = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
      setDueDate(defaultDue);
      setBoqReferenceId('');
    }
    setErrors({});
  }, [editingTask, isOpen]);

  const handleStatusChange = (newStatus: TaskStatus) => {
    const synced = syncTaskStatusAndProgress({ status, progress }, 'status', newStatus);
    setStatus(synced.status);
    setProgress(synced.progress);
  };

  const handleProgressChange = (newProgress: number) => {
    const synced = syncTaskStatusAndProgress({ status, progress }, 'progress', newProgress);
    setStatus(synced.status);
    setProgress(synced.progress);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Task name is required.';
    }
    if (!assignee.trim()) {
      newErrors.assignee = 'Assigned person/team is required.';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedBOQ = boqItems.find((b) => b.id === boqReferenceId);

    onSave(
      {
        projectId,
        title: title.trim(),
        description: description.trim(),
        assignee: assignee.trim(),
        status,
        priority,
        progress,
        dueDate,
        boqReferenceId: boqReferenceId || undefined,
        boqReferenceDesc: selectedBOQ ? `${selectedBOQ.itemNumber} - ${selectedBOQ.description.slice(0, 30)}...` : undefined
      },
      editingTask?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTask ? 'Edit Task' : 'Create Site Task'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingTask ? 'Save Task Updates' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Input
          label="Task Name *"
          placeholder="e.g. Install Level 4 HVAC main branch ducting"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: '' });
          }}
          error={errors.title}
          required
        />

        <Textarea
          label="Scope Description"
          placeholder="Specific site details, specifications, or clearance conditions..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />

        <div className="form-row">
          <Input
            label="Assigned Person / Team *"
            placeholder="e.g. Crestline Mechanical Team"
            value={assignee}
            onChange={(e) => {
              setAssignee(e.target.value);
              if (errors.assignee) setErrors({ ...errors, assignee: '' });
            }}
            error={errors.assignee}
            required
          />

          <Input
            label="Target Due Date *"
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
            }}
            error={errors.dueDate}
            required
          />
        </div>

        <div className="form-row">
          <Select
            label="Priority Level"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            {APP_CONFIG.taskPriorities.map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </Select>

          <Select
            label="Status"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          >
            {APP_CONFIG.taskStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        {/* Progress Slider (Synchronized with Status) */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>
              Task Completion Progress
            </label>
            <span style={{ color: 'var(--blue-primary)', fontFamily: 'var(--font-mono)' }}>
              {progress}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={progress}
            onChange={(e) => handleProgressChange(parseInt(e.target.value, 10))}
            style={{ width: '100%', height: '8px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Moving slider to 100% marks the task as Completed; 0% marks as Not Started.
          </span>
        </div>

        {/* Optional BOQ Reference Linkage */}
        <Select
          label="Associated BOQ Reference (Optional)"
          value={boqReferenceId}
          onChange={(e) => setBoqReferenceId(e.target.value)}
        >
          <option value="">None / General Work</option>
          {boqItems.map((b) => (
            <option key={b.id} value={b.id}>
              {b.itemNumber} — {b.description.slice(0, 45)} ({b.quantity} {b.unit})
            </option>
          ))}
        </Select>
      </form>
    </Modal>
  );
};
