import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Topbar } from '../components/Topbar';

const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'IoT Environmental Sensor Hub',
    description: 'Smart environmental monitoring system',
    status: 'active',
    target_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Wireless Power Bank',
    description: 'Ultra-fast wireless charging device',
    status: 'planning',
    target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const ProjectsPage: React.FC = () => {
  const [projects] = useState(MOCK_PROJECTS);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Topbar title="Projects" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage all your hardware development projects</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:shadow-lg transition h-full">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{project.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {new Date(project.target_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
