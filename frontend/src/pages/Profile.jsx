import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiShield, FiCalendar, FiLock, FiActivity, FiCheckCircle, FiAlertCircle, FiPackage, FiDollarSign, FiTrendingUp, FiEdit3, FiKey, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, analyticsRes] = await Promise.all([
          axios.get('/api/auth/profile'),
          axios.get('/api/analytics/dashboard').catch(() => ({ data: { stats: {} } }))
        ]);
        setProfileData(profileRes.data);
        setName(profileRes.data.name);
        setStats({
          products: analyticsRes.data?.stats?.totalProducts || 0,
          orders: analyticsRes.data?.stats?.totalUnitsSold || 0,
          revenue: analyticsRes.data?.stats?.totalRevenue || 0,
        });
      } catch (err) {
        console.error('Failed to load profile data', err);
        if (err.response?.status === 404 || err.response?.status === 401) {
          logout();
        }
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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm">Loading profile...</p>
      </div>
    </div>
  );

  const joinDate = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #5b21b6 75%, #7c3aed 100%)'
      }}>
        {/* Animated background dots */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative p-8 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Removed */}

          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">{profileData?.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-200 border border-brand-400/30 backdrop-blur-sm">
                <FiShield className="w-3 h-3" /> Administrator
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-200 border border-green-400/30 backdrop-blur-sm">
                <FiCheckCircle className="w-3 h-3" /> Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm">
                <FiStar className="w-3 h-3" /> Pro Plan
              </span>
            </div>
            <p className="text-white/50 text-sm mt-3">{profileData?.email}</p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 text-center">
            <div className="px-4">
              <p className="text-3xl font-bold text-white">{stats.products}</p>
              <p className="text-xs text-white/50 mt-1 font-medium">Products</p>
            </div>
            <div className="px-4 border-l border-white/10">
              <p className="text-3xl font-bold text-white">{stats.orders}</p>
              <p className="text-xs text-white/50 mt-1 font-medium">Units Sold</p>
            </div>
            <div className="px-4 border-l border-white/10">
              <p className="text-3xl font-bold text-white">${(stats.revenue / 1000).toFixed(1)}k</p>
              <p className="text-xs text-white/50 mt-1 font-medium">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Account Details */}
        <div className="space-y-6">
          {/* Account Information Card */}
          <div className="glass p-6 rounded-2xl border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">Account Details</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-brand-500/10 rounded-xl border border-brand-500/20 group-hover:bg-brand-500/20 transition-colors">
                  <FiMail className="text-brand-400 w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-slate-500 text-xs font-medium block">Email Address</span>
                  <span className="text-white text-sm font-medium truncate block">{profileData?.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <FiCalendar className="text-blue-400 w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-medium block">Member Since</span>
                  <span className="text-white text-sm font-medium">{joinDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-green-500/10 rounded-xl border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                  <FiActivity className="text-green-400 w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-medium block">Account Status</span>
                  <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                    Active
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <FiShield className="text-purple-400 w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-medium block">Role</span>
                  <span className="text-white text-sm font-medium">Full Access Administrator</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="glass p-6 rounded-2xl border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800/80 transition-all text-left group">
                <div className="p-2 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <FiEdit3 className="text-brand-400 w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Edit Profile</p>
                  <p className="text-xs text-slate-500">Update your display name</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800/80 transition-all text-left group">
                <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <FiKey className="text-orange-400 w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Change Password</p>
                  <p className="text-xs text-slate-500">Update your security credentials</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800/80 transition-all text-left group">
                <div className="p-2 bg-sky-500/10 rounded-lg group-hover:bg-sky-500/20 transition-colors">
                  <FiTrendingUp className="text-sky-400 w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">View Analytics</p>
                  <p className="text-xs text-slate-500">Check your store performance</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Security Settings */}
        <div className="lg:col-span-2 glass p-8 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/20">
              <FiLock className="text-brand-400 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Security & Account Settings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage your credentials and personal information</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {message.text && (
              <div
                className={`p-4 rounded-xl text-sm border flex items-center gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {message.type === 'success' ? (
                  <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <FiUser className="w-3.5 h-3.5 text-slate-500" /> Display Name
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800/50 border border-slate-700/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 text-white transition-all placeholder-slate-600"
                required
              />
            </div>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-dark-900 text-slate-500 font-medium uppercase tracking-wider">Password Update</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    <FiLock className="w-3.5 h-3.5 text-slate-500" /> New Password
                  </span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-dark-800/50 border border-slate-700/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 text-white transition-all placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    <FiKey className="w-3.5 h-3.5 text-slate-500" /> Confirm New Password
                  </span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-dark-800/50 border border-slate-700/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 text-white transition-all placeholder-slate-600"
                />
              </div>
            </div>

            <div className="border-t border-slate-700/50 pt-6 flex items-center justify-between">
              <p className="text-xs text-slate-500">Last updated: {joinDate}</p>
              <button
                type="submit"
                disabled={updating}
                className="relative px-8 py-3 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {updating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </span>
                ) : (
                  'Save Profile Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
