import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle2,
  Layers,
  Clock,
  ChevronDown,
  UserCheck,
  TrendingUp,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useRole } from '../../context/RoleContext';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { ProjectModal } from './ProjectModal';
import { calculateBOQTotal } from '../../services/boqService';
import { APP_CONFIG } from '../../config/appConfig';
import { USER_ROLES } from '../../types/userRole';
import { Project } from '../../types/project';

export const ProjectHeader: React.FC = () => {
  const {
    projects,
    activeProject,
    setActiveProjectId,
    createProject,
    updateProject,
    deleteProject,
    boqItems,
    tasks,
    dailyProgressUpdates,
    changeLogs
  } = useProject();
  const { role } = useRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  if (!activeProject) {
    return null;
  }

  const isClientRole = role === 'client';
  const boqTotal = calculateBOQTotal(boqItems);
  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
  const openTasksCount = tasks.length - completedTasksCount;
  const pendingChangesCount = changeLogs.filter((c) => c.status === 'Pending Review').length;
  const latestProgress = dailyProgressUpdates[0];

  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    setEditingProject(activeProject);
    setIsModalOpen(true);
  };

  const handleDeleteProject = () => {
    if (projects.length <= 1) {
      alert('Cannot delete the only existing project in the demo.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete project: "${activeProject.name}"? This will remove all associated BOQ items, tasks, and progress logs.`)) {
      deleteProject(activeProject.id);
    }
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>, editingId?: string) => {
    if (editingId) {
      updateProject({
        ...projectData,
        id: editingId
      });
    } else {
      createProject(projectData);
    }
  };

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'In Progress':
        return 'in-progress';
      case 'On Track':
        return 'on-track';
      case 'Delayed':
        return 'delayed';
      case 'Completed':
        return 'completed';
      default:
        return 'default';
    }
  };

  return (
    <>
      <section className="project-banner">
        {/* Breadcrumb & Project Selector Row */}
        <div className="project-banner-header">
          <div className="project-identity">
            <div className="project-breadcrumb-row">
              <span className="breadcrumb-label">Projects</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-code">{activeProject.code}</span>
              <Badge variant={getStatusBadgeVariant(activeProject.status)}>
                {activeProject.status}
              </Badge>

              {/* Current Role Indicator Pill */}
              <span className="role-indicator-badge">
                <UserCheck size={12} />
                {USER_ROLES[role].label}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
              <h1 className="project-title">{activeProject.name}</h1>

              {!isClientRole && (
                <div style={{ display: 'inline-flex', gap: '4px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleOpenEdit}
                    title="Edit Project Details"
                    aria-label="Edit Project Details"
                    icon={<Edit2 size={12} />}
                  />
                  {projects.length > 1 && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDeleteProject}
                      title="Delete Project"
                      aria-label="Delete Project"
                      icon={<Trash2 size={12} />}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="project-meta-row">
              <span className="project-meta-item">
                <Building2 size={13} color="var(--blue-primary)" />
                <strong>{activeProject.clientName}</strong>
              </span>
              <span className="project-meta-item">
                <MapPin size={13} color="var(--text-muted)" />
                {activeProject.location}
              </span>
              <span className="project-meta-item">
                <Calendar size={13} color="var(--text-muted)" />
                {activeProject.startDate} to {activeProject.targetEndDate}
              </span>
              <span className="project-meta-item">
                Phase: <strong>{activeProject.currentPhase}</strong>
              </span>
            </div>
          </div>

          {/* Project Switcher Select Menu & Create Project Button */}
          <div className="project-select-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Active Project:
              </span>
              {!isClientRole && (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--blue-primary)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <Plus size={12} /> New Project
                </button>
              )}
            </div>
            <div className="select-with-icon">
              <select
                id="project-picker-select"
                className="project-picker"
                value={activeProject.id}
                onChange={(e) => setActiveProjectId(e.target.value)}
                aria-label="Select Active Project"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} &bull; {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
        </div>

        {/* Modern Metric Highlight Tiles */}
        <div className="metric-tiles-grid">
          {/* Tile 1: Overall Progress */}
          <div className="metric-tile tile-blue">
            <div className="tile-top-row">
              <div className="tile-icon-box icon-blue">
                <TrendingUp size={16} />
              </div>
              <span className="tile-label">Overall Progress</span>
            </div>
            <div className="tile-value-row">
              <span className="tile-main-number">{activeProject.overallProgress}%</span>
              <span className="tile-subtext">Completed</span>
            </div>
            <div className="tile-progress-bar">
              <div className="tile-progress-fill fill-blue" style={{ width: `${activeProject.overallProgress}%` }} />
            </div>
          </div>

          {/* Tile 2: Total BOQ Value */}
          <div className="metric-tile tile-emerald">
            <div className="tile-top-row">
              <div className="tile-icon-box icon-emerald">
                <DollarSign size={16} />
              </div>
              <span className="tile-label">Total BOQ Valuation</span>
            </div>
            <div className="tile-value-row">
              <span className="tile-main-number">
                {APP_CONFIG.currencySymbol}
                {boqTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="tile-subtext">{boqItems.length} line items</span>
            </div>
            <div className="tile-progress-bar">
              <div className="tile-progress-fill fill-emerald" style={{ width: '85%' }} />
            </div>
          </div>

          {/* Tile 3: Tasks Health */}
          <div className="metric-tile tile-amber">
            <div className="tile-top-row">
              <div className="tile-icon-box icon-amber">
                <CheckCircle2 size={16} />
              </div>
              <span className="tile-label">Task Coordination</span>
            </div>
            <div className="tile-value-row">
              <span className="tile-main-number">{completedTasksCount} / {tasks.length}</span>
              <span className="tile-subtext">{openTasksCount} active</span>
            </div>
            <div className="tile-progress-bar">
              <div
                className="tile-progress-fill fill-amber"
                style={{ width: `${tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Tile 4: Change Requests or Latest Site Log */}
          <div className="metric-tile tile-purple">
            <div className="tile-top-row">
              <div className="tile-icon-box icon-purple">
                {pendingChangesCount > 0 ? <Layers size={16} /> : <Clock size={16} />}
              </div>
              <span className="tile-label">
                {pendingChangesCount > 0 ? 'Pending Variations' : 'Latest Site Update'}
              </span>
            </div>
            <div className="tile-value-row">
              <span className="tile-main-number">
                {pendingChangesCount > 0 ? `${pendingChangesCount} To Review` : latestProgress ? latestProgress.date : 'On Track'}
              </span>
              <span className="tile-subtext">
                {pendingChangesCount > 0 ? 'Action needed' : 'Verified log'}
              </span>
            </div>
            <div className="tile-progress-bar">
              <div
                className={`tile-progress-fill ${pendingChangesCount > 0 ? 'fill-rose' : 'fill-purple'}`}
                style={{ width: pendingChangesCount > 0 ? '45%' : '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal (Create / Edit) */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />
    </>
  );
};
