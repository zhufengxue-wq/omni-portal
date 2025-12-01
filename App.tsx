import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Finance from './pages/Finance';
import OmniLife from './pages/OmniLife';
import MagicSchool from './pages/MagicSchool';
import Governance from './pages/Governance';
import ProjectDetail from './pages/ProjectDetail';
import OmniItemDetail from './pages/OmniItemDetail';
import ToolboxDetail from './pages/ToolboxDetail';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Login Route Wrapper (redirects to home if already logged in)
const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Login />;
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginRoute />} />
            
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout><Profile /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/projects" element={
                <ProtectedRoute>
                    <Layout><Projects /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/project/:id" element={
                <ProtectedRoute>
                    <Layout><ProjectDetail /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/finance" element={
                <ProtectedRoute>
                    <Layout><Finance /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/magic-school" element={
                <ProtectedRoute>
                    <Layout><MagicSchool /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/omni-life" element={
                <ProtectedRoute>
                    <Layout><OmniLife /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/governance" element={
                <ProtectedRoute>
                    <Layout><Governance /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/omni-item/:id" element={
                <ProtectedRoute>
                    <Layout><OmniItemDetail /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/toolbox/:id" element={
                <ProtectedRoute>
                    <Layout><ToolboxDetail /></Layout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
            <AppRoutes />
        </Router>
    </AuthProvider>
  );
};

export default App;