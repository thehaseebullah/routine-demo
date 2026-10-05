import {
  AppStateData,
  INITIAL_PROJECTS,
  INITIAL_BOQ_ITEMS,
  INITIAL_TASKS,
  INITIAL_TIMESHEETS,
  INITIAL_DAILY_PROGRESS,
  INITIAL_CHANGE_LOGS,
  INITIAL_GUIDELINES
} from './initialSeedData';

export type { AppStateData };

const STORAGE_KEY = 'routine_app_state_v1';

export function getInitialState(): AppStateData {
  return {
    projects: INITIAL_PROJECTS,
    activeProjectId: INITIAL_PROJECTS[0].id,
    boqItems: INITIAL_BOQ_ITEMS,
    tasks: INITIAL_TASKS,
    timesheets: INITIAL_TIMESHEETS,
    dailyProgressUpdates: INITIAL_DAILY_PROGRESS,
    changeLogs: INITIAL_CHANGE_LOGS,
    guidelines: INITIAL_GUIDELINES
  };
}

export function loadStoredState(): AppStateData {
  if (typeof window === 'undefined') {
    return getInitialState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      saveStoredState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppStateData;
    // Basic integrity validation
    if (!parsed.projects || !Array.isArray(parsed.projects) || parsed.projects.length === 0) {
      const initial = getInitialState();
      saveStoredState(initial);
      return initial;
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to parse localStorage for Routine, falling back to seed data', err);
    const initial = getInitialState();
    saveStoredState(initial);
    return initial;
  }
}

export function saveStoredState(state: AppStateData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving state to localStorage', err);
  }
}

export function resetStoredState(): AppStateData {
  const initial = getInitialState();
  saveStoredState(initial);
  return initial;
}
