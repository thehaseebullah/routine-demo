import React, { useState } from 'react';
import { RoleProvider, useRole } from './context/RoleContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { MobileSimulatorShell } from './components/layout/MobileSimulatorShell';
import { ProjectHeader } from './components/layout/ProjectHeader';
import { NavigationBar, NavTabId } from './components/layout/NavigationBar';

// Modules
import { ProjectOverview } from './components/modules/overview/ProjectOverview';
import { ClientProjectPortal } from './components/modules/clientView/ClientProjectPortal';
import { BOQList } from './components/modules/boq/BOQList';
import { TaskList } from './components/modules/tasks/TaskList';
import { TimesheetList } from './components/modules/timesheets/TimesheetList';
import { DailyProgressTimeline } from './components/modules/dailyProgress/DailyProgressTimeline';
import { ChangeLogList } from './components/modules/changeLog/ChangeLogList';
import { GuidelineList } from './components/modules/guidelines/GuidelineList';
import { UserGuideModal } from './components/common/UserGuideModal';

const AppContent: React.FC = () => {
  const { role } = useRole();
  const { activeProject } = useProject();
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // If switched to client role while on timesheets, fallback to overview
  const currentTab = role === 'client' && activeTab === 'timesheets' ? 'overview' : activeTab;

  return (
    <MobileSimulatorShell>
      {/* Active Project Banner & Metrics */}
      <ProjectHeader />

      {/* Sub Navigation Bar (Desktop top tabs & Mobile bottom bar) */}
      <NavigationBar
        activeTab={currentTab}
        onTabChange={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Tab View Container */}
      <main style={{ paddingBottom: '30px' }}>
        {currentTab === 'overview' && (
          role === 'client' ? (
            <ClientProjectPortal onNavigateTab={setActiveTab} />
          ) : (
            <ProjectOverview onNavigateTab={setActiveTab} />
          )
        )}

        {currentTab === 'boq' && <BOQList />}

        {currentTab === 'tasks' && <TaskList />}

        {currentTab === 'timesheets' && role !== 'client' && <TimesheetList />}

        {currentTab === 'progress' && <DailyProgressTimeline />}

        {currentTab === 'changes' && <ChangeLogList />}

        {currentTab === 'guidelines' && <GuidelineList />}
      </main>

      {/* Global Interactive User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </MobileSimulatorShell>
  );
};

export const App: React.FC = () => {
  return (
    <RoleProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </RoleProvider>
  );
};

export default App;
