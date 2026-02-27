import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeAPI } from '../../api';
import toast from 'react-hot-toast';

const AddFeeStructure = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    year: '',
    semester: '',
    tuitionFee: '',
    examFee: '',
    libraryFee: '',
    hostelFee: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await feeAPI.create(formData);
      toast.success('Fee structure added successfully');
      navigate('/fees');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add fee structure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Fee Structure</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter department name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1"
              max="4"
              className="input-field"
              placeholder="Year"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              min="1"
              max="8"
              className="input-field"
              placeholder="Semester"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tuition Fee
            </label>
            <input
              type="number"
              name="tuitionFee"
              value={formData.tuitionFee}
              onChange={handleChange}
              required
              min="0"
              className="input-field"
              placeholder="Amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Fee
            </label>
            <input
              type="number"
              name="examFee"
              value={formData.examFee}
              onChange={handleChange}
              required
              min="0"
              className="input-field"
              placeholder="Amount"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Library Fee
            </label>
            <input
              type="number"
              name="libraryFee"
              value={formData.libraryFee}
              onChange={handleChange}
              required
              min="0"
              className="input-field"
              placeholder="Amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hostel Fee
            </label>
            <input
              type="number"
              name="hostelFee"
              value={formData.hostelFee}
              onChange={handleChange}
              required
              min="0"
              className="input-field"
              placeholder="Amount"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Adding...' : 'Add Fee Structure'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/fees')}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFeeStructure;