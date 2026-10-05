import { Project } from '../../types/project';
import { BOQItem } from '../../types/boq';
import { Task } from '../../types/task';
import { TimesheetEntry } from '../../types/timesheet';
import { DailyProgressUpdate } from '../../types/dailyProgress';
import { ChangeLogItem } from '../../types/changeLog';
import { ProjectGuideline } from '../../types/guideline';

export interface AppStateData {
  projects: Project[];
  activeProjectId: string;
  boqItems: BOQItem[];
  tasks: Task[];
  timesheets: TimesheetEntry[];
  dailyProgressUpdates: DailyProgressUpdate[];
  changeLogs: ChangeLogItem[];
  guidelines: ProjectGuideline[];
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-apex-fitout',
    code: 'PRJ-2026-08',
    name: 'Apex Commercial Center — Levels 3-5 Fit-Out',
    clientName: 'Apex Horizon Real Estate Corp',
    location: '742 Enterprise Boulevard, Downtown District',
    status: 'In Progress',
    currentPhase: 'MEP Rough-In & Drywall Partitions',
    startDate: '2026-08-15',
    targetEndDate: '2026-12-20',
    overallProgress: 64,
    budgetTotal: 485000,
    description: 'Comprehensive commercial interior fit-out spanning 3 floors including full acoustic ceiling grid, high-density MEP, structural glass partitions, and executive suites.',
    leadManager: 'Marcus Vance, PMP'
  },
  {
    id: 'prj-harbor-facade',
    code: 'PRJ-2026-11',
    name: 'Harbor Point Towers — Structural Glazing & Envelope',
    clientName: 'Harbor Waterfront Development Ltd',
    location: '12 Marina Promenade, South Quay',
    status: 'On Track',
    currentPhase: 'Curtain Wall Panel Installation',
    startDate: '2026-09-01',
    targetEndDate: '2027-03-30',
    overallProgress: 38,
    budgetTotal: 720000,
    description: 'Unitized architectural curtain wall installation, structural steel bracket anchoring, and seismic joint seals across Tower B.',
    leadManager: 'Elena Rostova, PE'
  }
];

export const INITIAL_BOQ_ITEMS: BOQItem[] = [
  // Apex Commercial Center (prj-apex-fitout)
  {
    id: 'boq-001',
    projectId: 'prj-apex-fitout',
    itemNumber: '1.01',
    category: 'Demolition & Site Prep',
    description: 'Strip-out of existing internal partitions, non-structural fixtures, and floor coverings',
    unit: 'm²',
    quantity: 1450,
    rate: 18.50,
    amount: 26825.00,
    notes: 'Includes waste haulage to certified recycling depot'
  },
  {
    id: 'boq-002',
    projectId: 'prj-apex-fitout',
    itemNumber: '2.01',
    category: 'Masonry & Partitions',
    description: 'Double-stud acoustic drywall partition system (120mm total thickness, STC 52 rated)',
    unit: 'm²',
    quantity: 980,
    rate: 64.00,
    amount: 62720.00,
    notes: 'Includes sound insulation wool batts'
  },
  {
    id: 'boq-003',
    projectId: 'prj-apex-fitout',
    itemNumber: '2.02',
    category: 'Masonry & Partitions',
    description: '12mm toughened frameless glass partition with black anodized aluminum channel',
    unit: 'linear m',
    quantity: 140,
    rate: 185.00,
    amount: 25900.00,
    notes: 'Executive boardrooms and meeting pods'
  },
  {
    id: 'boq-004',
    projectId: 'prj-apex-fitout',
    itemNumber: '3.01',
    category: 'MEP (Mechanical & Electrical)',
    description: 'HVAC spiral ducting supply and installation including volume dampers and diffusers',
    unit: 'linear m',
    quantity: 420,
    rate: 92.00,
    amount: 38640.00,
    notes: 'Pressure tested to SMACNA Class B'
  },
  {
    id: 'boq-005',
    projectId: 'prj-apex-fitout',
    itemNumber: '3.02',
    category: 'MEP (Mechanical & Electrical)',
    description: 'Primary cable tray distribution network (300mm perforated heavy-duty galvanized)',
    unit: 'linear m',
    quantity: 310,
    rate: 48.00,
    amount: 14880.00,
    notes: 'Suspended from reinforced slab soffit'
  },
  {
    id: 'boq-006',
    projectId: 'prj-apex-fitout',
    itemNumber: '3.03',
    category: 'MEP (Mechanical & Electrical)',
    description: 'LED continuous linear architectural lighting fixtures (4000K, DALI dimmable)',
    unit: 'pcs',
    quantity: 260,
    rate: 145.00,
    amount: 37700.00,
    notes: 'Main open-plan workspace and circulation'
  },
  {
    id: 'boq-007',
    projectId: 'prj-apex-fitout',
    itemNumber: '4.01',
    category: 'Architectural Finishes',
    description: 'Heavy commercial nylon carpet tiles (500x500mm, Class 33 heavy commercial)',
    unit: 'm²',
    quantity: 1150,
    rate: 42.00,
    amount: 48300.00,
    notes: 'Includes low-VOC releasable adhesive'
  },
  {
    id: 'boq-008',
    projectId: 'prj-apex-fitout',
    itemNumber: '4.02',
    category: 'Architectural Finishes',
    description: 'Large format porcelain floor tiling in reception and washroom lobbies (600x1200mm)',
    unit: 'm²',
    quantity: 320,
    rate: 78.00,
    amount: 24960.00,
    notes: 'Rectified edge, R10 slip resistance rating'
  },
  // Harbor Point (prj-harbor-facade)
  {
    id: 'boq-101',
    projectId: 'prj-harbor-facade',
    itemNumber: '1.01',
    category: 'Substructure & Concrete',
    description: 'Structural steel anchor brackets chemical anchor embedment into perimeter beams',
    unit: 'pcs',
    quantity: 480,
    rate: 110.00,
    amount: 52800.00,
    notes: 'High-tensile torque-controlled installation'
  },
  {
    id: 'boq-102',
    projectId: 'prj-harbor-facade',
    itemNumber: '2.01',
    category: 'Exterior & Glazing',
    description: 'Unitized double-glazed low-E argon filled facade panels (3.2m x 1.5m)',
    unit: 'pcs',
    quantity: 320,
    rate: 1250.00,
    amount: 400000.00,
    notes: 'Thermal break structural aluminum frame'
  }
];

