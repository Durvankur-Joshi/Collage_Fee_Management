import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { feeAPI } from '../../api';
import { Plus, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FeeStructure = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await feeAPI.getAll();
      setFees(response.data);
    } catch (error) {
      toast.error('Failed to fetch fee structures');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading fee structures...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Fee Structure</h1>
        {user?.role === 'admin' && (
          <Link
            to="/fees/add"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Fee Structure
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fees.map((fee) => {
          const total = fee.tuitionFee + fee.examFee + fee.libraryFee + fee.hostelFee;
          
          return (
            <div key={fee._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-600 px-4 py-3">
                <h3 className="text-white font-semibold">
                  {fee.department} - Year {fee.year}
                </h3>
                <p className="text-blue-100 text-sm">Semester {fee.semester}</p>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tuition Fee:</span>
                  <span className="font-medium">₹{fee.tuitionFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Exam Fee:</span>
                  <span className="font-medium">₹{fee.examFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Library Fee:</span>
                  <span className="font-medium">₹{fee.libraryFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hostel Fee:</span>
                  <span className="font-medium">₹{fee.hostelFee?.toLocaleString()}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-blue-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                
                {user?.role === 'admin' && (
                  <button className="mt-2 w-full btn-secondary flex items-center justify-center gap-2">
                    <Edit size={18} />
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {fees.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No fee structures found
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeStructure;