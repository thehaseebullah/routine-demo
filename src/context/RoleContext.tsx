import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '../types/userRole';

export type ViewMode = 'desktop' | 'mobile';
export type SimulationMode = 'fluid' | 'device';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  isMobileDevice: boolean;
  
  // Backward compatibility aliases
  simulationMode: SimulationMode;
  setSimulationMode: (mode: SimulationMode) => void;
  toggleSimulationMode: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const checkIsMobile = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768;
  }
  return false;
};

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('project_manager');
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(checkIsMobile);
  const [viewMode, setViewMode] = useState<ViewMode>(() => (checkIsMobile() ? 'mobile' : 'desktop'));
  const [hasUserToggled, setHasUserToggled] = useState<boolean>(false);

  // Automatically adapt to screen size changes unless the user explicitly toggled their view preference
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileDevice(isMobile);
      if (!hasUserToggled) {
        setViewMode(isMobile ? 'mobile' : 'desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasUserToggled]);

  const toggleViewMode = () => {
    setHasUserToggled(true);
    setViewMode((prev) => (prev === 'desktop' ? 'mobile' : 'desktop'));
  };

  const setViewModeExplicit = (mode: ViewMode) => {
    setHasUserToggled(true);
    setViewMode(mode);
  };

  // Backwards compatibility mappings
  const simulationMode: SimulationMode = viewMode === 'mobile' ? 'device' : 'fluid';
  const toggleSimulationMode = toggleViewMode;
  const setSimulationMode = (mode: SimulationMode) => {
    setViewModeExplicit(mode === 'device' ? 'mobile' : 'desktop');
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        viewMode,
        setViewMode: setViewModeExplicit,
        toggleViewMode,
        isMobileDevice,
        simulationMode,
        setSimulationMode,
        toggleSimulationMode
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