export const INITIAL_TASKS: Task[] = [
  // Apex Commercial Center
  {
    id: 'tsk-001',
    projectId: 'prj-apex-fitout',
    title: 'Install Level 4 HVAC main branch ducting & dampers',
    description: 'Rig and secure 400mm spiral ducting along grid lines D through G; calibrate balance dampers.',
    assignee: 'Crestline Mechanical Team',
    status: 'Completed',
    priority: 'High',
    progress: 100,
    dueDate: '2026-10-02',
    boqReferenceId: 'boq-004',
    boqReferenceDesc: '1.01 - HVAC spiral ducting'
  },
  {
    id: 'tsk-002',
    projectId: 'prj-apex-fitout',
    title: 'Level 3 perimeter acoustic insulation and plasterboard boarding',
    description: 'Fix double plasterboard lining to metal studs with staggered joints and acoustic sealant.',
    assignee: 'Apex Drywall Contractors',
    status: 'In Progress',
    priority: 'High',
    progress: 75,
    dueDate: '2026-10-08',
    boqReferenceId: 'boq-002',
    boqReferenceDesc: '2.01 - Acoustic drywall partition'
  },
  {
    id: 'tsk-003',
    projectId: 'prj-apex-fitout',
    title: 'Level 5 executive boardroom glass channel alignment',
    description: 'Survey datum lines with laser level and bolt down black floor channels for 12mm glass pods.',
    assignee: 'Glazing Solutions Ltd',
    status: 'In Progress',
    priority: 'Medium',
    progress: 40,
    dueDate: '2026-10-14',
    boqReferenceId: 'boq-003',
    boqReferenceDesc: '2.02 - 12mm toughened frameless glass'
  },
  {
    id: 'tsk-004',
    projectId: 'prj-apex-fitout',
    title: 'Sub-distribution board feeder cabling and megger testing',
    description: 'Pull 4-core 50mm² armored cables through riser to 4th floor electrical distribution cup.',
    assignee: 'Voltaic Systems Electricians',
    status: 'Not Started',
    priority: 'Urgent',
    progress: 0,
    dueDate: '2026-10-18',
    boqReferenceId: 'boq-005',
    boqReferenceDesc: '3.02 - Cable tray network'
  },
  {
    id: 'tsk-005',
    projectId: 'prj-apex-fitout',
    title: 'Reception terrazzo tile screed moisture test & prep',
    description: 'Measure relative humidity of concrete substrate (<75% RH required before floor laying).',
    assignee: 'Tiling Subcontractors',
    status: 'Not Started',
    priority: 'Medium',
    progress: 0,
    dueDate: '2026-10-24',
    boqReferenceId: 'boq-008',
    boqReferenceDesc: '4.02 - Porcelain floor tiling'
  },
  // Harbor Point
  {
    id: 'tsk-101',
    projectId: 'prj-harbor-facade',
    title: 'Hoist and lock Levels 8-10 facade glass cassettes',
    description: 'Operate spider crane on floor slab to lower panels into interlocking bracket slots.',
    assignee: 'Façade Rigging Specialists',
    status: 'In Progress',
    priority: 'High',
    progress: 45,
    dueDate: '2026-10-12',
    boqReferenceId: 'boq-102',
    boqReferenceDesc: '2.01 - Unitized facade panels'
  }
];

