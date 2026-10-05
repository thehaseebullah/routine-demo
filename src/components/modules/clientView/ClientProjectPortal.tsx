import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  FileSpreadsheet,
  FileDiff,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useProject } from '../../../context/ProjectContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge, BadgeVariant } from '../../common/Badge';
import { ProgressBar } from '../../common/ProgressBar';
import { calculateBOQTotal, getBOQCategorySummaries } from '../../../services/boqService';
import { sortProgressUpdatesDescending } from '../../../services/dailyProgressService';
import { APP_CONFIG } from '../../../config/appConfig';
import { NavTabId } from '../../layout/NavigationBar';

interface ClientProjectPortalProps {
  onNavigateTab: (tab: NavTabId) => void;
}

export const ClientProjectPortal: React.FC<ClientProjectPortalProps> = ({ onNavigateTab }) => {
  const {
    activeProject,
    boqItems,
    dailyProgressUpdates,
    changeLogs,
    tasks
  } = useProject();

  if (!activeProject) return null;

  const boqTotal = calculateBOQTotal(boqItems);
  const categorySummaries = getBOQCategorySummaries(boqItems);
  const sortedProgress = sortProgressUpdatesDescending(dailyProgressUpdates);
  const latestUpdate = sortedProgress[0];
  const approvedChanges = changeLogs.filter((c) => c.status === 'Approved');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

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
    <div className="main-view-container">
      {/* Client Welcome & Transparency Header */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="project-code">{activeProject.code}</span>
              <Badge variant={getStatusBadgeVariant(activeProject.status)}>
                {activeProject.status}
              </Badge>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  background: 'var(--blue-subtle)',
                  color: 'var(--blue-primary)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                Client Stakeholder Portal
              </span>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Contract Target: <strong style={{ color: 'var(--text-primary)' }}>{activeProject.targetEndDate}</strong>
            </div>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {activeProject.name}
          </h2>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {activeProject.description}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Executive Completion Progress
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <ProgressBar progress={activeProject.overallProgress} />
                <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--blue-primary)' }}>
                  {activeProject.overallProgress}%
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Approved Contract BOQ Total
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {APP_CONFIG.currencySymbol}
                {boqTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Client Representative
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {activeProject.clientName}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Latest Verified Site Progress Milestone */}
      {latestUpdate && (
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="var(--blue-primary)" />
              <span>Verified Site Progress ({latestUpdate.date})</span>
            </div>
          }
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('progress')}
              icon={<ArrowRight size={14} />}
            >
              Full Daily Log
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--status-success-text)', textTransform: 'uppercase' }}>
                Completed Deliverables
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
                {latestUpdate.completedWork}
              </p>
            </div>

            <div style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--blue-primary)', textTransform: 'uppercase' }}>
                Current On-Site Works
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
                {latestUpdate.workInProgress}
              </p>
            </div>

            {latestUpdate.notes && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Site Memo: </strong>
                {latestUpdate.notes}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Two Column Section: BOQ Summary & Approved Changes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* High-level BOQ category summary */}
        <Card
          title="Bill of Quantities Package Summary"
          subtitle="Expenditure allocation per trade division"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('boq')}
            >
              Inspect Schedule
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categorySummaries.map((cat) => (
              <div
                key={cat.category}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {cat.category}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {cat.itemCount} quantified items
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {APP_CONFIG.currencySymbol}
                    {cat.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--blue-primary)', fontWeight: 600 }}>
                    {cat.percentageOfTotal}% of total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Change Orders Governance */}
        <Card
          title="Approved Scope Changes &amp; Variations"
          subtitle="Verified contract revisions signed off by client"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('changes')}
            >
              All Variations
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {approvedChanges.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No scope variations recorded to date.
              </div>
            ) : (
              approvedChanges.map((change) => (
                <div
                  key={change.id}
                  style={{
                    padding: '10px',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px' }}>{change.changeNumber}: {change.title}</strong>
                    <Badge variant="approved">Approved</Badge>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {change.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    <span>Requested by: {change.requestedBy}</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      Cost: {change.costImpact >= 0 ? `+${APP_CONFIG.currencySymbol}` : `-${APP_CONFIG.currencySymbol}`}
                      {Math.abs(change.costImpact).toLocaleString('en-US')}
                    </strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
