import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import OrgHome from './pages/OrgHome';
import ClientHome from './pages/ClientHome';
import JoinQueue from './pages/JoinQueue';
import QueueStatus from './pages/QueueStatus';

function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === '/') return null;
  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        position: 'fixed', top: 14, left: 16, zIndex: 200,
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#94a3b8', fontSize: 13, fontWeight: 500,
        padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
        transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
    >
      ← Back
    </button>
  );
}

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
        <BackButton />
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