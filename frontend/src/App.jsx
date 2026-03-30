import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import OrgHome from './pages/OrgHome';
import ClientHome from './pages/ClientHome';
import JoinQueue from './pages/JoinQueue';
import QueueStatus from './pages/QueueStatus';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/org/dashboard" element={
            <ProtectedRoute role="organization"><OrgHome /></ProtectedRoute>
          } />
          <Route path="/client/home" element={
            <ProtectedRoute role="client"><ClientHome /></ProtectedRoute>
          } />
          <Route path="/join/:token" element={
            <ProtectedRoute><JoinQueue /></ProtectedRoute>
          } />
          <Route path="/queue/:orgId" element={
            <ProtectedRoute role="client"><QueueStatus /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}