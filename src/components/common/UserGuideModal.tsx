import React, { useState } from 'react';
import {
  HelpCircle,
  Calculator,
  CheckSquare,
  Clock,
  TrendingUp,
  FileDiff,
  BookOpen,
  Smartphone,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'roles' | 'boq' | 'tasks' | 'progress' | 'mobile'>('overview');

  const sections = [
    { id: 'overview' as const, label: 'Quick Start', icon: <Sparkles size={16} /> },
    { id: 'roles' as const, label: 'Role Switcher', icon: <Users size={16} /> },
    { id: 'boq' as const, label: 'BOQ Module', icon: <Calculator size={16} /> },
    { id: 'tasks' as const, label: 'Tasks & Timesheets', icon: <CheckSquare size={16} /> },
    { id: 'progress' as const, label: 'Daily Progress & Changes', icon: <TrendingUp size={16} /> },
    { id: 'mobile' as const, label: 'Mobile Simulation', icon: <Smartphone size={16} /> }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Routine — Interactive User Guide & Walkthrough"
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Need to reset sample data anytime? Click <strong>Reset Demo</strong> in the top header.
          </span>
          <Button variant="primary" onClick={onClose}>
            Got it, Let's Build!
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Navigation Tabs for Guide */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {sections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              className={`role-tab-btn ${activeSection === sec.id ? 'active' : ''}`}
              onClick={() => setActiveSection(sec.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Section 1: Overview */}
        {activeSection === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 180ms ease-out' }}>
            <div
              style={{
                padding: '14px',
                background: 'var(--blue-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--blue-border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <Sparkles size={20} color="var(--blue-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--blue-primary)' }}>
                  Welcome to Routine Prototype
                </strong>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px', lineHeight: '1.5' }}>
                  Routine is designed to make project management and Bill of Quantities (BOQ) creation completely effortless, visual, and tactile on both web and mobile viewports.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                  <Calculator size={16} color="var(--blue-primary)" />
                  <span>1. BOQ Cost Estimating</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Add quantities and rates; items automatically compute <code style={{ color: 'var(--blue-primary)' }}>Qty × Rate = Amount</code> with instant category totals.
                </p>
              </div>

              <div style={{ padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                  <TrendingUp size={16} color="var(--blue-primary)" />
                  <span>2. Daily Site Progress</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Project managers log daily completed work, operations in progress, and active site blockers in a chronological timeline.
                </p>
              </div>

              <div style={{ padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                  <Users size={16} color="var(--blue-primary)" />
                  <span>3. Multi-Role Perspectives</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Switch seamlessly between <strong>Project Manager</strong>, <strong>Client</strong>, and <strong>Admin</strong> views at the top of the screen.
                </p>
              </div>

              <div style={{ padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                  <Smartphone size={16} color="var(--blue-primary)" />
                  <span>4. Mobile App Simulation</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Click <strong>Mobile Frame</strong> in the header to simulate the exact mobile app interface on your desktop screen!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Roles */}
        {activeSection === 'roles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 180ms ease-out' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Routine provides 3 demonstration roles built directly into the header:
            </p>

            <div style={{ padding: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge variant="in-progress">Project Manager</Badge>
                <strong style={{ fontSize: '13px' }}>Internal Operations Lead</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Full operational power: create/edit/delete BOQ line items, update daily progress logs, assign site tasks, log labor timesheets, and review scope change requests.
              </p>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge variant="approved">Client / Project-End</Badge>
                <strong style={{ fontSize: '13px' }}>Stakeholder Transparent Portal</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Clean, executive view: displays verified milestone completions, trade expenditure package summaries, and approved variation orders. Internal editing controls and employee timesheets are hidden.
              </p>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge variant="urgent">Admin</Badge>
                <strong style={{ fontSize: '13px' }}>Governance &amp; Guidelines</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Governance focus: allows simulated upload and deletion of safety standards, QA/QC manuals, and contractual guidelines.
              </p>
            </div>
          </div>
        )}

        {/* Section 3: BOQ */}
        {activeSection === 'boq' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 180ms ease-out' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>How the BOQ Module Operates</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--status-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Instant Math:</strong> In the Add/Edit modal, typing Quantity (e.g. 150) and Rate (e.g. $45.00) immediately calculates the Line Amount ($6,750.00).
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--status-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Project Total Sum:</strong> Any added, modified, or deleted line item reactively recalculates the Total Project BOQ value in real time.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--status-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Category Distribution:</strong> Review expenditures broken down into Demolition, Masonry, MEP, and Architectural Finishes with visual progress bars.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Tasks & Timesheets */}
        {activeSection === 'tasks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 180ms ease-out' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Managing Tasks &amp; Labor Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--status-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Task &amp; Progress Synchronization:</strong> Changing status to <em>Completed</em> automatically updates the progress slider to 100%. Moving the slider updates the status automatically.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--status-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Daily Timesheet Groups:</strong> Log labor hours by date with worker name and task. Entries automatically group under daily summary headers showing total hours.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Progress & Changes */}
        {activeSection === 'progress' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 180ms ease-out' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Daily Field Progress &amp; Scope Variations</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--status-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Chronological Progress Timeline:</strong> Records verified daily work summaries. The latest entry automatically updates the overall completion percentage of the parent project.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--status-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Site Blockers Alert:</strong> Flag active issues (e.g. material delays, weather delays) to immediately alert stakeholders in the project header.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--status-success-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Change Review Log:</strong> Log scope variations with cost impact ($) and schedule impact (days), and approve or reject them with review notes.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Mobile Simulation */}
        {activeSection === 'mobile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 180ms ease-out' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Experiencing the Mobile App Simulation</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              The client specifically requested a web application that visually and ergonomically simulates a mobile app experience.
            </p>
            <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <strong>How to toggle:</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                In the top right header, click the <strong>Mobile Frame</strong> button. This places the interface inside a realistic phone bezel with 9:41 status bar, bottom navigation bar, and vertical touch scrolling.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
