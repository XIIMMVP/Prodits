import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './store/AuthContext';
import { StoreProvider } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
import Insights from './pages/Insights';
import Journal from './pages/Journal';
import AuthPage from './pages/AuthPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 animate-pulse">
            <span className="text-3xl">🎯</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated: show auth page
  if (!user) {
    return <AuthPage />;
  }

  // Authenticated: show app
  return (
    <StoreProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
