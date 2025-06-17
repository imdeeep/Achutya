import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  User,
  Shield,
} from "lucide-react";
import { userApi } from '../../../services/adminApi';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    if (!id) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await userApi.getUser(id);
      setEditedUser(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      setSaving(true);
      await userApi.updateUser(editedUser._id, editedUser);
      setIsEditing(false);
      setError(null);
      // Refresh user data after update
      await fetchUser();
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchUser(); // Reset to original data
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error || !editedUser) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {error || 'User not found'}
          </h3>
          <p className="text-gray-500">
            {error ? 'There was an error loading the user data.' : "The user you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editedUser.phone}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, phone: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={editedUser.role}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, role: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {editedUser.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      User ID: {editedUser._id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Contact Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {editedUser.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {editedUser.phone}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Account Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm">
                        <Shield className="h-4 w-4 mr-2 text-gray-400" />
                        Role: {editedUser.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Activity
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Joined:</span>{" "}
                        {new Date(editedUser.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
