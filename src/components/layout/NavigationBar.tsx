import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  CheckSquare,
  Clock,
  TrendingUp,
  FileDiff,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useProject } from '../../context/ProjectContext';

export type NavTabId =
  | 'overview'
  | 'boq'
  | 'tasks'
  | 'timesheets'
  | 'progress'
  | 'changes'
  | 'guidelines';

interface NavigationBarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  onOpenGuide?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onTabChange,
  onOpenGuide
}) => {
  const { role } = useRole();
  const { boqItems, tasks, changeLogs, guidelines } = useProject();

  const isClientRole = role === 'client';

  // In Client View, timesheets are internal labor tracking and excluded.
  const navItems: { id: NavTabId; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard size={16} />
    },
    {
      id: 'boq',
      label: isClientRole ? 'BOQ Summary' : 'BOQ',
      icon: <Calculator size={16} />,
      count: boqItems.length
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare size={16} />,
      count: tasks.filter((t) => t.status !== 'Completed').length
    },
    ...(isClientRole
      ? []
      : [
          {
            id: 'timesheets' as NavTabId,
            label: 'Timesheets',
            icon: <Clock size={16} />
          }
        ]),
    {
      id: 'progress',
      label: 'Daily Progress',
      icon: <TrendingUp size={16} />
    },
    {
      id: 'changes',
      label: 'Change Log',
      icon: <FileDiff size={16} />,
      count: changeLogs.filter((c) => c.status === 'Pending Review').length
    },
    {
      id: 'guidelines',
      label: role === 'admin' ? 'Guidelines (Admin)' : 'Guidelines',
      icon: <BookOpen size={16} />,
      count: guidelines.length
    }
  ];

  return (
    <>
      {/* Desktop & Tablet Top Tab Bar */}
      <nav className="sub-nav-bar" aria-label="Project Sub Navigation">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sub-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="badge-counter">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Navigation Bar (< 768px or inside mobile simulator) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}

        {onOpenGuide && (
          <button
            type="button"
            className="mobile-nav-btn"
            onClick={onOpenGuide}
            style={{ color: 'var(--blue-primary)' }}
            title="User Guide"
          >
            <HelpCircle size={16} />
            <span>Guide</span>
          </button>
        )}
      </nav>
    </>
  );
};
