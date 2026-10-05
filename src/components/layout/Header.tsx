import React, { useState } from 'react';
import { Smartphone, Monitor, RotateCcw, HelpCircle } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { useProject } from '../../context/ProjectContext';
import { USER_ROLES, UserRole } from '../../types/userRole';
import { Logo } from '../common/Logo';
import { UserGuideModal } from '../common/UserGuideModal';

export const Header: React.FC = () => {
  const { role, setRole, viewMode, toggleViewMode, isMobileDevice } = useRole();
  const { resetDemo } = useProject();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to the initial sample state?')) {
      resetDemo();
    }
  };

  // Compute button text and icon based on device type and current active mode
  const isDesktopScreen = !isMobileDevice;
  
  let toggleButtonIcon = <Smartphone size={14} />;
  let toggleButtonText = 'Mobile Frame';
  let toggleButtonTitle = 'Switch to Mobile Phone Simulation Frame';

  if (isDesktopScreen) {
    if (viewMode === 'desktop') {
      toggleButtonIcon = <Smartphone size={14} />;
      toggleButtonText = 'Mobile Frame';
      toggleButtonTitle = 'Preview as Mobile Smartphone Frame';
    } else {
      toggleButtonIcon = <Monitor size={14} />;
      toggleButtonText = 'Desktop View';
      toggleButtonTitle = 'Return to Fluid Desktop Dashboard';
    }
  } else {
    // Physical mobile or small screen
    if (viewMode === 'mobile') {
      toggleButtonIcon = <Monitor size={14} />;
      toggleButtonText = 'Desktop';
      toggleButtonTitle = 'Switch to Wide Desktop View';
    } else {
      toggleButtonIcon = <Smartphone size={14} />;
      toggleButtonText = 'Mobile';
      toggleButtonTitle = 'Switch to Mobile App View';
    }
  }

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
            className={`device-toggle-btn ${viewMode === 'mobile' ? 'active-mode' : ''}`}
            onClick={toggleViewMode}
            title={toggleButtonTitle}
            aria-label={toggleButtonTitle}
          >
            {toggleButtonIcon}
            <span className="device-btn-text">{toggleButtonText}</span>
          </button>

          {/* Reset Demo State Button */}
          <button
            type="button"
            className="device-toggle-btn reset-btn"
            onClick={handleReset}
            title="Reset to pristine sample data"
          >
            <RotateCcw size={14} />
            <span className="hide-mobile-label">Reset</span>
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
