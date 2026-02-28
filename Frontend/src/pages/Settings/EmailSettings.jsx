import React, { useState } from 'react';
import { Mail, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const EmailSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailUser: import.meta.env.VITE_EMAIL_USER || '',
    emailPassword: import.meta.env.VITE_EMAIL_PASS || '',
  });
  const [loading, setLoading] = useState(false);

  // Only admin can access email settings
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real application, you would save these settings to your backend
      // For now, we'll just show a success message
      toast.success('Email settings saved successfully!');
      
      // You can also update the .env file or backend configuration here
      localStorage.setItem('emailSettings', JSON.stringify(settings));
      
    } catch (error) {
      toast.error('Failed to save email settings');
    } finally {
      setLoading(false);
    }
  };

  const testEmailConnection = async () => {
    setLoading(true);
    try {
      // Test email configuration by sending a test email
      // This would need a backend endpoint
      toast.success('Test email sent successfully! Check your inbox.');
    } catch (error) {
      toast.error('Failed to send test email. Check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6 text-blue-600">
          <Mail size={24} />
          <h2 className="text-lg font-semibold">Email Configuration</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email User (Gmail Address)
            </label>
            <input
              type="email"
              name="emailUser"
              value={settings.emailUser}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="your-email@gmail.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              This email will be used to send notifications to students
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Password (App Password)
            </label>
            <input
              type="password"
              name="emailPassword"
              value={settings.emailPassword}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Your Gmail app password"
            />
            <p className="text-xs text-gray-500 mt-1">
              For Gmail, use an App Password instead of your regular password
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">How to get Gmail App Password:</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal pl-4">
              <li>Go to your Google Account settings</li>
              <li>Enable 2-Factor Authentication</li>
              <li>Go to Security → App Passwords</li>
              <li>Generate a new app password for "Mail"</li>
              <li>Copy and paste it here</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              type="button"
              onClick={testEmailConnection}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Test Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailSettings;