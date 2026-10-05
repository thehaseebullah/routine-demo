import React, { useState } from 'react';
import { Smartphone, Monitor, RotateCcw, HelpCircle, Sparkles } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useProject } from '../../context/ProjectContext';
import { USER_ROLES, UserRole } from '../../types/userRole';
import { Logo } from '../common/Logo';
import { UserGuideModal } from '../common/UserGuideModal';

export const Header: React.FC = () => {
  const { role, setRole, simulationMode, toggleSimulationMode } = useRole();
  const { resetDemo } = useProject();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to the initial sample state?')) {
      resetDemo();
    }
  };

  return (
    <>
      <header className="global-header">
        <div className="brand-section">
          <Logo size="md" />
        </div>

        <div className="header-controls">
          {/* User Guide Walkthrough Button */}
          <button
            type="button"
            className="guide-trigger-btn"
            onClick={() => setIsGuideOpen(true)}
            title="Open Interactive User Guide"
          >
            <HelpCircle size={15} color="var(--blue-primary)" />
            <span>User Guide</span>
            <span className="guide-sparkle-dot" />
          </button>

          {/* Role Selector Pill */}
          <div className="role-selector" title="Switch Demonstration Role">
            {(Object.keys(USER_ROLES) as UserRole[]).map((roleKey) => {
              const r = USER_ROLES[roleKey];
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`role-tab-btn ${role === r.id ? 'active' : ''}`}
                  onClick={() => setRole(r.id)}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Device Simulation Toggle (Phone frame vs Fluid desktop) */}
          <button
            type="button"
            className="device-toggle-btn"
            onClick={toggleSimulationMode}
            title={
              simulationMode === 'fluid'
                ? 'Switch to Mobile App Device Simulation Frame'
                : 'Switch to Fluid Desktop View'
            }
          >
            {simulationMode === 'fluid' ? (
              <>
                <Smartphone size={15} />
                <span className="hide-mobile-label">Mobile Frame</span>
              </>
            ) : (
              <>
                <Monitor size={15} />
                <span className="hide-mobile-label">Fluid View</span>
              </>
            )}
          </button>

          {/* Reset Demo State Button */}
          <button
            type="button"
            className="device-toggle-btn reset-btn"
            onClick={handleReset}
            title="Reset to pristine sample data"
          >
            <RotateCcw size={14} />
            <span className="hide-mobile-label">Reset Demo</span>
          </button>
        </div>
      </header>

      {/* Interactive User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
};
