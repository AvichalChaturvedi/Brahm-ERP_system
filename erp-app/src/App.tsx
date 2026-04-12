import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';

// Mock data provider
const MockDataContext = React.createContext<any>(null);

export const useMockData = () => {
  const context = React.useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within MockDataProvider');
  }
  return context;
};

const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState([
    {
      id: '1',
      name: 'IoT Environmental Sensor Hub',
      description: 'Smart environmental monitoring system',
      status: 'active',
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      target_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: 'user1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Wireless Power Bank',
      description: 'Ultra-fast wireless charging device',
      status: 'planning',
      start_date: new Date().toISOString(),
      target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: 'user1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [tasks, setTasks] = useState([
    {
      id: '1',
      project_id: '1',
      title: 'Design sensor interface',
      status: 'in_progress',
      priority: 'high',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      project_id: '1',
      title: 'Firmware development',
      status: 'not_started',
      priority: 'critical',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      project_id: '1',
      title: 'PCB design review',
      status: 'review',
      priority: 'high',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const addProject = (project: any) => {
    setProjects([...projects, { ...project, id: Date.now().toString() }]);
  };

  const addTask = (task: any) => {
    setTasks([...tasks, { ...task, id: Date.now().toString() }]);
  };

  return (
    <MockDataContext.Provider value={{ projects, tasks, addProject, addTask }}>
      {children}
    </MockDataContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <MockDataProvider>
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-0 md:ml-64">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
              <Route path="/tasks" element={<div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks Page Coming Soon</h2></div>} />
              <Route path="/qa" element={<div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">QA/QC Module Coming Soon</h2></div>} />
              <Route path="/firmware" element={<div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Firmware Module Coming Soon</h2></div>} />
              <Route path="/uiux" element={<div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">UI/UX Module Coming Soon</h2></div>} />
              <Route path="/pcb" element={<div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">PCB Engineering Module Coming Soon</h2></div>} />
              <Route path="/bom" element={<div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">BOM & Procurement Module Coming Soon</h2></div>} />
              <Route path="/documents" element={<div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Documents Module Coming Soon</h2></div>} />
              <Route path="/settings" element={<div className="p-8 bg-slate-50 dark:bg-slate-900 min-h-screen"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings Coming Soon</h2></div>} />
            </Routes>
          </div>
        </div>
      </Router>
    </MockDataProvider>
  );
};

export default App;
