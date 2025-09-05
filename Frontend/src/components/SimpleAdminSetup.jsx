import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { CheckCircle, AlertCircle, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';

const SimpleAdminSetup = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = () => {
    if (!user) {
      toast.error('User not found');
      return;
    }

    // Check if user has admin role in Clerk metadata
    const publicMetadata = user.publicMetadata || {};
    const role = publicMetadata.role;
    
    if (role === 'admin' || role === 'ADMIN') {
      setIsAdmin(true);
      toast.success('You are an admin!');
    } else {
      setIsAdmin(false);
      toast.error('You are not an admin. Please set role in Clerk dashboard.');
    }
  };

  const showInstructions = () => {
    toast.success('Check the instructions below!', { duration: 3000 });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Setup</h1>
        <p className="text-gray-600">
          Simple admin role setup that works even without the backend server.
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
              {user?.publicMetadata?.role || 'Not set'}
            </span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={checkAdminStatus}
          className="flex flex-col items-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <div className="mb-3">
            <CheckCircle size={32} className="text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Check Admin Status</h3>
          <p className="text-sm text-gray-600 text-center">
            Check if you have admin role in Clerk
          </p>
        </button>

        <button
          onClick={showInstructions}
          className="flex flex-col items-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
        >
          <div className="mb-3">
            <Shield size={32} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Setup Instructions</h3>
          <p className="text-sm text-gray-600 text-center">
            How to set up admin role in Clerk
          </p>
        </button>
      </div>

      {/* Status Display */}
      {isAdmin && (
        <div className="p-6 bg-green-50 rounded-xl mb-8">
          <h3 className="text-lg font-semibold mb-4 text-green-800">✅ Admin Status Confirmed</h3>
          <p className="text-green-700">
            You have admin privileges! You can now access the admin panel at <code>/admin</code>
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="p-6 bg-yellow-50 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-yellow-600" />
          How to Set Up Admin Role
        </h3>
        <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
          <li>
            <strong>Go to Clerk Dashboard:</strong> 
            <br />
            <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://dashboard.clerk.com
            </a>
          </li>
          <li>
            <strong>Navigate to Users:</strong> Click on "Users" in the left sidebar
          </li>
          <li>
            <strong>Find Your User:</strong> Search for your email address or user ID
          </li>
          <li>
            <strong>Edit Public Metadata:</strong> Click on your user, then go to "Public metadata" section
          </li>
          <li>
            <strong>Add Role Field:</strong> 
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Field name: <code>role</code></li>
              <li>Field value: <code>admin</code> (lowercase)</li>
            </ul>
          </li>
          <li>
            <strong>Save Changes:</strong> Click "Save" to update the metadata
          </li>
          <li>
            <strong>Refresh This Page:</strong> Come back here and click "Check Admin Status"
          </li>
          <li>
            <strong>Access Admin Panel:</strong> Once confirmed, you can access <code>/admin</code>
          </li>
        </ol>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Alternative: Direct Database Update</h4>
          <p className="text-blue-700 text-sm">
            If you have access to MongoDB, you can directly update the user profile:
          </p>
          <pre className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800 overflow-x-auto">
{`db.profiles.updateOne(
  { clerkId: "${user?.id || 'your_clerk_id'}" },
  { $set: { role: "ADMIN" } }
)`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminSetup;
