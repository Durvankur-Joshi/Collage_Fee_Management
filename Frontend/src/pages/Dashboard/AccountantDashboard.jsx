import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI, paymentAPI } from '../../api';
import { 
  CreditCard, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const AccountantDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayPayments: 0,
    totalCollections: 0,
    pendingPayments: 0,
    recentPayments: [],
    studentsWithDues: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, paymentsRes] = await Promise.all([
        studentAPI.getAll(),
        paymentAPI.getAll(),
      ]);

      const students = studentsRes.data;
      const payments = paymentsRes.data;

      // Today's date
      const today = new Date().toDateString();
      
      // Calculate stats
      const totalPayments = payments.reduce((sum, p) => sum + p.amountPaid, 0);
      const todayPayments = payments
        .filter(p => new Date(p.createdAt).toDateString() === today)
        .reduce((sum, p) => sum + p.amountPaid, 0);

      setStats({
        totalStudents: students.length,
        todayPayments: todayPayments,
        totalCollections: totalPayments,
        pendingPayments: 250000, // This should be calculated
        recentPayments: payments.slice(0, 5),
        studentsWithDues: students.slice(0, 3) // Mock data
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Accountant Dashboard</h1>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          Accountant Access
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
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Collection</p>
              <p className="text-2xl font-semibold mt-1">₹{stats.todayPayments.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Collections</p>
              <p className="text-2xl font-semibold mt-1">₹{stats.totalCollections.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Dues</p>
              <p className="text-2xl font-semibold mt-1">₹{stats.pendingPayments.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/payments/add"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <CreditCard className="h-8 w-8 mb-2" />
          <h3 className="text-xl font-semibold">Add New Payment</h3>
          <p className="text-green-100">Record a payment from student</p>
        </Link>

        <Link
          to="/payments"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <CheckCircle className="h-8 w-8 mb-2" />
          <h3 className="text-xl font-semibold">View All Payments</h3>
          <p className="text-blue-100">Check payment history</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {stats.recentPayments.map((payment) => (
              <div key={payment._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{payment.student?.rollNumber}</p>
                  <p className="text-sm text-gray-600 capitalize">{payment.paymentMode}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{payment.amountPaid}</p>
                  <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/payments" className="text-blue-600 text-sm mt-4 block">
            View all →
          </Link>
        </div>

        {/* Students with Dues */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Students with Dues</h2>
          <div className="space-y-3">
            {stats.studentsWithDues.map((student) => (
              <div key={student._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{student.rollNumber}</p>
                  <p className="text-sm text-gray-600">{student.user?.name}</p>
                </div>
                <Link
                  to={`/students/${student._id}/summary`}
                  className="text-red-600 text-sm font-medium"
                >
                  View Dues
                </Link>
              </div>
            ))}
          </div>
          <Link to="/students" className="text-blue-600 text-sm mt-4 block">
            View all students →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;