export const INITIAL_TIMESHEETS: TimesheetEntry[] = [
  {
    id: 'ts-001',
    projectId: 'prj-apex-fitout',
    date: '2026-10-05',
    workerName: 'David K. (Mechanical Lead)',
    taskTitle: 'Install Level 4 HVAC main branch ducting & dampers',
    hours: 8.0,
    description: 'Completed acoustic insulation wrapping and hung damper brackets along Grid Line D.'
  },
  {
    id: 'ts-002',
    projectId: 'prj-apex-fitout',
    date: '2026-10-05',
    workerName: 'Tariq H. (Fitter)',
    taskTitle: 'Install Level 4 HVAC main branch ducting & dampers',
    hours: 7.5,
    description: 'Mounted diffuser collars and conducted airflow seal inspection with site consultant.'
  },
  {
    id: 'ts-003',
    projectId: 'prj-apex-fitout',
    date: '2026-10-05',
    workerName: 'Sergei N. (Drywall Lead)',
    taskTitle: 'Level 3 perimeter acoustic insulation and plasterboard boarding',
    hours: 8.0,
    description: 'Fixed 42 plasterboard sheets along north facade perimeter; inserted Rockwool slabs.'
  },
  {
    id: 'ts-004',
    projectId: 'prj-apex-fitout',
    date: '2026-10-04',
    workerName: 'Marcus Vance (Site PM)',
    taskTitle: 'General Site Oversight & Consultant Walk',
    hours: 8.5,
    description: 'Conducted weekly milestone inspection with client representative; finalized CR-002 scope.'
  },
  {
    id: 'ts-005',
    projectId: 'prj-apex-fitout',
    date: '2026-10-04',
    workerName: 'Liam O. (Senior Electrician)',
    taskTitle: 'Sub-distribution board feeder cabling and megger testing',
    hours: 6.5,
    description: 'Surveyed vertical electrical riser cable path; confirmed bracket clearance.'
  },
  {
    id: 'ts-006',
    projectId: 'prj-apex-fitout',
    date: '2026-10-03',
    workerName: 'Sergei N. (Drywall Lead)',
    taskTitle: 'Level 3 perimeter acoustic insulation and plasterboard boarding',
    hours: 8.0,
    description: 'Installed floor and ceiling track runners across Zone B partitions.'
  }
];

export const INITIAL_DAILY_PROGRESS: DailyProgressUpdate[] = [
  {
    id: 'dp-001',
    projectId: 'prj-apex-fitout',
    date: '2026-10-05',
    overallProgress: 64,
    completedWork: 'Level 4 HVAC primary ductwork fully hung and pressure tested. Level 3 north perimeter drywall first-fix boarding closed out.',
    workInProgress: 'Level 5 laser alignment of executive glass partition channels; pulling sub-main electrical cabling through Level 4 riser.',
    blockers: 'Awaiting client approval on reception feature lighting finish spec (CR-003). Currently not impacting critical path.',
    weatherConditions: 'Indoor conditioned workspace; dry site conditions.',
    notes: 'Building management scheduled freight elevator priority access tomorrow from 07:00 to 11:00 for glass panel delivery.',
    reportedBy: 'Marcus Vance (Project Manager)',
    createdAt: '2026-10-05T15:30:00Z'
  },
  {
    id: 'dp-002',
    projectId: 'prj-apex-fitout',
    date: '2026-10-03',
    overallProgress: 61,
    completedWork: 'Level 3 sound insulation batts placement verified by independent acoustic inspector. Cable trays on Level 4 grounded.',
    workInProgress: 'Drywall framing in Level 4 meeting rooms; sprinkler head drops relocated per revised partition layout.',
    blockers: 'None.',
    weatherConditions: 'Clear, 21°C.',
    notes: 'Consultant signed off rough-in inspection report with zero non-conformances.',
    reportedBy: 'Marcus Vance (Project Manager)',
    createdAt: '2026-10-03T16:00:00Z'
  },
  {
    id: 'dp-003',
    projectId: 'prj-apex-fitout',
    date: '2026-09-28',
    overallProgress: 56,
    completedWork: 'Demolition waste removal 100% complete across all 3 levels. Primary HVAC fan coil units mounted to slab.',
    workInProgress: 'Perimeter drywall track layout and shooting pins into floor slabs.',
    blockers: 'Minor delay on freight dock access on Wednesday (resolved).',
    weatherConditions: 'Normal indoor site work.',
    notes: 'All subcontractors inducted under revised Site Safety Guidelines v2.1.',
    reportedBy: 'Marcus Vance (Project Manager)',
    createdAt: '2026-09-28T17:15:00Z'
  }
];

