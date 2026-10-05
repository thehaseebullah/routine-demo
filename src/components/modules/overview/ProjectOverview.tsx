import React, { useState } from 'react';
import {
  FileText,
  Clock,
  TrendingUp,
  FileDiff,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  UserCheck,
  Plus,
  HelpCircle,
  Calculator,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { useProject } from '../../../context/ProjectContext';
import { useRole } from '../../../context/RoleContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { ProgressBar } from '../../common/ProgressBar';
import { calculateBOQTotal, getBOQCategorySummaries } from '../../../services/boqService';
import { calculateTotalHours } from '../../../services/timesheetService';
import { APP_CONFIG } from '../../../config/appConfig';
import { NavTabId } from '../../layout/NavigationBar';
import { UserGuideModal } from '../../common/UserGuideModal';

interface ProjectOverviewProps {
  onNavigateTab: (tab: NavTabId) => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ onNavigateTab }) => {
  const {
    activeProject,
    boqItems,
    tasks,
    timesheets,
    dailyProgressUpdates,
    changeLogs,
    guidelines
  } = useProject();
  const { role } = useRole();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  if (!activeProject) return null;

  const isClientRole = role === 'client';
  const boqTotal = calculateBOQTotal(boqItems);
  const totalHours = calculateTotalHours(timesheets);
  const openTasks = tasks.filter((t) => t.status !== 'Completed');
  const latestUpdate = dailyProgressUpdates[0];
  const pendingChanges = changeLogs.filter((c) => c.status === 'Pending Review');
  const categories = getBOQCategorySummaries(boqItems).slice(0, 4);

  return (
    <div className="main-view-container">
      {/* Quick Launchpad Action Bar (Makes the app super easy to use) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 18px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--blue-primary)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Quick Actions:
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {!isClientRole && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigateTab('boq')}
                icon={<Plus size={14} />}
              >
                Add BOQ Item
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigateTab('progress')}
                icon={<TrendingUp size={14} />}
              >
                Update Progress
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigateTab('tasks')}
                icon={<CheckSquare size={14} />}
              >
                Create Task
              </Button>
            </>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsGuideOpen(true)}
            icon={<HelpCircle size={14} color="var(--blue-primary)" />}
          >
            Open User Guide
          </Button>
        </div>
      </div>

      {/* Project Executive Summary Card */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Project Scope &amp; Mission
            </span>
            <p style={{ marginTop: '4px', fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
              {activeProject.description}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '12px'
            }}
          >
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Project Lead: </span>
              <strong style={{ color: 'var(--text-primary)' }}>{activeProject.leadManager}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Current Phase: </span>
              <strong style={{ color: 'var(--text-primary)' }}>{activeProject.currentPhase}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Contract Duration: </span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {activeProject.startDate} to {activeProject.targetEndDate}
              </strong>
            </div>
          </div>
        </div>
      </Card>

      {/* Latest Site Progress Highlight */}
      {latestUpdate && (
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="var(--blue-primary)" />
              <span>Latest Verified Site Progress ({latestUpdate.date})</span>
            </div>
          }
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('progress')}
              icon={<ArrowRight size={14} />}
            >
              View Timeline
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Completed Works:
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                {latestUpdate.completedWork}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                In-Progress Operations:
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {latestUpdate.workInProgress}
              </p>
            </div>

            {latestUpdate.blockers && (
              <div className="alert-callout warning">
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Active Field Blocker / Risk:</strong>
                  <p style={{ marginTop: '2px' }}>{latestUpdate.blockers}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Grid of Modules & Statuses */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}
      >
        {/* BOQ Quick Card */}
        <Card
          title="Bill of Quantities (BOQ)"
          subtitle={`${boqItems.length} line items quantified`}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('boq')}
            >
              Open BOQ
            </Button>
          }
        >
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Aggregate Value:</span>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)' }}>
              {APP_CONFIG.currencySymbol}
              {boqTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {categories.map((c) => (
              <div
                key={c.category}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}
              >
                <span>{c.category}</span>
                <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {APP_CONFIG.currencySymbol}
                  {c.totalAmount.toLocaleString('en-US')}
                </strong>
              </div>
            ))}
          </div>
        </Card>

        {/* Tasks Quick Card */}
        <Card
          title="Task Coordination"
          subtitle={`${openTasks.length} active tasks in progress`}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('tasks')}
            >
              View Tasks
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.slice(0, 3).map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '8px 12px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{t.title}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.progress}%</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Assigned: {t.assignee}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Change Review Log Quick Card */}
        <Card
          title="Change Review Log"
          subtitle={`${changeLogs.length} total scope change requests`}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('changes')}
            >
              Open Log
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Pending Evaluation: <strong style={{ color: 'var(--amber-primary)' }}>{pendingChanges.length}</strong>
            </div>
            {changeLogs.slice(0, 2).map((c) => (
              <div
                key={c.id}
                style={{
                  fontSize: '12px',
                  padding: '8px 12px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{c.changeNumber}</strong>
                  <span style={{ color: c.status === 'Approved' ? 'var(--emerald-primary)' : 'var(--amber-primary)', fontWeight: 600 }}>
                    {c.status}
                  </span>
                </div>
                <p style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>{c.title}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Guidelines Quick Card */}
        <Card
          title="Project Guidelines &amp; Compliance"
          subtitle={`${guidelines.length} registered guidelines`}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('guidelines')}
            >
              Browse Docs
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {guidelines.slice(0, 3).map((g) => (
              <div
                key={g.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}
              >
                <BookOpen size={14} color="var(--blue-primary)" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {g.title}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};
