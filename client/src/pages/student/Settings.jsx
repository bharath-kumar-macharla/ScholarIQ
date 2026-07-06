import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Loader2, Shield, Bell, User, Save, Key, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Settings() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // profile, security, notifications
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState(user?.notifications || {
    newMatches: true,
    applicationUpdates: true,
    deadlines: true
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/auth/settings', { name });
      // Update local context user state
      if (res.data.user) {
        login(res.data.user); // Re-set user in auth context
      }
      setMessage({ type: 'success', text: 'Profile name updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        currentPassword: passwords.current,
        newPassword: passwords.new
      };
      // If google login and no password set, currentPassword can be empty in backend logic
      const res = await api.put('/auth/settings', payload);
      if (res.data.user) {
        login(res.data.user);
      }
      setPasswords({ current: '', new: '', confirm: '' });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/auth/settings', { notifications });
      if (res.data.user) {
        login(res.data.user);
      }
      setMessage({ type: 'success', text: 'Notification preferences updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update notifications' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Password & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">Account Settings</h1>
        <p className="text-slate-400 text-sm">Manage your profile, login credentials, and notification settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 bg-[#0d1117]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage({ type: '', text: '' });
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left",
                  isActive 
                    ? "bg-[#06d6a0]/10 text-[#06d6a0] border border-[#06d6a0]/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                )}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-[#0d1117]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 md:p-8">
          {/* Status Message */}
          {message.text && (
            <div className={cn(
              "mb-6 p-4 rounded-xl text-sm border flex items-center gap-2",
              message.type === 'success' 
                ? "bg-[#06d6a0]/5 text-[#06d6a0] border-[#06d6a0]/20" 
                : "bg-red-500/5 text-red-400 border-red-500/20"
            )}>
              <AlertCircle size={16} />
              {message.text}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-slate-800/50">
                <h3 className="text-lg font-bold text-white font-heading">Personal Details</h3>
                <p className="text-slate-400 text-xs">Update your basic login name and check verified registration.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#161b22] border border-slate-700/50 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-800/20 border border-slate-800/60 rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">Email addresses cannot be modified to protect registration integrity.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#06d6a0] text-[#06080f] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] hover:bg-[#05b88a] transition-all disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save Changes
              </button>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySubmit} className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-slate-800/50">
                <h3 className="text-lg font-bold text-white font-heading">Update Password</h3>
                <p className="text-slate-400 text-xs">Ensure your account is protected with a secure password configuration.</p>
              </div>

              {user?.googleId && !user?.password && (
                <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl text-purple-400 text-sm flex gap-3">
                  <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="font-semibold text-white">Google Linked Account:</span> You currently log in via Google Auth. Setting a password below allows you to also log in using your email and password credentials.
                  </div>
                </div>
              )}

              <div className="space-y-5 max-w-lg">
                {(!user?.googleId || user?.password) && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-[#161b22] border border-slate-700/50 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] transition-colors placeholder:text-slate-700"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#161b22] border border-slate-700/50 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] transition-colors placeholder:text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#161b22] border border-slate-700/50 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-[#06d6a0] transition-colors placeholder:text-slate-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#06d6a0] text-[#06080f] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] hover:bg-[#05b88a] transition-all disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Key size={16} />}
                Update Password
              </button>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationsSubmit} className="space-y-6">
              <div className="space-y-1 pb-4 border-b border-slate-800/50">
                <h3 className="text-lg font-bold text-white font-heading">Notification Toggles</h3>
                <p className="text-slate-400 text-xs">Configure which notification updates you would like to receive by email.</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'newMatches', label: 'New Scholarship Matches', desc: 'Get notified as soon as a new scholarship matching your eligibility is created.' },
                  { id: 'applicationUpdates', label: 'Application Status Updates', desc: 'Receive instant alerts when a provider reviews, shortlists, or updates your submission.' },
                  { id: 'deadlines', label: 'Imminent Deadlines', desc: 'Receive reminder alerts for your saved scholarships whose deadlines are expiring within 7 days.' }
                ].map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 bg-[#161b22]/30 border border-slate-800/60 rounded-xl hover:bg-[#161b22]/50 transition-colors">
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={notifications[item.id]}
                      onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded text-[#06d6a0] focus:ring-[#06d6a0] bg-[#161b22] border-slate-700"
                    />
                    <label htmlFor={item.id} className="cursor-pointer">
                      <div className="text-sm font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </label>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#06d6a0] text-[#06080f] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] hover:bg-[#05b88a] transition-all disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save Preferences
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
