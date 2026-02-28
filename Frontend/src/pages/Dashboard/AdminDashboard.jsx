import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI, paymentAPI, feeAPI } from '../../api';
import { 
  Users, 
  CreditCard, 
  Receipt, 
  DollarSign,
  TrendingUp,
  UserPlus,
  Settings,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAccountants: 0,
    totalPayments: 0,
    totalFees: 0,
    pendingPayments: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, paymentsRes, feesRes] = await Promise.all([
        studentAPI.getAll(),
        paymentAPI.getAll(),
        feeAPI.getAll(),
      ]);

      const students = studentsRes.data;
      const payments = paymentsRes.data;
      const fees = feesRes.data;

      // Calculate stats
      const totalPayments = payments.reduce((sum, p) => sum + p.amountPaid, 0);
      
      // Mock data - you'd get this from a real endpoint
      const totalAccountants = 3; // This should come from backend

      setStats({
        totalStudents: students.length,
        totalAccountants,
        totalPayments,
        totalFees: fees.length,
        pendingPayments: 500000, // This should be calculated
        recentPayments: payments.slice(0, 5)
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add Student',
      icon: <UserPlus className="h-6 w-6" />,
      link: '/students/add',
      color: 'bg-blue-500',
      description: 'Create new student account'
    },
    {
      title: 'Add Accountant',
      icon: <Users className="h-6 w-6" />,
      link: '/admin/create-user',
      color: 'bg-green-500',
      description: 'Create accountant account'
    },
    {
      title: 'Fee Structure',
      icon: <Receipt className="h-6 w-6" />,
      link: '/fees/add',
      color: 'bg-purple-500',
      description: 'Add new fee structure'
    },
    {
      title: 'Email Settings',
      icon: <Settings className="h-6 w-6" />,
      link: '/settings/email',
      color: 'bg-orange-500',
      description: 'Configure email'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Bell size={16} />
          Admin Access
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalStudents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link to="/students" className="text-sm text-blue-600 hover:text-blue-800 mt-2 block">
            View all students →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accountants</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalAccountants}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Link to="/admin/create-user" className="text-sm text-green-600 hover:text-green-800 mt-2 block">
            Add new →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Collections</p>
              <p className="text-2xl font-semibold mt-1">₹{stats.totalPayments.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <Link to="/payments" className="text-sm text-purple-600 hover:text-purple-800 mt-2 block">
            View payments →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fee Structures</p>
              <p className="text-2xl font-semibold mt-1">{stats.totalFees}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Receipt className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <Link to="/fees" className="text-sm text-orange-600 hover:text-orange-800 mt-2 block">
            Manage fees →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-800 mt-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className={`${action.color} text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-gray-800">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Student</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Mode</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPayments.map((payment) => (
                <tr key={payment._id} className="border-b">
                  <td className="py-2">{payment.student?.rollNumber}</td>
                  <td className="py-2">₹{payment.amountPaid}</td>
                  <td className="py-2 capitalize">{payment.paymentMode}</td>
                  <td className="py-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;