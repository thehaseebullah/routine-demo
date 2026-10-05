export type UserRole = 'project_manager' | 'client' | 'admin';

export interface RoleDefinition {
  id: UserRole;
  label: string;
  badge: string;
  description: string;
}

export const USER_ROLES: Record<UserRole, RoleDefinition> = {
  project_manager: {
    id: 'project_manager',
    label: 'Project Manager',
    badge: 'PM / Operations',
    description: 'Full management controls for progress, BOQ, tasks, and timesheets.'
  },
  client: {
    id: 'client',
    label: 'Client / Project-End',
    badge: 'Client Stakeholder',
    description: 'Executive transparent view: progress updates, milestones, and high-level BOQ summary.'
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    badge: 'System & Governance',
    description: 'Governance area focused on project guidelines documentation and compliance.'
  }
};
