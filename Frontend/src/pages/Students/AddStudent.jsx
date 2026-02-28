import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../api';
import { User, Mail, Lock, Hash, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    department: '',
    year: '',
    semester: '',
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
      // Use the combined endpoint that creates both user and student
      await studentAPI.createWithUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rollNumber: formData.rollNumber,
        department: formData.department,
        year: parseInt(formData.year),
        semester: parseInt(formData.semester),
      });
      
      toast.success('Student added successfully! They can now login with their email and password.');
      navigate('/students');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Student</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field pl-10"
              placeholder="Enter student's full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field pl-10"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="input-field pl-10"
              placeholder="Enter password (min. 6 characters)"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-4">Academic Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roll Number
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              required
              className="input-field pl-10"
              placeholder="Enter roll number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="input-field pl-10"
              placeholder="Enter department"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="input-field pl-10"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="input-field pl-10"
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <p className="text-sm text-green-700">
            <span className="font-medium">✨ One-step process:</span> This will create both the user account and student profile simultaneously. 
            The student can login using the email and password you set.
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
                Creating Student...
              </>
            ) : (
              'Add Student'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;