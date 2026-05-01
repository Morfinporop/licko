import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { Navbar } from './components/ui/Navbar';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { PublicBioPage } from './pages/PublicBioPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
}

export default function App() {
  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050505]">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(12px)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 16px'
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#0a0a0a'
              }
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#0a0a0a'
              }
            }
          }}
        />

        <Routes>
          {/* Public bio pages - no navbar */}
          <Route path="/u/:username" element={<PublicBioPage />} />

          {/* All other routes with navbar */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><AuthPage /></PublicRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                  <Route path="/editor" element={<PrivateRoute><EditorPage /></PrivateRoute>} />
                  <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
