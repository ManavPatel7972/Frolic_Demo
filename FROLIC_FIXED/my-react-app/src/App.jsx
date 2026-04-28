import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Institutes from './pages/Institutes/Institutes';
import Departments from './pages/Departments/Departments';
import Events from './pages/Events/Events';
import ParticipantDashboard from './pages/ParticipantDashboard/ParticipantDashboard';

// Admin/Form Pages
import AddInstitute from './pages/Admin/AddInstitute';
import AddDepartment from './pages/Admin/AddDepartment';
import AddEvent from './pages/Admin/AddEvent';
import ManageData from './pages/Admin/ManageData';
import AddGroup from './pages/Admin/AddGroup';
import AddParticipant from './pages/Admin/AddParticipant';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AllParticipants from './pages/Admin/AllParticipants';

import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Main Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ParticipantDashboard />} />
          <Route path="institutes" element={<Institutes />} />
          <Route path="departments" element={<Departments />} />
          <Route path="events" element={<Events />} />

          {/* Protected Form Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="admin">
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="manage" element={<ManageData />} />
              <Route path="add-institute" element={<AddInstitute />} />
              <Route path="add-department" element={<AddDepartment />} />
              <Route path="add-event" element={<AddEvent />} />
              <Route path="participants" element={<AllParticipants />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
