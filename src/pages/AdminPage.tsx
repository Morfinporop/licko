import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function AdminPage() {
  const { isAdmin } = useAuthStore();
  const [tab, setTab] = useState<'users' | 'stats' | 'logs' | 'vip'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [vipEmail, setVipEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'stats') loadStats();
    if (tab === 'users') loadUsers();
    if (tab === 'logs') loadLogs();
  }, [tab]);

  const loadStats = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data);
    } catch {
      toast.error('Failed to load stats');
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(1, 50, search);
      setUsers(res.data.users);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getLogs();
      setLogs(res.data.logs);
    } catch {
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId: string, username: string) => {
    const reason = prompt(`Ban reason for ${username}:`);
    if (!reason) return;

    try {
      await adminApi.banUser(userId, reason);
      toast.success('User banned');
      loadUsers();
    } catch {
      toast.error('Failed to ban user');
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await adminApi.unbanUser(userId);
      toast.success('User unbanned');
      loadUsers();
    } catch {
      toast.error('Failed to unban user');
    }
  };

  const handleVipToggle = async (userId: string, currentStatus: number) => {
    try {
      await adminApi.grantVip(userId, !currentStatus);
      toast.success(currentStatus ? 'VIP revoked' : 'VIP granted');
      loadUsers();
    } catch {
      toast.error('Failed to update VIP');
    }
  };

  const handleGrantVipByEmail = async () => {
    if (!vipEmail) {
      toast.error('Enter email address');
      return;
    }

    try {
      const res = await adminApi.grantVipByEmail(vipEmail);
      toast.success(res.data.message);
      setVipEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to grant VIP');
    }
  };



  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Admin Panel
          </h1>
          <p className="text-gray-500">Manage users, monitor activity, grant VIP status</p>
        </div>

        {/* Tabs */}
        <GlassCard className="p-2 mb-6">
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'stats', label: 'Statistics', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
              { id: 'users', label: 'Users', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
              { id: 'vip', label: 'Grant VIP', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> },
              { id: 'logs', label: 'Activity Logs', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-green-500 text-black' : 'text-gray-500 hover:text-white'}`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Statistics Tab */}
        {tab === 'stats' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-blue-500/20' },
                { label: 'VIP Users', value: stats.totalVips, icon: '⭐', color: 'from-yellow-500/20' },
                { label: 'Banned', value: stats.totalBanned, icon: '🚫', color: 'from-red-500/20' },
                { label: 'Published', value: stats.totalProfiles, icon: '📄', color: 'from-green-500/20' },
                { label: 'Total Links', value: stats.totalLinks, icon: '🔗', color: 'from-purple-500/20' },
                { label: 'Total Views', value: stats.totalViews, icon: '👁️', color: 'from-pink-500/20' }
              ].map(stat => (
                <GlassCard key={stat.label} className={`p-5 relative overflow-hidden bg-gradient-to-br ${stat.color} to-transparent`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </GlassCard>
              ))}
            </div>

            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-4">Recent Users</h3>
              <div className="space-y-2">
                {stats.recentUsers?.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3">
                    <div>
                      <p className="text-white text-sm font-medium">@{user.username}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                    <p className="text-gray-600 text-xs">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="space-y-4">
            <GlassCard className="p-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Search by email or username..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button variant="primary" onClick={loadUsers}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </Button>
              </div>
            </GlassCard>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <GlassCard className="p-6">
                <div className="space-y-3">
                  {users.map(user => (
                    <div key={user.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-medium">@{user.username}</p>
                            {user.role === 'owner' && <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">OWNER</span>}
                            {user.role === 'admin' && <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">ADMIN</span>}
                            {user.vip_status === 1 && <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">VIP</span>}
                            {user.is_banned === 1 && <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">BANNED</span>}
                          </div>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                            <span>Views: {user.views || 0}</span>
                            <span>Links: {user.link_count || 0}</span>
                            <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                          </div>
                          {user.is_banned === 1 && user.ban_reason && (
                            <p className="text-red-400 text-xs mt-2">Ban reason: {user.ban_reason}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="secondary" onClick={() => window.open(`/u/${user.username}`, '_blank')}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Button>
                          
                          {user.role !== 'owner' && (
                            <>
                              {user.is_banned ? (
                                <Button size="sm" variant="secondary" onClick={() => handleUnban(user.id)}>
                                  Unban
                                </Button>
                              ) : (
                                <Button size="sm" variant="danger" onClick={() => handleBan(user.id, user.username)}>
                                  Ban
                                </Button>
                              )}

                              <Button size="sm" variant={user.vip_status ? 'ghost' : 'primary'} onClick={() => handleVipToggle(user.id, user.vip_status)}>
                                {user.vip_status ? 'Revoke VIP' : 'Grant VIP'}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        )}

        {/* Grant VIP Tab */}
        {tab === 'vip' && (
          <GlassCard className="p-6 max-w-2xl mx-auto">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Grant VIP by Email
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Enter an email address to grant VIP status to that user.
            </p>
            <div className="space-y-4">
              <Input
                label="User Email"
                type="email"
                value={vipEmail}
                onChange={e => setVipEmail(e.target.value)}
                placeholder="user@example.com"
              />
              <Button variant="primary" onClick={handleGrantVipByEmail} className="w-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Grant VIP Status
              </Button>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                VIP Benefits
              </h4>
              <ul className="text-green-400/80 text-sm space-y-1">
                <li>• No watermark on bio page</li>
                <li>• Advanced animation effects</li>
                <li>• Particle effects</li>
                <li>• Custom CSS without limits</li>
                <li>• Priority support</li>
              </ul>
            </div>
          </GlassCard>
        )}

        {/* Logs Tab */}
        {tab === 'logs' && (
          <GlassCard className="p-6">
            <h3 className="text-white font-semibold mb-4">Admin Activity Logs</h3>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map(log => (
                  <div key={log.id} className="p-3 rounded-lg bg-white/3 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{log.action.replace(/_/g, ' ')}</span>
                      <span className="text-gray-600 text-xs">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Admin: @{log.admin_username} 
                      {log.target_username && ` → Target: @${log.target_username}`}
                      {log.details && ` (${log.details})`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
}