export const INITIAL_CHANGE_LOGS: ChangeLogItem[] = [
  {
    id: 'cr-001',
    projectId: 'prj-apex-fitout',
    changeNumber: 'CR-001',
    title: 'Upgraded Acoustic Rating for Boardroom Glass Partitions',
    dateRequested: '2026-09-18',
    requestedBy: 'Apex Horizon Real Estate Corp (Client)',
    description: 'Switch from single 10mm toughened glass to 12.8mm acoustic laminated safety glass with drop seals.',
    reason: 'Executive privacy requirement following confidential tenant requirements.',
    costImpact: 6400.00,
    scheduleImpactDays: 2,
    status: 'Approved',
    reviewNotes: 'Approved by Client Representative Sarah Jenkins on 2026-09-20. Glass supplier confirmed lead-time.',
    reviewedDate: '2026-09-20',
    reviewedBy: 'Marcus Vance'
  },
  {
    id: 'cr-002',
    projectId: 'prj-apex-fitout',
    changeNumber: 'CR-002',
    title: 'Additional Floor Power Grommets in Level 4 Collaboration Hub',
    dateRequested: '2026-09-26',
    requestedBy: 'Interior Designer / Tenant Consultant',
    description: 'Add 14 dual-circuit flush floor boxes with integrated USB-C 65W charging hubs.',
    reason: 'Revised furniture plan incorporating flexible hot-desking island pods.',
    costImpact: 4200.00,
    scheduleImpactDays: 0,
    status: 'Approved',
    reviewNotes: 'No impact to project handover date. Work absorbed within electrical buffer window.',
    reviewedDate: '2026-09-28',
    reviewedBy: 'Marcus Vance'
  },
  {
    id: 'cr-003',
    projectId: 'prj-apex-fitout',
    changeNumber: 'CR-003',
    title: 'Re-routing of Main Chilled Water Return Line at Grid B3',
    dateRequested: '2026-10-04',
    requestedBy: 'Site Mechanical Engineer',
    description: 'Offset chilled water pipe by 450mm to clear unforeseen structural concrete downstand beam.',
    reason: 'As-built structural concrete beam deviation discovered during ceiling laser scan.',
    costImpact: 1850.00,
    scheduleImpactDays: 1,
    status: 'Pending Review',
    reviewNotes: 'Pending final sign-off from structural consultant regarding bracket anchor location.',
    reviewedDate: undefined,
    reviewedBy: undefined
  }
];

export const INITIAL_GUIDELINES: ProjectGuideline[] = [
  {
    id: 'guide-001',
    projectId: 'prj-apex-fitout',
    title: 'Site Safety Protocol & Emergency Evacuation Manual',
    fileName: 'Apex_Site_Safety_Rules_Rev2.4.pdf',
    fileSizeBytes: 2450000,
    fileExtension: 'pdf',
    category: 'Safety Protocols',
    uploadDate: '2026-08-14',
    description: 'Mandatory PPE requirements, hot-work permits, and fire assembly points for Apex Tower works.',
    uploadedBy: 'Compliance Admin',
    version: 'Rev 2.4'
  },
  {
    id: 'guide-002',
    projectId: 'prj-apex-fitout',
    title: 'Acoustic Ceiling & Drywall QA/QC Specification Standards',
    fileName: 'Spec_09_22_16_Acoustics_V3.pdf',
    fileSizeBytes: 1820000,
    fileExtension: 'pdf',
    category: 'Quality Standards',
    uploadDate: '2026-08-20',
    description: 'Defines acceptable acoustic tolerances, sealants, stud spacing, and decibel attenuation tests.',
    uploadedBy: 'Architectural Consultant',
    version: 'V3.0'
  },
  {
    id: 'guide-003',
    projectId: 'prj-apex-fitout',
    title: 'Building Loading Dock & Freight Hoist Operational Logistics',
    fileName: 'Apex_Tower_Freight_Logistics_SOP.docx',
    fileSizeBytes: 890000,
    fileExtension: 'docx',
    category: 'Site Logistics',
    uploadDate: '2026-09-02',
    description: 'Operating hours, booking procedures, and vehicle height clearances for basement loading bay.',
    uploadedBy: 'Facilities Admin',
    version: 'Rev 1.1'
  },
  {
    id: 'guide-004',
    projectId: 'prj-apex-fitout',
    title: 'Contract Variation & Scope Management Procedures',
    fileName: 'Contract_Admin_Guidelines_Commercial.pdf',
    fileSizeBytes: 1200000,
    fileExtension: 'pdf',
    category: 'Contractual Guidelines',
    uploadDate: '2026-08-15',
    description: 'Official procedure for issuing Change Orders, price impact evaluations, and signature thresholds.',
    uploadedBy: 'Contracts Director',
    version: 'V1.0'
  }
];
