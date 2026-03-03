import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAPI } from '../../api';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Bell,
  Calendar,
  BookOpen,
  Hash,
  CreditCard,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const StudentSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, [id]);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching summary for student ID:", id);
      const response = await studentAPI.getSummary(id);
      console.log("Summary response:", response.data);
      
      if (response.data.success) {
        setSummary(response.data);
      } else {
        setError(response.data.message || "Failed to load summary");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setError(error.response?.data?.message || "Failed to fetch student summary");
      
      if (error.response?.status === 404) {
        toast.error("Student or fee structure not found");
      } else {
        toast.error("Failed to load summary");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async () => {
    if (!confirm('Send fee reminder email to this student?')) {
      return;
    }

    setSendingReminder(true);
    try {
      const response = await studentAPI.sendFeeReminder(id);
      toast.success(response.data.message || 'Reminder sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reminder');
    } finally {
      setSendingReminder(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-600 mb-4" />
        <div className="text-gray-500">Loading student summary...</div>
      </div>
    );
  }

  if (error || !summary?.success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 p-8 rounded-lg">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Summary</h2>
          <p className="text-gray-600 mb-4">{error || "Could not load student summary"}</p>
          <div className="space-x-4">
            <button
              onClick={fetchSummary}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/students')}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Back to Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { student, feeDetails, paymentSummary, recentPayments } = summary;
  const hasDue = paymentSummary.hasDue;
  const paidPercentage = (paymentSummary.totalPaid / feeDetails.totalFee) * 100 || 0;

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Reminder */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Students
        </button>

        {/* Send Reminder Button - Only for Admin */}
        {user?.role === 'admin' && hasDue && (
          <button
            onClick={handleSendReminder}
            disabled={sendingReminder}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {sendingReminder ? (
              <>
                <Loader className="animate-spin" size={18} />
                Sending...
              </>
            ) : (
              <>
                <Mail size={18} />
                Send Fee Reminder
              </>
            )}
          </button>
        )}
      </div>

      {/* Student Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Student Summary</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-blue-200 text-sm">Roll Number</p>
            <p className="font-semibold flex items-center gap-1">
              <Hash size={16} />
              {student.rollNumber}
            </p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Name</p>
            <p className="font-semibold">{student.name}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Department</p>
            <p className="font-semibold flex items-center gap-1">
              <BookOpen size={16} />
              {student.department}
            </p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Year/Semester</p>
            <p className="font-semibold flex items-center gap-1">
              <Calendar size={16} />
              Year {student.year} | Sem {student.semester}
            </p>
          </div>
        </div>
      </div>

      {/* Due Alert */}
      {hasDue && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Due Alert!</span> Student has pending fees of {formatCurrency(paymentSummary.remaining)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Fee Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Total Fee</p>
          <p className="text-2xl font-bold">{formatCurrency(feeDetails.totalFee)}</p>
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Tuition: {formatCurrency(feeDetails.tuitionFee)}</span>
              <span>Exam: {formatCurrency(feeDetails.examFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Library: {formatCurrency(feeDetails.libraryFee)}</span>
              <span>Hostel: {formatCurrency(feeDetails.hostelFee)}</span>
            </div>
          </div>
        </div>

        {/* Total Paid Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(paymentSummary.totalPaid)}</p>
          <p className="mt-2 text-xs text-gray-500">
            {paymentSummary.paymentCount} payment{paymentSummary.paymentCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Remaining Fee Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${hasDue ? 'bg-orange-100' : 'bg-green-100'}`}>
              <DollarSign className={`h-6 w-6 ${hasDue ? 'text-orange-600' : 'text-green-600'}`} />
            </div>
            {hasDue ? (
              <TrendingDown className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">Remaining Fee</p>
          <p className={`text-2xl font-bold ${hasDue ? 'text-orange-600' : 'text-green-600'}`}>
            {formatCurrency(paymentSummary.remaining)}
          </p>
          {!hasDue && (
            <p className="mt-2 text-xs text-green-600">Fully Paid ✓</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Paid: {formatCurrency(paymentSummary.totalPaid)}</span>
            <span>Remaining: {formatCurrency(paymentSummary.remaining)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                hasDue ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${paidPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-gray-600">
              {paidPercentage.toFixed(1)}% Complete
            </p>
            {hasDue && (
              <p className="text-orange-600 font-medium">
                Due: {formatCurrency(paymentSummary.remaining)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Payment History</h2>
        {recentPayments && recentPayments.length > 0 ? (
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
                  <tr key={payment.id} className="border-b">
                    <td className="px-4 py-2">{formatDate(payment.date)}</td>
                    <td className="px-4 py-2 font-medium">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-2 capitalize">{payment.mode}</td>
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
      </div>
    </div>
  );
};

export default StudentSummary;