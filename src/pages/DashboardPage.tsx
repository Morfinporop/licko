import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { profileApi, ProfileData, LinkData, SocialLink } from '@/lib/api';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { user, isVip, isAdmin, isOwner } = useAuthStore();
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
        toast.error('Ошибка загрузки данных профиля');
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
      toast.success('Ссылка скопирована!');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = publicUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Ссылка скопирована!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Загрузка кабинета...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Просмотры', value: profile?.views ?? 0, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>, color: 'from-green-500/20' },
    { label: 'Ссылки', value: links.length, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>, color: 'from-blue-500/20' },
    { label: 'Соцсети', value: socials.length, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>, color: 'from-purple-500/20' },
    { label: 'Статус', value: profile?.is_published ? 'В эфире' : 'Скрыт', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'from-orange-500/20' },
  ];

  const premiumStyle = (isVip || isAdmin || isOwner) ? 'border-green-500/30 bg-green-500/[0.02] shadow-[0_0_50px_rgba(34,197,94,0.05)]' : '';

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Premium Status Banner */}
        {(isVip || isAdmin || isOwner) && (
          <div className="mb-8 flex justify-center">
            <div className="px-8 py-3 rounded-2xl bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-500/10 border border-green-500/40 backdrop-blur-2xl flex items-center gap-4 animate-fadeIn">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div>
                <span className="text-green-400 font-black tracking-widest text-sm uppercase block">
                  {isOwner ? 'Владелец Системы' : isAdmin ? 'Администратор' : 'VIP Аккаунт'}
                </span>
                <span className="text-green-500/60 text-[10px] uppercase font-bold tracking-tighter">Вам доступны все премиум функции</span>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Личный кабинет</h1>
            <p className="text-gray-500 text-sm mt-1">Управляйте вашим цифровым присутствием</p>
          </div>
          <div className="flex items-center gap-3">
            {isOwner && (
              <Link to="/admin">
                <Button variant="primary" size="md" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/20">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Админ-панель
                </Button>
              </Link>
            )}
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="md">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Открыть Bio
              </Button>
            </a>
            <Link to="/editor">
              <Button variant="primary" size="md" className={(isVip || isAdmin || isOwner) ? 'bg-green-500 hover:bg-green-400 text-black font-bold' : ''}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Редактор
              </Button>
            </Link>
          </div>
        </div>

        {/* Public URL Card */}
        <GlassCard className={`p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${premiumStyle}`}>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Ваша публичная ссылка</p>
              <p className="text-green-400 font-mono text-lg truncate">{publicUrl}</p>
            </div>
          </div>
          <Button variant="secondary" size="md" onClick={copyUrl} className="flex-shrink-0 min-w-[120px]">
            Копировать
          </Button>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s) => (
            <GlassCard key={s.label} className={`p-6 relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${premiumStyle}`} hover>
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} to-transparent opacity-20`} />
              <div className="relative">
                <div className="text-green-400 mb-4">{s.icon}</div>
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Summary */}
          <GlassCard className={`p-8 ${premiumStyle}`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white tracking-tight">Профиль</h2>
              <Link to="/editor">
                <Button variant="ghost" size="sm">Изменить</Button>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative group">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-24 h-24 rounded-3xl object-cover border-2 border-green-500/30 transition-transform duration-500 group-hover:rotate-6"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl bg-green-500 border-4 border-[#050505] flex items-center justify-center text-black">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{profile?.display_name || user?.username}</p>
                <p className="text-green-500/60 font-mono text-sm tracking-tighter">@{user?.username}</p>
                {profile?.bio && <p className="text-gray-400 text-sm mt-3 line-clamp-2 leading-relaxed italic">"{profile.bio}"</p>}
              </div>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className={`p-8 ${premiumStyle}`}>
            <h2 className="text-xl font-bold text-white tracking-tight mb-8">Быстрые действия</h2>
            <div className="space-y-4">
              <Link to="/editor" className="block">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-green-500/30 hover:bg-green-500/[0.04] transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">Редактор Bio</p>
                    <p className="text-gray-500 text-xs mt-0.5 tracking-tight">Обновите ваши ссылки и контент</p>
                  </div>
                </div>
              </Link>
              <Link to="/editor?tab=theme" className="block">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-green-500/30 hover:bg-green-500/[0.04] transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-bold">Настройка стиля</p>
                    <p className="text-gray-500 text-xs mt-0.5 tracking-tight">Цвета, эффекты, анимации и плеер</p>
                  </div>
                </div>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
