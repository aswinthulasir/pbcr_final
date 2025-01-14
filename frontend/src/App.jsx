import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PatientRegistryForm from './pages/PatientRegistryForm';
import AcceptedEntries from './pages/AcceptedEntries';
import PatientFollowUp from './pages/PatientFollowUp';
import MortalityRecords from './pages/MortalityRecords';
import ReturnedEntries from './pages/ReturnedEntries';

// Import admin pages
import StateAdminDashboard from './pages/admin/state/Dashboard';
import CenterAdminDashboard from './pages/admin/center/Dashboard';
import HospitalAdminDashboard from './pages/admin/hospital/Dashboard';

// Protected Route Component with Role Check
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const auth = store.getState().auth;
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(auth.user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Unauthorized Access Page
const UnauthorizedPage = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100vh' 
  }}>
    <h1>Unauthorized Access</h1>
    <p>You don't have permission to access this page.</p>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Data Collector Routes */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['data_collector']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/registry" element={
            <ProtectedRoute allowedRoles={['data_collector']}>
              <PatientRegistryForm />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/follow-up" element={
            <ProtectedRoute allowedRoles={['data_collector']}>
              <PatientFollowUp />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/mortality" element={
            <ProtectedRoute allowedRoles={['data_collector']}>
              <MortalityRecords />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/accepted" element={
            <ProtectedRoute allowedRoles={['data_collector']}>
              <AcceptedEntries />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/returned" element={
            <ProtectedRoute allowedRoles={['data_collector']}>
              <ReturnedEntries />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/state" element={
            <ProtectedRoute allowedRoles={['state_admin']}>
              <StateAdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/center" element={
            <ProtectedRoute allowedRoles={['center_admin']}>
              <CenterAdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/hospital" element={
            <ProtectedRoute allowedRoles={['hospital_admin']}>
              <HospitalAdminDashboard />
            </ProtectedRoute>
          } />

          {/* Root Route */}
          <Route path="/" element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

// Component to handle role-based redirects
const RoleBasedRedirect = () => {
  const auth = store.getState().auth;
  
  switch (auth.user?.role) {
    case 'state_admin':
      return <Navigate to="/admin/state" replace />;
    case 'center_admin':
      return <Navigate to="/admin/center" replace />;
    case 'hospital_admin':
      return <Navigate to="/admin/hospital" replace />;
    case 'data_collector':
      return <Navigate to="/profile" replace />;
    default:
      return <Navigate to="/profile" replace />;
  }
};

export default App;