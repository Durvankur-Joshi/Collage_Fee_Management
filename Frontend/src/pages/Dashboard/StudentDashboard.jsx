import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentAPI, paymentAPI } from '../../api';
import {
  GraduationCap,
  CreditCard,
  DollarSign,
  BookOpen,
  Calendar,
  TrendingUp,
  Bell,
  Clock,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchStudentData();
  }, [retryCount]); // Retry if user clicks retry

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching student profile for user:", user?._id);

      // First get the student profile for current user
      const profileResponse = await studentAPI.getCurrentStudent();
      console.log("Profile response:", profileResponse.data);

      const profile = profileResponse.data;
      setStudentProfile(profile);

      // Then get their fee summary
      try {
        const summaryResponse = await studentAPI.getSummary(profile._id);
        console.log("Summary response:", summaryResponse.data);
        setSummary(summaryResponse.data);
      } catch (summaryError) {
        console.error("Error fetching summary:", summaryError);
        if (summaryError.response?.status === 403) {
          setError("You don't have permission to view fee summary. Please contact administrator.");
        } else if (summaryError.response?.status === 404) {
          setError("Fee structure not found for your department/year. Please contact administrator.");
        } else {
          setError("Could not load fee summary. Please try again.");
        }
        return; // Stop further execution
      }

      // Get their payment history
      try {
        const paymentsResponse = await paymentAPI.getAll();
        const studentPayments = paymentsResponse.data
          .filter(p => p.student?._id === profile._id)
          .slice(0, 5);
        setRecentPayments(studentPayments);
      } catch (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        // Don't set error for payments, just show empty
        setRecentPayments([]);
      }

    } catch (error) {
      console.error('Error fetching student data:', error);

      if (error.response?.status === 403) {
        setError('You do not have permission to access this data. Please contact administrator.');
      } else if (error.response?.status === 404) {
        setError('Student profile not found. Please contact administrator to set up your profile.');
      } else {
        setError('Could not load your data. Please try again or contact administrator.');
      }

      toast.error('Failed to load your dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-500">Loading your dashboard...</div>
      </div>
    );
  }

  if (error || !studentProfile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 p-8 rounded-lg">
          <Bell className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error || "Your student profile hasn't been set up yet."}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Retry
            </button>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 px-4 py-2"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasDue = summary?.remaining > 0;
  const paidPercentage = summary ? (summary.totalPaid / summary.totalFee) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header with Student Info */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, {studentProfile.user?.name}!</h1>
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              <span className="flex items-center gap-1">
                <GraduationCap size={16} />
                {studentProfile.rollNumber}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={16} />
                {studentProfile.department}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Year {studentProfile.year} | Sem {studentProfile.semester}
              </span>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-lg">
            <p className="text-sm">Student ID</p>
            <p className="font-mono">{studentProfile._id.slice(-8)}</p>
          </div>
        </div>
      </div>

      {/* Rest of your dashboard JSX remains the same... */}
      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Total Fee</p>
          <p className="text-2xl font-bold">₹{summary?.totalFee?.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Paid Amount</p>
          <p className="text-2xl font-bold text-green-600">₹{summary?.totalPaid?.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className={`${hasDue ? 'bg-orange-100' : 'bg-green-100'} p-2 rounded-full`}>
              <Clock className={`h-5 w-5 ${hasDue ? 'text-orange-600' : 'text-green-600'}`} />
            </div>
            {hasDue ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">Remaining</p>
          <p className={`text-2xl font-bold ${hasDue ? 'text-orange-600' : 'text-green-600'}`}>
            ₹{summary?.remaining?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Payment Progress</h2>
          <span className="text-sm text-gray-600">{paidPercentage.toFixed(1)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${hasDue ? 'bg-orange-500' : 'bg-green-500'
              }`}
            style={{ width: `${paidPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>Paid: ₹{summary?.totalPaid?.toLocaleString()}</span>
          <span>Remaining: ₹{summary?.remaining?.toLocaleString()}</span>
        </div>
      </div>

      {/* Due Alert */}
      {hasDue && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-orange-800">Pending Dues</p>
              <p className="text-orange-600">You have pending fees of ₹{summary?.remaining?.toLocaleString()}</p>
            </div>
            <Link
              to={`/students/${studentProfile._id}/summary`}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              View Details
            </Link>
          </div>
        </div>
      )}

      {/* Recent Payment History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Payment History</h2>
        {recentPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Mode</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Transaction ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment._id} className="border-b">
                    <td className="px-4 py-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 font-medium">₹{payment.amountPaid}</td>
                    <td className="px-4 py-2 capitalize">{payment.paymentMode}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{payment.transactionId || '—'}</td>
                    <td className="px-4 py-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No payment history yet</p>
          </div>
        )}
        <Link
          to={`/students/${studentProfile._id}/summary`}
          className="text-blue-600 text-sm mt-4 inline-block"
        >
          View Full Payment History →
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;