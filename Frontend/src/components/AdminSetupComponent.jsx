import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { AdminSetup } from '../utils/adminSetup';
import { CheckCircle, AlertCircle, Loader2, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSetupComponent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleUpdateAllUsers = async () => {
    setLoading(true);
    try {
      const result = await AdminSetup.updateAllUsersRoles();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update user roles');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAdmin = async () => {
    if (!user?.id) {
      toast.error('User ID not found');
      return;
    }

    setLoading(true);
    try {
      const result = await AdminSetup.assignAdminRole(user.id);
      if (result.success) {
        toast.success(result.message);
        setIsAdmin(true);
        setUserProfile(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to assign admin role');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAdmin = async () => {
    if (!user?.id) {
      toast.error('User ID not found');
      return;
    }

    setLoading(true);
    try {
      const result = await AdminSetup.checkAdminRole(user.id);
      if (result.success) {
        setIsAdmin(result.data.role === 'ADMIN' || result.data.role === 'admin');
        setUserProfile(result.data);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to check admin role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Setup Utility</h1>
        <p className="text-gray-600">
          Use this utility to set up admin roles and manage user permissions.
        </p>
      </div>

      {/* Current User Info */}
      <div className="mb-8 p-6 bg-gray-50 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User size={24} className="text-blue-600" />
          Current User Information
        </h2>
        <div className="space-y-2">
          <p><strong>User ID:</strong> {user?.id || 'Not available'}</p>
          <p><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || 'Not available'}</p>
          <p><strong>Name:</strong> {user?.fullName || 'Not available'}</p>
          <p><strong>Role:</strong> 
            <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
              isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {userProfile?.role || 'Unknown'}
            </span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={handleUpdateAllUsers}
          disabled={loading}
          className="flex flex-col items-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50"
        >
          <div className="mb-3">
            {loading ? (
              <Loader2 size={32} className="text-blue-600 animate-spin" />
            ) : (
              <User size={32} className="text-blue-600" />
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Update All Users</h3>
          <p className="text-sm text-gray-600 text-center">
            Add role field to all existing users
          </p>
        </button>

        <button
          onClick={handleAssignAdmin}
          disabled={loading}
          className="flex flex-col items-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors disabled:opacity-50"
        >
          <div className="mb-3">
            {loading ? (
              <Loader2 size={32} className="text-green-600 animate-spin" />
            ) : (
              <Shield size={32} className="text-green-600" />
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Make Me Admin</h3>
          <p className="text-sm text-gray-600 text-center">
            Assign admin role to current user
          </p>
        </button>

        <button
          onClick={handleCheckAdmin}
          disabled={loading}
          className="flex flex-col items-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors disabled:opacity-50"
        >
          <div className="mb-3">
            {loading ? (
              <Loader2 size={32} className="text-purple-600 animate-spin" />
            ) : (
              <CheckCircle size={32} className="text-purple-600" />
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Check Admin Status</h3>
          <p className="text-sm text-gray-600 text-center">
            Verify current user's admin status
          </p>
        </button>
      </div>

      {/* Status Display */}
      {userProfile && (
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">User Profile Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Clerk ID:</strong> {userProfile.clerkId}</p>
              <p><strong>First Name:</strong> {userProfile.firstName}</p>
              <p><strong>Last Name:</strong> {userProfile.lastName}</p>
            </div>
            <div>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Credits:</strong> {userProfile.credits}</p>
              <p><strong>Role:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                  userProfile.role === 'ADMIN' || userProfile.role === 'admin' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {userProfile.role}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-6 bg-yellow-50 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-yellow-600" />
          Instructions
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>First, click "Update All Users" to add role fields to existing users</li>
          <li>Then, click "Make Me Admin" to assign admin role to your account</li>
          <li>Use "Check Admin Status" to verify your admin role</li>
          <li>After setup, you can access the admin panel at <code>/admin</code></li>
        </ol>
      </div>
    </div>
  );
};

export default AdminSetupComponent;
