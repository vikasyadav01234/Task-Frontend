import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Key, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL, VALIDATION_MESSAGES } from '../utils/constants';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<{
    name?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const validateProfileForm = () => {
    const newErrors: { name?: string } = {};
    
    if (!name) {
      newErrors.name = VALIDATION_MESSAGES.REQUIRED;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = VALIDATION_MESSAGES.REQUIRED;
    }
    
    if (!newPassword) {
      newErrors.newPassword = VALIDATION_MESSAGES.REQUIRED;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.REQUIRED;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MATCH;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.put(`${API_URL}/api/users/profile`, {
        name,
      });
      
      toast.success('Profile updated successfully!');
      
      // We would typically refresh the user context here
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.put(`${API_URL}/api/users/password`, {
        currentPassword,
        newPassword,
      });
      
      toast.success('Password changed successfully!');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Account Information
                </h3>
                
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        readOnly
                        disabled
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Change Password
                </h3>
                
                <form onSubmit={handleChangePassword}>
                  <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.newPassword ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition disabled:opacity-50"
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Actions
            </h3>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;