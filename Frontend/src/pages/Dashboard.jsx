import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI, paymentAPI, feeAPI } from '../api';
import { 
  Users, 
  CreditCard, 
  Receipt, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPayments: 0,
    totalFees: 0,
    pendingPayments: 0,
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [feeDistribution, setFeeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
      const pendingPayments = students.length * 50000 - totalPayments; // Example calculation

      setStats({
        totalStudents: students.length,
        totalPayments,
        totalFees: fees.length,
        pendingPayments: pendingPayments > 0 ? pendingPayments : 0,
      });

      // Set recent payments
      setRecentPayments(payments.slice(0, 5));

      // Set fee distribution
      const distribution = fees.map(fee => ({
        name: `${fee.department} - Year ${fee.year}`,
        total: fee.tuitionFee + fee.examFee + fee.libraryFee + fee.hostelFee,
      }));
      setFeeDistribution(distribution);

    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: <Users className="h-8 w-8 text-blue-500" />,
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Payments',
      value: `₹${stats.totalPayments.toLocaleString()}`,
      icon: <CreditCard className="h-8 w-8 text-green-500" />,
      bgColor: 'bg-green-100',
    },
    {
      title: 'Fee Structures',
      value: stats.totalFees,
      icon: <Receipt className="h-8 w-8 text-purple-500" />,
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Pending Payments',
      value: `₹${stats.pendingPayments.toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8 text-orange-500" />,
      bgColor: 'bg-orange-100',
    },
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
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Fee Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Paid', value: stats.totalPayments },
                  { name: 'Pending', value: stats.pendingPayments },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.totalPayments > 0 && (
                  <>
                    <Cell fill="#4CAF50" />
                    <Cell fill="#FF9800" />
                  </>
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.student?.rollNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{payment.amountPaid?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {payment.paymentMode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.transactionId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentPayments.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No recent payments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;