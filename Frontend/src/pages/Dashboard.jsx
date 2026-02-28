import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './Dashboard/AdminDashboard';
import AccountantDashboard from './Dashboard/AccountantDashboard';
import StudentDashboard from './Dashboard/StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Return role-specific dashboard
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'accountant':
      return <AccountantDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Welcome to College Fee Management System</div>
        </div>
      );
  }
};

export default Dashboard;