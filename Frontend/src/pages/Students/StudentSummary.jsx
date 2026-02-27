import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentAPI } from '../../api';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/students')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        Back to Students
      </button>

      <h1 className="text-2xl font-bold text-gray-900">
        Student Summary - {summary.student}
      </h1>

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
            <div className="bg-orange-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-sm text-gray-600">Remaining Fee</p>
          <p className="text-2xl font-semibold">₹{summary.remaining?.toLocaleString()}</p>
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
              className="bg-blue-600 h-4 rounded-full"
              style={{
                width: `${(summary.totalPaid / summary.totalFee) * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-600">
            {((summary.totalPaid / summary.totalFee) * 100).toFixed(1)}% Complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSummary;