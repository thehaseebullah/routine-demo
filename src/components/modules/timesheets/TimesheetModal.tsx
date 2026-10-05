import React, { useState, useEffect } from 'react';
import { TimesheetEntry } from '../../../types/timesheet';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Textarea } from '../../common/Textarea';
import { Button } from '../../common/Button';
import { useProject } from '../../../context/ProjectContext';

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<TimesheetEntry, 'id'>, editingId?: string) => void;
  editingEntry?: TimesheetEntry | null;
  projectId: string;
}

export const TimesheetModal: React.FC<TimesheetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEntry,
  projectId
}) => {
  const { tasks } = useProject();

  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [workerName, setWorkerName] = useState('');
  const [taskId, setTaskId] = useState('');
  const [taskTitleCustom, setTaskTitleCustom] = useState('');
  const [hours, setHours] = useState<number | ''>(8);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setWorkerName(editingEntry.workerName);
      setTaskId(editingEntry.taskId || '');
      setTaskTitleCustom(editingEntry.taskTitle || '');
      setHours(editingEntry.hours);
      setDescription(editingEntry.description);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setWorkerName('');
      setTaskId('');
      setTaskTitleCustom('');
      setHours(8);
      setDescription('');
    }
    setErrors({});
  }, [editingEntry, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!workerName.trim()) {
      newErrors.workerName = 'Worker name or trade title is required.';
    }
    const numHours = Number(hours);
    if (hours === '' || isNaN(numHours) || numHours <= 0 || numHours > 24) {
      newErrors.hours = 'Hours must be between 0.1 and 24 hours.';
    }
    if (!description.trim()) {
      newErrors.description = 'Work description is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let finalTaskTitle = taskTitleCustom.trim();
    if (taskId) {
      const found = tasks.find((t) => t.id === taskId);
      if (found) finalTaskTitle = found.title;
    }
    if (!finalTaskTitle) {
      finalTaskTitle = 'General Site Operations & Supervision';
    }

    onSave(
      {
        projectId,
        date,
        workerName: workerName.trim(),
        taskId: taskId || undefined,
        taskTitle: finalTaskTitle,
        hours: Number(hours),
        description: description.trim()
      },
      editingEntry?.id
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEntry ? 'Edit Timesheet Entry' : 'Log Project Timesheet'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingEntry ? 'Update Hours' : 'Record Hours'}
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
            label="Hours Worked (0.1 - 24) *"
            type="number"
            step="0.5"
            min="0.1"
            max="24"
            value={hours}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : parseFloat(e.target.value);
              setHours(val);
              if (errors.hours) setErrors({ ...errors, hours: '' });
            }}
            error={errors.hours}
            required
          />
        </div>

        <Input
          label="Person / Trade Personnel *"
          placeholder="e.g. David K. (Mechanical Lead)"
          value={workerName}
          onChange={(e) => {
            setWorkerName(e.target.value);
            if (errors.workerName) setErrors({ ...errors, workerName: '' });
          }}
          error={errors.workerName}
          required
        />

        <Select
          label="Related Project Task (Optional)"
          value={taskId}
          onChange={(e) => {
            setTaskId(e.target.value);
            if (e.target.value) setTaskTitleCustom('');
          }}
        >
          <option value="">Other / General Operations</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.status})
            </option>
          ))}
        </Select>

        {!taskId && (
          <Input
            label="Activity Name (If not in task list)"
            placeholder="e.g. Unloading material pallets, consultant walk"
            value={taskTitleCustom}
            onChange={(e) => setTaskTitleCustom(e.target.value)}
          />
        )}

        <Textarea
          label="Specific Work Execution Description *"
          placeholder="What specific works were performed during these hours?"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          error={errors.description}
          required
          rows={3}
        />
      </form>
    </Modal>
  );
};
