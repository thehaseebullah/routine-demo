/**
 * Application Configuration
 * The application name "Routine" is configurable here and can be easily altered.
 */
export const APP_CONFIG = {
  appName: 'Routine',
  appTagline: 'Project Management & BOQ Module',
  version: '1.0.0-demo',
  currencySymbol: '$',
  defaultUnits: [
    'm²',
    'cu.m',
    'kg',
    'linear m',
    'pcs',
    'lots',
    'hrs',
    'sq.ft',
    'tonnes'
  ],
  boqCategories: [
    'Demolition & Site Prep',
    'Substructure & Concrete',
    'Masonry & Partitions',
    'MEP (Mechanical & Electrical)',
    'Architectural Finishes',
    'Exterior & Glazing',
    'Site Preliminaries'
  ],
  taskPriorities: ['Low', 'Medium', 'High', 'Urgent'] as const,
  taskStatuses: ['Not Started', 'In Progress', 'Completed'] as const,
  guidelineCategories: [
    'Safety Protocols',
    'Quality Standards',
    'Site Logistics',
    'Contractual Guidelines',
    'Technical Specs'
  ] as const,
  changeStatuses: ['Pending Review', 'Approved', 'Rejected'] as const
};
