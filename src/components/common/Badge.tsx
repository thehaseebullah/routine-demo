import React, { ReactNode } from 'react';

export type BadgeVariant =
  | 'in-progress'
  | 'completed'
  | 'approved'
  | 'on-track'
  | 'pending'
  | 'pending-review'
  | 'not-started'
  | 'urgent'
  | 'delayed'
  | 'rejected'
  | 'default';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, icon }) => {
  return (
    <span className={`status-badge ${variant}`}>
      {icon}
      {children}
    </span>
  );
};
