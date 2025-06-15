import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { userApi } from "../../services/adminApi";
import {
  Mail,
  Phone,
  User,
  Calendar,
  Shield,
} from "lucide-react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

export default function UserProfile() {
  const { slug } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!slug) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await userApi.getUser(slug);
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {error || 'Profile not found'}
            </h3>
            <p className="text-gray-500">
              {error ? 'There was an error loading the profile.' : "The profile you're looking for doesn't exist."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center mb-8">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500" />
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {user.phone}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Shield className="h-4 w-4 mr-2 text-gray-400" />
                      Role: {user.role}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Member Status
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 