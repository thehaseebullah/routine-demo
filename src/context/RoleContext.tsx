import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types/userRole';

export type SimulationMode = 'fluid' | 'device';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  simulationMode: SimulationMode;
  setSimulationMode: (mode: SimulationMode) => void;
  toggleSimulationMode: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('project_manager');
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('fluid');

  const toggleSimulationMode = () => {
    setSimulationMode((prev) => (prev === 'fluid' ? 'device' : 'fluid'));
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
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
