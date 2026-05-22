import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiShield, FiCalendar, FiLock, FiActivity, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/profile');
        setProfileData(res.data);
        setName(res.data.name);
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (password && password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }

    setUpdating(true);
    try {
      const res = await axios.put('/api/auth/profile', {
        name,
        ...(password ? { password } : {}),
      });

      setProfileData({ ...profileData, name: res.data.user.name });
      setUser({ ...user, name: res.data.user.name });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Failed to update profile', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading profile...</div>;

  const joinDate = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="text-slate-400 mt-1">Manage your administrative credentials and security options.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-brand-600 to-purple-500 flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-brand-500/20">
            {profileData?.name?.charAt(0).toUpperCase() || 'A'}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-dark-900 rounded-full" title="Active Account"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profileData?.name}</h2>
            <p className="text-slate-400 text-sm flex items-center justify-center gap-1.5 mt-1">
              <FiShield className="text-brand-400" /> Administrator
            </p>
          </div>

          <div className="w-full border-t border-slate-700/50 pt-4 mt-2 space-y-3 text-left text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <FiMail className="text-slate-400 w-4 h-4" />
              <div className="truncate">
                <span className="text-slate-500 block text-xs">Email Address</span>
                <span className="font-medium text-white">{profileData?.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiCalendar className="text-slate-400 w-4 h-4" />
              <div>
                <span className="text-slate-500 block text-xs">Member Since</span>
                <span className="font-medium text-white">{joinDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiActivity className="text-slate-400 w-4 h-4" />
              <div>
                <span className="text-slate-500 block text-xs">Status</span>
                <span className="font-medium text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
            <FiLock className="text-brand-400" /> Security & Account Settings
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {message.text && (
              <div
                className={`p-3 rounded-lg text-sm text-center border ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-white transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-dark-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-dark-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-white transition-all"
                />
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-4 mt-6 flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-brand-500/30 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
