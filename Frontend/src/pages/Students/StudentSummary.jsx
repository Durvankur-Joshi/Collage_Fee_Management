import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAPI } from '../../api';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Mail, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const StudentSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, [id]);

  const fetchSummary = async () => {
    try {
      const response = await studentAPI.getSummary(id);
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to fetch student summary');
      navigate('/students');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading summary...</div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No summary available</div>
      </div>
    );
  }

  const hasDue = summary.remaining > 0;

  return (
    <div className="space-y-6">
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

      <h1 className="text-2xl font-bold text-gray-900">
        Student Summary - {summary.student}
      </h1>

      {/* Due Alert */}
      {hasDue && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Due Alert!</span> Student has pending fees of ₹{summary.remaining?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

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
          <p className="text-2xl font-semibold">₹{summary.totalFee?.toLocaleString()}</p>
        </div>

        {/* Total Paid Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Total Paid</p>
          <p className="text-2xl font-semibold">₹{summary.totalPaid?.toLocaleString()}</p>
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
              <TrendingUp className="h-5 w-5 text-green-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">Remaining Fee</p>
          <p className={`text-2xl font-semibold ${hasDue ? 'text-orange-600' : 'text-green-600'}`}>
            ₹{summary.remaining?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Paid: ₹{summary.totalPaid?.toLocaleString()}</span>
            <span>Remaining: ₹{summary.remaining?.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                hasDue ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{
                width: `${(summary.totalPaid / summary.totalFee) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-gray-600">
              {((summary.totalPaid / summary.totalFee) * 100).toFixed(1)}% Complete
            </p>
            {hasDue && (
              <p className="text-orange-600 font-medium">
                Due: ₹{summary.remaining?.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSummary;