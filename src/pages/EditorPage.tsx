import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProfileTab } from '@/components/editor/ProfileTab';
import { LinksTab } from '@/components/editor/LinksTab';
import { SocialsTab } from '@/components/editor/SocialsTab';
import { ThemeTab } from '@/components/editor/ThemeTabAdvanced';
import { BioPreview } from '@/components/BioPreview';
import { profileApi, ProfileData, LinkData, SocialLink, ThemeSettings } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'links' | 'socials' | 'theme';

export function EditorPage() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = (searchParams.get('tab') as Tab) || 'profile';
  const [activeTab, setActiveTab] = useState<Tab>(tabParam);
  const [showPreview, setShowPreview] = useState(true);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, lRes, sRes, tRes] = await Promise.all([
          profileApi.get(),
          profileApi.getLinks(),
          profileApi.getSocials(),
          profileApi.getTheme()
        ]);
        setProfile(pRes.data.profile);
        setLinks(lRes.data.links);
        setSocials(sRes.data.socials);
        setTheme(tRes.data.theme);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'links',
      label: 'Links',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      id: 'socials',
      label: 'Socials',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!profile || !theme) return null;

  return (
    <div className="min-h-screen bg-[#050505] pt-16">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
          {/* Editor Panel */}
          <div className="flex-1 min-w-0">
            <div className="sticky top-20">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Bio Page Editor</h1>
                <p className="text-gray-500 text-sm">Customize your profile, links and theme</p>
              </div>

              {/* Tabs */}
              <GlassCard className="p-2 mb-6">
                <div className="grid grid-cols-4 gap-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                      {tab.icon}
                      <span className="text-xs sm:text-sm">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Tab Content */}
              <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                {activeTab === 'profile' && <ProfileTab profile={profile} username={user?.username || ''} onUpdate={setProfile} />}
                {activeTab === 'links' && <LinksTab links={links} onUpdate={setLinks} />}
                {activeTab === 'socials' && <SocialsTab socials={socials} onUpdate={setSocials} />}
                {activeTab === 'theme' && <ThemeTab theme={theme} onUpdate={setTheme} />}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:w-[420px] flex-shrink-0">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Live Preview</h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="lg:hidden text-gray-500 hover:text-white"
                >
                  {showPreview ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                  <div className="h-[calc(100vh-180px)] overflow-y-auto">
                    <BioPreview
                      profile={profile}
                      username={user?.username || ''}
                      links={links}
                      socials={socials}
                      theme={theme}
                    />
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
