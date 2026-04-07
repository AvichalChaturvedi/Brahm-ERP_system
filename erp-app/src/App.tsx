import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { supabase } from './services/supabase';
import { profileService } from './services/api';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { user, profile, setUser, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          const userProfile = await profileService.getProfile(session.user.id);
          if (userProfile) {
            setProfile(userProfile);
          } else {
            const teamRes = await supabase.from('teams').insert([
              {
                name: `${session.user.email}'s Team`,
                created_by: session.user.id,
              },
            ]).select().single();

            if (teamRes.data) {
              const newProfile = await supabase.from('profiles').insert([
                {
                  user_id: session.user.id,
                  email: session.user.email!,
                  full_name: session.user.user_metadata?.full_name || 'User',
                  team_id: teamRes.data.id,
                },
              ]).select().single();

              if (newProfile.data) {
                setProfile(newProfile.data);
              }
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [setUser, setProfile, setLoading]);

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64">
          <Routes>
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDetailsPage /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><div className="p-8">Tasks Page Coming Soon</div></ProtectedRoute>} />
            <Route path="/qa" element={<ProtectedRoute><div className="p-8">QA/QC Module Coming Soon</div></ProtectedRoute>} />
            <Route path="/firmware" element={<ProtectedRoute><div className="p-8">Firmware Module Coming Soon</div></ProtectedRoute>} />
            <Route path="/uiux" element={<ProtectedRoute><div className="p-8">UI/UX Module Coming Soon</div></ProtectedRoute>} />
            <Route path="/pcb" element={<ProtectedRoute><div className="p-8">PCB Engineering Module Coming Soon</div></ProtectedRoute>} />
            <Route path="/bom" element={<ProtectedRoute><div className="p-8">BOM & Procurement Module Coming Soon</div></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><div className="p-8">Documents Module Coming Soon</div></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><div className="p-8">Settings Coming Soon</div></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
