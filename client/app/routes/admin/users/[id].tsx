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
  password?: string;
}

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalUser, setOriginalUser] = useState<UserData | null>(null);
  const [editedUser, setEditedUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id === 'newUser') {
      // Initialize empty user for new user form
      const newUser: UserData = {
        _id: '',
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        password: ''
      };
      setOriginalUser(newUser);
      setEditedUser(newUser);
      setIsEditing(true);
      setLoading(false);
    } else {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getUser(id);
      console.log('Fetched user data:', response); // Debug log
      setOriginalUser(response.data);
      setEditedUser(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch user data';
      setError(errorMessage);
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      setSaving(true);
      setError(null);
      
      if (id === 'newUser') {
        // Create new user
        const { _id, ...userData } = editedUser;
        console.log('Creating user with data:', userData); // Debug log
        await userApi.createUser(userData);
        navigate('/admin/users');
      } else {
        // Update existing user
        console.log('Updating user with data:', editedUser); // Debug log
        await userApi.updateUser(editedUser._id, editedUser);
        setOriginalUser(editedUser);
        setIsEditing(false);
        await fetchUser();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred while saving the user';
      setError(errorMessage);
      console.error('Error saving user:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(originalUser);
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [field]: value });
    }
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

  if (error && !editedUser) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            {error}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            There was an error loading the user data.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/admin/users")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!editedUser) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {id === 'newUser' ? 'Create New User' : 'User Details'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {isEditing ? 'Edit user information' : 'View and manage user information'}
              </p>
            </div>
            {!isEditing && id !== 'newUser' && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      required
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={editedUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      required
                      disabled={saving}
                    />
                  </div>
                </div>

                {id === 'newUser' && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={editedUser.password || ''}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                        required
                        disabled={saving}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={editedUser.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      value={editedUser.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      disabled={saving}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>


              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {id === 'newUser' ? 'Creating...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {id === 'newUser' ? 'Create User' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start mb-8">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {editedUser.name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    User ID: {editedUser._id}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      editedUser.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {editedUser.role ? editedUser.role.charAt(0).toUpperCase() + editedUser.role.slice(1) : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-emerald-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm text-gray-900 mt-1">{editedUser.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm text-gray-900 mt-1">{editedUser.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                      Account Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Role</label>
                        <p className="text-sm text-gray-900 mt-1 capitalize">{editedUser.role}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Member Since</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(editedUser.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
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