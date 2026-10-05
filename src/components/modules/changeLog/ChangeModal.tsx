import React, { useState, useEffect } from 'react';
import { ChangeLogItem } from '../../../types/changeLog';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Textarea } from '../../common/Textarea';
import { Button } from '../../common/Button';
import { APP_CONFIG } from '../../../config/appConfig';

interface ChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ChangeLogItem, 'id' | 'changeNumber'>, editingId?: string) => void;
  editingItem?: ChangeLogItem | null;
  projectId: string;
}

export const ChangeModal: React.FC<ChangeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  projectId
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [dateRequested, setDateRequested] = useState(todayStr);
  const [requestedBy, setRequestedBy] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [costImpact, setCostImpact] = useState<number | ''>(0);
  const [scheduleImpactDays, setScheduleImpactDays] = useState<number | ''>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDateRequested(editingItem.dateRequested);
      setRequestedBy(editingItem.requestedBy);
      setDescription(editingItem.description);
      setReason(editingItem.reason);
      setCostImpact(editingItem.costImpact);
      setScheduleImpactDays(editingItem.scheduleImpactDays);
    } else {
      setTitle('');
      setDateRequested(new Date().toISOString().split('T')[0]);
      setRequestedBy('');
      setDescription('');
      setReason('');
      setCostImpact(0);
      setScheduleImpactDays(0);
    }
    setErrors({});
  }, [editingItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Change title is required.';
    }
    if (!requestedBy.trim()) {
      newErrors.requestedBy = 'Requester name or stakeholder is required.';
    }
    if (!description.trim()) {
      newErrors.description = 'Description of scope change is required.';
    }
    if (!reason.trim()) {
      newErrors.reason = 'Justification/reason is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        projectId,
        title: title.trim(),
        dateRequested,
        requestedBy: requestedBy.trim(),
        description: description.trim(),
        reason: reason.trim(),
        costImpact: Number(costImpact) || 0,
        scheduleImpactDays: Number(scheduleImpactDays) || 0,
        status: editingItem ? editingItem.status : 'Pending Review',
        reviewNotes: editingItem ? editingItem.reviewNotes : undefined,
        reviewedDate: editingItem ? editingItem.reviewedDate : undefined,
        reviewedBy: editingItem ? editingItem.reviewedBy : undefined
      },
      editingItem?.id
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? `Edit Scope Change: ${editingItem.changeNumber}` : 'Record Scope Change Request'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingItem ? 'Save Change Details' : 'Log Change Request'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Input
          label="Change Title *"
          placeholder="e.g. Upgraded Acoustic Rating for Boardroom Glass"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: '' });
          }}
          error={errors.title}
          required
        />

        <div className="form-row">
          <Input
            label="Requested By *"
            placeholder="e.g. Client Consultant, Architect, Site PM"
            value={requestedBy}
            onChange={(e) => {
              setRequestedBy(e.target.value);
              if (errors.requestedBy) setErrors({ ...errors, requestedBy: '' });
            }}
            error={errors.requestedBy}
            required
          />

          <Input
            label="Request Date *"
            type="date"
            value={dateRequested}
            onChange={(e) => setDateRequested(e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Scope Change Description *"
          placeholder="Detail what is being added, removed, or modified from the original contract..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          error={errors.description}
          rows={3}
          required
        />

        <Textarea
          label="Reason & Justification *"
          placeholder="Why is this change necessary? (e.g. Tenant request, unforeseen site condition)"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (errors.reason) setErrors({ ...errors, reason: '' });
          }}
          error={errors.reason}
          rows={2}
          required
        />

        <div className="form-row">
          <Input
            label={`Estimated Cost Impact (${APP_CONFIG.currencySymbol})`}
            type="number"
            step="100"
            placeholder="0.00 (Positive = addition, Negative = credit)"
            value={costImpact}
            onChange={(e) => setCostImpact(e.target.value === '' ? '' : parseFloat(e.target.value))}
            helperText="Net cost change"
          />

          <Input
            label="Schedule Impact (Days)"
            type="number"
            step="1"
            placeholder="0 (e.g. +3 days)"
            value={scheduleImpactDays}
            onChange={(e) => setScheduleImpactDays(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            helperText="Handover variance"
          />
        </div>
      </form>
    </Modal>
  );
};
