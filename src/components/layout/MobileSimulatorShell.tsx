import React, { ReactNode } from 'react';
import { useRole } from '../../context/RoleContext';
import { Header } from './Header';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileSimulatorShellProps {
  children: ReactNode;
}

export const MobileSimulatorShell: React.FC<MobileSimulatorShellProps> = ({ children }) => {
  const { simulationMode } = useRole();

  if (simulationMode === 'device') {
    return (
      <div className="app-container">
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

  return (
    <div className="app-container">
      <Header />
      <div className="fluid-stage">
        {children}
      </div>
    </div>
  );
};
