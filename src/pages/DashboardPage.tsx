import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { profileApi, ProfileData, LinkData, SocialLink } from '@/lib/api';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, lRes, sRes] = await Promise.all([
          profileApi.get(),
          profileApi.getLinks(),
          profileApi.getSocials()
        ]);
        setProfile(pRes.data.profile);
        setLinks(lRes.data.links);
        setSocials(sRes.data.socials);
      } catch {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const publicUrl = `${window.location.origin}/u/${user?.username}`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = publicUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to copy link');
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Page Views', value: profile?.views ?? 0, icon: '👁️', color: 'from-green-500/20 to-green-500/5' },
    { label: 'Links', value: links.length, icon: '🔗', color: 'from-blue-500/20 to-blue-500/5' },
    { label: 'Socials', value: socials.length, icon: '📱', color: 'from-purple-500/20 to-purple-500/5' },
    { label: 'Status', value: profile?.is_published ? 'Live' : 'Hidden', icon: '✅', color: 'from-green-500/20 to-green-500/5' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your bio page and links</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Page
              </Button>
            </a>
            <Link to="/editor">
              <Button variant="primary" size="sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Public URL */}
        <GlassCard className="p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Your public bio page URL</p>
              <p className="text-green-400 font-mono text-sm truncate">{publicUrl}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={copyUrl} className="flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </Button>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <GlassCard key={s.label} className="p-5 relative overflow-hidden" hover>
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-50`} />
              <div className="relative">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Summary */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Profile</h2>
              <Link to="/editor">
                <Button variant="ghost" size="sm">Edit</Button>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-green-500/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#050505]" />
              </div>
              <div>
                <p className="text-white font-medium">{profile?.display_name || user?.username}</p>
                <p className="text-gray-500 text-sm">@{user?.username}</p>
                {profile?.bio && <p className="text-gray-400 text-xs mt-1 line-clamp-2">{profile.bio}</p>}
              </div>
            </div>
          </GlassCard>

          {/* Links Summary */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Links ({links.length})</h2>
              <Link to="/editor">
                <Button variant="ghost" size="sm">Manage</Button>
              </Link>
            </div>
            {links.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 text-sm mb-3">No links yet</p>
                <Link to="/editor">
                  <Button variant="secondary" size="sm">Add your first link</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {links.slice(0, 4).map((link) => (
                  <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                      {link.icon || '🔗'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{link.title}</p>
                      <p className="text-gray-600 text-xs truncate">{link.url}</p>
                    </div>
                    <div className="text-xs text-gray-600">{link.click_count} clicks</div>
                  </div>
                ))}
                {links.length > 4 && (
                  <p className="text-gray-600 text-xs text-center pt-1">+{links.length - 4} more</p>
                )}
              </div>
            )}
          </GlassCard>

          {/* Social Links */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Social Links ({socials.length})</h2>
              <Link to="/editor">
                <Button variant="ghost" size="sm">Manage</Button>
              </Link>
            </div>
            {socials.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 text-sm">No social links yet</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <div key={s.id} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-sm text-gray-400 flex items-center gap-2">
                    <span>{s.platform}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/editor" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-green-500/20 hover:bg-green-500/5 transition-all duration-200">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Edit Bio Page</p>
                    <p className="text-gray-600 text-xs">Update your profile and links</p>
                  </div>
                </div>
              </Link>
              <Link to="/editor?tab=theme" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-green-500/20 hover:bg-green-500/5 transition-all duration-200">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Customize Theme</p>
                    <p className="text-gray-600 text-xs">Change colors, effects and layout</p>
                  </div>
                </div>
              </Link>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-green-500/20 hover:bg-green-500/5 transition-all duration-200">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">View Public Page</p>
                    <p className="text-gray-600 text-xs">See how others see your page</p>
                  </div>
                </div>
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
