import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/Students/StudentList';
import AddStudent from './pages/Students/AddStudent';
import StudentSummary from './pages/Students/StudentSummary';
import FeeStructure from './pages/Fees/FeeStructure';
import AddFeeStructure from './pages/Fees/AddFeeStructure';
import PaymentList from './pages/Payments/PaymentList';
import AddPayment from './pages/Payments/AddPayment';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import EmailSettings from './pages/Settings/EmailSettings';
import CreateUser from './pages/Admin/CreateUser';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="settings/email" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <EmailSettings />
        </ProtectedRoute>
      } />
      <Route path="admin/create-user" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CreateUser />
        </ProtectedRoute>
      } />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Student Routes */}
        <Route path="students">
          <Route index element={
            <ProtectedRoute allowedRoles={['admin', 'accountant']}>
              <StudentList />
            </ProtectedRoute>
          } />
          <Route path="add" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddStudent />
            </ProtectedRoute>
          } />
          <Route path=":id/summary" element={
            <ProtectedRoute allowedRoles={['admin', 'accountant', 'student']}>
              <StudentSummary />
            </ProtectedRoute>
          } />
        </Route>

        {/* Fee Routes */}
        <Route path="fees">
          <Route index element={<FeeStructure />} />
          <Route path="add" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddFeeStructure />
            </ProtectedRoute>
          } />
        </Route>

        {/* Payment Routes */}
        <Route path="payments">
          <Route index element={
            <ProtectedRoute allowedRoles={['admin', 'accountant']}>
              <PaymentList />
            </ProtectedRoute>
          } />
          <Route path="add" element={
            <ProtectedRoute allowedRoles={['accountant']}>
              <AddPayment />
            </ProtectedRoute>
          } />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;