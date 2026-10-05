import React, { ReactNode } from 'react';
import { useRole } from '../../context/RoleContext';
import { Header } from './Header';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileSimulatorShellProps {
  children: ReactNode;
}

export const MobileSimulatorShell: React.FC<MobileSimulatorShellProps> = ({ children }) => {
  const { viewMode, isMobileDevice } = useRole();

  // Show the smartphone simulator bezel ONLY when explicitly in mobile mode on a desktop screen
  // (On a physical mobile screen, the physical phone IS the device, so it renders 100% full-width without double bezels)
  const showSimulatorBezel = viewMode === 'mobile' && !isMobileDevice;

  if (showSimulatorBezel) {
    return (
      <div className="app-container mobile-simulator-active">
        <Header />
        <div className="simulator-desktop-stage">
          <div className="mobile-device-frame">
            {/* Simulated Mobile Status Bar */}
            <div className="mobile-notch-bar">
              <span>9:41</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={14} />
              </div>
            </div>

            {/* Mobile Viewport Screen */}
            <div className="mobile-viewport-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fluid responsive stage:
  // - On desktop: full-width desktop dashboard
  // - On mobile: seamless 100% full-screen mobile app with bottom navigation
  return (
    <div className={`app-container ${viewMode === 'desktop' ? 'force-desktop-layout' : 'mobile-layout'}`}>
      <Header />
      <div className={`fluid-stage ${viewMode === 'desktop' ? 'desktop-mode' : 'mobile-mode'}`}>
        {children}
      </div>
    </div>
  );
};
