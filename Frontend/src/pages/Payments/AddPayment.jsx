import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI, studentAPI } from '../../api';
import { Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AddPayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    amountPaid: '',
    paymentMode: 'cash',
    transactionId: '',
    status: 'completed',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'student') {
      const student = students.find(s => s._id === value);
      setSelectedStudent(student);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await paymentAPI.create(formData);
      
      // Show success message with email notification
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-semibold">Payment added successfully!</p>
            <p className="text-sm text-gray-600">Confirmation email sent to student</p>
          </div>
        </div>,
        { duration: 5000 }
      );
      
      navigate('/payments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Payment</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Student
          </label>
          <select
            name="student"
            value={formData.student}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.rollNumber} - {student.user?.name} ({student.department})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <Mail size={18} />
              <span className="text-sm font-medium">
                Payment confirmation email will be sent to: {selectedStudent.user?.email}
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Paid (₹)
          </label>
          <input
            type="number"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            required
            min="1"
            className="input-field"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Mode
          </label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction ID (Optional)
          </label>
          <input
            type="text"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter transaction ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Note:</span> An email confirmation will be sent to the student's registered email address after adding the payment.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Mail size={18} />
                Add Payment & Send Email
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/payments')}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayment;