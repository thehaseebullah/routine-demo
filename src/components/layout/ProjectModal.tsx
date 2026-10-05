import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../../types/project';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>, editingId?: string) => void;
  editingProject?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [currentPhase, setCurrentPhase] = useState('Planning & Mobilization');
  const [startDate, setStartDate] = useState('');
  const [targetEndDate, setTargetEndDate] = useState('');
  const [overallProgress, setOverallProgress] = useState(0);
  const [budgetTotal, setBudgetTotal] = useState<number | ''>(250000);
  const [description, setDescription] = useState('');
  const [leadManager, setLeadManager] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setCode(editingProject.code);
      setClientName(editingProject.clientName);
      setLocation(editingProject.location);
      setStatus(editingProject.status);
      setCurrentPhase(editingProject.currentPhase);
      setStartDate(editingProject.startDate);
      setTargetEndDate(editingProject.targetEndDate);
      setOverallProgress(editingProject.overallProgress);
      setBudgetTotal(editingProject.budgetTotal);
      setDescription(editingProject.description);
      setLeadManager(editingProject.leadManager);
    } else {
      const randomCode = `PRJ-2026-${Math.floor(10 + Math.random() * 90)}`;
      setName('');
      setCode(randomCode);
      setClientName('');
      setLocation('Downtown Metropolitan District');
      setStatus('In Progress');
      setCurrentPhase('Site Mobilization & Survey');
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      const sixMonths = new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0];
      setTargetEndDate(sixMonths);
      setOverallProgress(0);
      setBudgetTotal(350000);
      setDescription('');
      setLeadManager('Marcus Vance, PMP');
    }
    setErrors({});
  }, [editingProject, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Project name is required.';
    if (!clientName.trim()) newErrors.clientName = 'Client name is required.';
    if (!startDate) newErrors.startDate = 'Start date is required.';
    if (!targetEndDate) newErrors.targetEndDate = 'Target end date is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        name: name.trim(),
        code: code.trim() || 'PRJ-2026-X',
        clientName: clientName.trim(),
        location: location.trim(),
        status,
        currentPhase: currentPhase.trim(),
        startDate,
        targetEndDate,
        overallProgress: Math.min(100, Math.max(0, Number(overallProgress) || 0)),
        budgetTotal: Number(budgetTotal) || 0,
        description: description.trim() || `${name.trim()} project operations and coordination.`,
        leadManager: leadManager.trim() || 'Lead Project Manager'
      },
      editingProject?.id
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProject ? 'Edit Project Details' : 'Create New Project'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingProject ? 'Save Project Changes' : 'Initialize Project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-row">
          <Input
            label="Project Name *"
            placeholder="e.g. Metro Line Sector 4 - Structural & MEP"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
            required
          />

          <Input
            label="Project Reference Code *"
            placeholder="e.g. PRJ-2026-15"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <Input
            label="Client Organization *"
            placeholder="e.g. Horizon Urban Development"
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
              if (errors.clientName) setErrors({ ...errors, clientName: '' });
            }}
            error={errors.clientName}
            required
          />

          <Input
            label="Site Location"
            placeholder="e.g. 500 Central Expressway"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="form-row">
          <Select
            label="Project Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            <option value="In Progress">In Progress</option>
            <option value="On Track">On Track</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
          </Select>

          <Input
            label="Current Operational Phase"
            placeholder="e.g. Substructure & Pouring"
            value={currentPhase}
            onChange={(e) => setCurrentPhase(e.target.value)}
          />
        </div>

        <div className="form-row">
          <Input
            label="Contract Start Date *"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <Input
            label="Target Handover Date *"
            type="date"
            value={targetEndDate}
            onChange={(e) => setTargetEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <Input
            label="Lead Project Manager"
            value={leadManager}
            onChange={(e) => setLeadManager(e.target.value)}
          />

          <Input
            label="Total Estimated Budget ($)"
            type="number"
            step="1000"
            value={budgetTotal}
            onChange={(e) => setBudgetTotal(e.target.value === '' ? '' : parseFloat(e.target.value))}
          />
        </div>

        <Textarea
          label="Project Scope & Summary"
          placeholder="Brief description of project requirements, milestones, and scope..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </form>
    </Modal>
  );
};
