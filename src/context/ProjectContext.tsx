import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../types/project';
import { BOQItem } from '../types/boq';
import { Task, TaskStatus } from '../types/task';
import { TimesheetEntry } from '../types/timesheet';
import { DailyProgressUpdate } from '../types/dailyProgress';
import { ChangeLogItem, ChangeReviewStatus } from '../types/changeLog';
import { ProjectGuideline } from '../types/guideline';
import { calculateBOQAmount } from '../services/boqService';
import { AppStateData } from '../services/storage/initialSeedData';
import {
  loadStoredState,
  saveStoredState,
  resetStoredState
} from '../services/storage/localStorageAdapter';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | undefined;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  createProject: (newProject: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  // BOQ
  boqItems: BOQItem[];
  addBOQItem: (item: Omit<BOQItem, 'id' | 'amount'>) => void;
  updateBOQItem: (item: BOQItem) => void;
  deleteBOQItem: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  updateTaskStatusAndProgress: (taskId: string, status: TaskStatus, progress: number) => void;
  deleteTask: (id: string) => void;

  // Timesheets
  timesheets: TimesheetEntry[];
  addTimesheetEntry: (entry: Omit<TimesheetEntry, 'id'>) => void;
  updateTimesheetEntry: (entry: TimesheetEntry) => void;
  deleteTimesheetEntry: (id: string) => void;

  // Daily Progress
  dailyProgressUpdates: DailyProgressUpdate[];
  addDailyProgressUpdate: (update: Omit<DailyProgressUpdate, 'id' | 'createdAt'>) => void;
  updateDailyProgressUpdate: (update: DailyProgressUpdate) => void;
  deleteDailyProgressUpdate: (id: string) => void;

  // Change Log
  changeLogs: ChangeLogItem[];
  addChangeLogItem: (item: Omit<ChangeLogItem, 'id' | 'changeNumber'>) => void;
  updateChangeLogStatus: (id: string, status: ChangeReviewStatus, reviewNotes?: string) => void;
  updateChangeLogItem: (item: ChangeLogItem) => void;
  deleteChangeLogItem: (id: string) => void;

  // Guidelines
  guidelines: ProjectGuideline[];
  addGuideline: (guideline: Omit<ProjectGuideline, 'id' | 'uploadDate'>) => void;
  updateGuideline: (guideline: ProjectGuideline) => void;
  deleteGuideline: (id: string) => void;

  // Demo Reset
  resetDemo: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppStateData>(() => loadStoredState());

  // Keep localStorage synced whenever state updates
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  const activeProject = state.projects.find((p: Project) => p.id === state.activeProjectId) || state.projects[0];

  const setActiveProjectId = (id: string) => {
    setState((prev: AppStateData) => ({ ...prev, activeProjectId: id }));
  };

  const createProject = (newProject: Omit<Project, 'id'>) => {
    const id = `prj-${Date.now()}`;
    const fullProject: Project = { ...newProject, id };
    setState((prev: AppStateData) => ({
      ...prev,
      projects: [...prev.projects, fullProject],
      activeProjectId: id
    }));
  };

  const updateProject = (project: Project) => {
    setState((prev: AppStateData) => ({
      ...prev,
      projects: prev.projects.map((p: Project) => (p.id === project.id ? project : p))
    }));
  };

  const deleteProject = (id: string) => {
    setState((prev: AppStateData) => {
      if (prev.projects.length <= 1) {
        alert('Cannot delete the only remaining project.');
        return prev;
      }
      const remaining = prev.projects.filter((p: Project) => p.id !== id);
      const nextActiveId = prev.activeProjectId === id ? remaining[0].id : prev.activeProjectId;
      return {
        ...prev,
        projects: remaining,
        activeProjectId: nextActiveId,
        // Cascade cleanup
        boqItems: prev.boqItems.filter((b: BOQItem) => b.projectId !== id),
        tasks: prev.tasks.filter((t: Task) => t.projectId !== id),
        timesheets: prev.timesheets.filter((ts: TimesheetEntry) => ts.projectId !== id),
        dailyProgressUpdates: prev.dailyProgressUpdates.filter((dp: DailyProgressUpdate) => dp.projectId !== id),
        changeLogs: prev.changeLogs.filter((cl: ChangeLogItem) => cl.projectId !== id)
      };
    });
  };

  // --- BOQ Actions ---
  const activeBOQItems = state.boqItems.filter(
    (item: BOQItem) => item.projectId === (activeProject?.id || '')
  );

  const addBOQItem = (item: Omit<BOQItem, 'id' | 'amount'>) => {
    const amount = calculateBOQAmount(item.quantity, item.rate);
    const newItem: BOQItem = {
      ...item,
      id: `boq-${Date.now()}`,
      amount
    };
    setState((prev: AppStateData) => ({
      ...prev,
      boqItems: [...prev.boqItems, newItem]
    }));
  };

  const updateBOQItem = (item: BOQItem) => {
    const amount = calculateBOQAmount(item.quantity, item.rate);
    const updated = { ...item, amount };
    setState((prev: AppStateData) => ({
      ...prev,
      boqItems: prev.boqItems.map((b: BOQItem) => (b.id === item.id ? updated : b))
    }));
  };

  const deleteBOQItem = (id: string) => {
    setState((prev: AppStateData) => ({
      ...prev,
      boqItems: prev.boqItems.filter((b: BOQItem) => b.id !== id)
    }));
  };

  // --- Task Actions ---
  const activeTasks = state.tasks.filter(
    (t: Task) => t.projectId === (activeProject?.id || '')
  );

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `tsk-${Date.now()}`
    };
    setState((prev: AppStateData) => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const updateTask = (task: Task) => {
    setState((prev: AppStateData) => ({
      ...prev,
      tasks: prev.tasks.map((t: Task) => (t.id === task.id ? task : t))
    }));
  };

  const updateTaskStatusAndProgress = (taskId: string, status: TaskStatus, progress: number) => {
    setState((prev: AppStateData) => ({
      ...prev,
      tasks: prev.tasks.map((t: Task) =>
        t.id === taskId ? { ...t, status, progress } : t
      )
    }));
  };

  const deleteTask = (id: string) => {
    setState((prev: AppStateData) => ({
      ...prev,
      tasks: prev.tasks.filter((t: Task) => t.id !== id)
    }));
  };

  // --- Timesheet Actions ---
  const activeTimesheets = state.timesheets.filter(
    (ts: TimesheetEntry) => ts.projectId === (activeProject?.id || '')
  );

  const addTimesheetEntry = (entry: Omit<TimesheetEntry, 'id'>) => {
    const newEntry: TimesheetEntry = {
      ...entry,
      id: `ts-${Date.now()}`
    };
    setState((prev: AppStateData) => ({
      ...prev,
      timesheets: [newEntry, ...prev.timesheets]
    }));
  };

  const updateTimesheetEntry = (entry: TimesheetEntry) => {
    setState((prev: AppStateData) => ({
      ...prev,
      timesheets: prev.timesheets.map((ts: TimesheetEntry) => (ts.id === entry.id ? entry : ts))
    }));
  };

  const deleteTimesheetEntry = (id: string) => {
    setState((prev: AppStateData) => ({
      ...prev,
      timesheets: prev.timesheets.filter((ts: TimesheetEntry) => ts.id !== id)
    }));
  };

  // --- Daily Progress Actions ---
  const activeDailyProgress = state.dailyProgressUpdates.filter(
    (dp: DailyProgressUpdate) => dp.projectId === (activeProject?.id || '')
  );

  const addDailyProgressUpdate = (update: Omit<DailyProgressUpdate, 'id' | 'createdAt'>) => {
    const nowIso = new Date().toISOString();
    const newUpdate: DailyProgressUpdate = {
      ...update,
      id: `dp-${Date.now()}`,
      createdAt: nowIso
    };

    setState((prev: AppStateData) => {
      // Also update project's overallProgress to match the latest update
      const updatedProjects = prev.projects.map((p: Project) =>
        p.id === update.projectId
          ? { ...p, overallProgress: update.overallProgress }
          : p
      );

      return {
        ...prev,
        projects: updatedProjects,
        dailyProgressUpdates: [newUpdate, ...prev.dailyProgressUpdates]
      };
    });
  };

  const updateDailyProgressUpdate = (update: DailyProgressUpdate) => {
    setState((prev: AppStateData) => {
      const updatedList = prev.dailyProgressUpdates.map((dp: DailyProgressUpdate) =>
        dp.id === update.id ? update : dp
      );
      // Update project overall progress
      const updatedProjects = prev.projects.map((p: Project) =>
        p.id === update.projectId
          ? { ...p, overallProgress: update.overallProgress }
          : p
      );
      return {
        ...prev,
        projects: updatedProjects,
        dailyProgressUpdates: updatedList
      };
    });
  };

  const deleteDailyProgressUpdate = (id: string) => {
    setState((prev: AppStateData) => ({
      ...prev,
      dailyProgressUpdates: prev.dailyProgressUpdates.filter((dp: DailyProgressUpdate) => dp.id !== id)
    }));
  };

  // --- Change Log Actions ---
  const activeChangeLogs = state.changeLogs.filter(
    (cl: ChangeLogItem) => cl.projectId === (activeProject?.id || '')
  );

  const addChangeLogItem = (item: Omit<ChangeLogItem, 'id' | 'changeNumber'>) => {
    const nextNum = activeChangeLogs.length + 1;
    const changeNumber = `CR-${String(nextNum).padStart(3, '0')}`;
    const newItem: ChangeLogItem = {
      ...item,
      id: `cr-${Date.now()}`,
      changeNumber
    };
    setState((prev: AppStateData) => ({
      ...prev,
      changeLogs: [newItem, ...prev.changeLogs]
    }));
  };

  const updateChangeLogStatus = (
    id: string,
    status: ChangeReviewStatus,
    reviewNotes?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setState((prev: AppStateData) => ({
      ...prev,
      changeLogs: prev.changeLogs.map((cl: ChangeLogItem) =>
        cl.id === id
          ? {
              ...cl,
              status,
              reviewNotes: reviewNotes !== undefined ? reviewNotes : cl.reviewNotes,
              reviewedDate: today,
              reviewedBy: 'Project Lead'
            }
          : cl
      )
    }));
  };

  const updateChangeLogItem = (item: ChangeLogItem) => {
    setState((prev: AppStateData) => ({
      ...prev,
      changeLogs: prev.changeLogs.map((cl: ChangeLogItem) => (cl.id === item.id ? item : cl))
    }));
  };

  const deleteChangeLogItem = (id: string) => {
    setState((prev: AppStateData) => ({
      ...prev,
      changeLogs: prev.changeLogs.filter((cl: ChangeLogItem) => cl.id !== id)
    }));
  };

  // --- Guidelines Actions ---
  const activeGuidelines = state.guidelines.filter(
    (g: ProjectGuideline) => g.projectId === 'ALL' || g.projectId === (activeProject?.id || '')
  );

  const addGuideline = (guideline: Omit<ProjectGuideline, 'id' | 'uploadDate'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newDoc: ProjectGuideline = {
      ...guideline,
      id: `guide-${Date.now()}`,
      uploadDate: today
    };
    setState((prev: AppStateData) => ({
      ...prev,
      guidelines: [newDoc, ...prev.guidelines]
    }));
  };

  const updateGuideline = (guideline: ProjectGuideline) => {
    setState((prev: AppStateData) => ({
      ...prev,
      guidelines: prev.guidelines.map((g: ProjectGuideline) => (g.id === guideline.id ? guideline : g))
    }));
  };

  const deleteGuideline = (id: string) => {
    setState((prev: AppStateData) => ({
      ...prev,
      guidelines: prev.guidelines.filter((g: ProjectGuideline) => g.id !== id)
    }));
  };

  // --- Demo Reset ---
  const resetDemo = () => {
    const fresh = resetStoredState();
    setState(fresh);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects: state.projects,
        activeProject,
        activeProjectId: state.activeProjectId,
        setActiveProjectId,
        createProject,
        updateProject,
        deleteProject,

        boqItems: activeBOQItems,
        addBOQItem,
        updateBOQItem,
        deleteBOQItem,

        tasks: activeTasks,
        addTask,
        updateTask,
        updateTaskStatusAndProgress,
        deleteTask,

        timesheets: activeTimesheets,
        addTimesheetEntry,
        updateTimesheetEntry,
        deleteTimesheetEntry,

        dailyProgressUpdates: activeDailyProgress,
        addDailyProgressUpdate,
        updateDailyProgressUpdate,
        deleteDailyProgressUpdate,

        changeLogs: activeChangeLogs,
        addChangeLogItem,
        updateChangeLogStatus,
        updateChangeLogItem,
        deleteChangeLogItem,

        guidelines: activeGuidelines,
        addGuideline,
        updateGuideline,
        deleteGuideline,

        resetDemo
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
