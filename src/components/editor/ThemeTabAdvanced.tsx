import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { profileApi, ThemeSettings } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface ThemeTabProps {
  theme: ThemeSettings;
  onUpdate: (theme: ThemeSettings) => void;
}

const GRADIENTS = [
  { name: 'Dark Green', value: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a0d 50%, #0a0a0a 100%)' },
  { name: 'Deep Black', value: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)' },
  { name: 'Emerald', value: 'linear-gradient(135deg, #064e3b 0%, #022c22 50%, #000000 100%)' },
  { name: 'Matrix', value: 'linear-gradient(135deg, #001a00 0%, #003300 50%, #000000 100%)' },
  { name: 'Midnight', value: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%)' }
];

export function ThemeTab({ theme, onUpdate }: ThemeTabProps) {
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [localTheme, setLocalTheme] = useState(theme);
  const [saving, setSaving] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [uploadingCardBg, setUploadingCardBg] = useState(false);
  const [playlist, setPlaylist] = useState<any[]>([]);
  
  const { isVip, isAdmin, isOwner } = useAuthStore();
  const hasPremium = isVip || isAdmin || isOwner;

  useEffect(() => {
    const debounce = setTimeout(() => {
      onUpdate(localTheme);
    }, 100);
    return () => clearTimeout(debounce);
  }, [localTheme, onUpdate]);

  useEffect(() => {
    loadPlaylist();
  }, []);

  const loadPlaylist = async () => {
    try {
      const res = await profileApi.getPlaylist();
      setPlaylist(res.data.playlist || []);
    } catch {}
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileApi.updateTheme(localTheme);
      onUpdate(res.data.theme);
      toast.success('Настройки сохранены!');
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalTheme(theme);
    toast.success('Настройки сброшены');
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMusic(true);
    try {
      const res = await profileApi.uploadMusic(file);
      setPlaylist(prev => [...prev, res.data.track]);
      setLocalTheme(prev => ({ ...prev, music_url: res.data.track.file_url }));
      toast.success('Трек добавлен в плейлист!');
    } catch {
      toast.error('Ошибка загрузки музыки');
    } finally {
      setUploadingMusic(false);
    }
  };

  const handleCardBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCardBg(true);
    try {
      const res = await profileApi.uploadCustomBg(file);
      setLocalTheme((prev) => ({ ...prev, card_bg_image: res.data.bg_custom_image, card_bg_type: 'image' }));
      toast.success('Фон карточки загружен');
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setUploadingCardBg(false);
    }
  };

  const handleDeleteTrack = async (id: string) => {
    if (!confirm('Удалить этот трек?')) return;
    try {
      await profileApi.deleteTrack(id);
      setPlaylist(prev => prev.filter(t => t.id !== id));
      toast.success('Удалено');
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  const handleRenameTrack = async (id: string, current: string) => {
    const name = prompt('Введите новое название:', current);
    if (!name || name === current) return;
    try {
      const res = await profileApi.updateTrack(id, name);
      setPlaylist(prev => prev.map(t => t.id === id ? res.data.track : t));
      toast.success('Переименовано');
    } catch {
      toast.error('Ошибка');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Mode Toggle */}
      <GlassCard className="p-4 flex gap-2">
        <button
          onClick={() => setMode('visual')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'visual' ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-white/5 text-gray-500 hover:text-white'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
          Визуальный редактор
        </button>
        <button
          onClick={() => setMode('code')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'code' ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-white/5 text-gray-500 hover:text-white'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          Custom CSS
        </button>
      </GlassCard>

      {mode === 'visual' ? (
        <>
          {/* Background Settings */}
          <GlassCard className="p-6">
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Фон страницы
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter mb-3 block">Тип заливки</label>
                <div className="grid grid-cols-3 gap-2">
                  {['gradient', 'color', 'image'].map(type => (
                    <button
                      key={type}
                      onClick={() => setLocalTheme(p => ({ ...p, bg_type: type as any }))}
                      className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-all ${localTheme.bg_type === type ? 'bg-green-500/20 border border-green-500/50 text-white' : 'bg-white/5 border border-white/8 text-gray-500'}`}
                    >
                      {type === 'gradient' ? 'Градиент' : type === 'color' ? 'Цвет' : 'Фото'}
                    </button>
                  ))}
                </div>
              </div>

              {localTheme.bg_type === 'gradient' && (
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENTS.map(g => (
                    <button
                      key={g.name}
                      onClick={() => setLocalTheme(p => ({ ...p, bg_gradient: g.value }))}
                      className={`h-12 rounded-xl border-2 transition-all ${localTheme.bg_gradient === g.value ? 'border-green-500 scale-105' : 'border-white/10'}`}
                      style={{ background: g.value }}
                    />
                  ))}
                </div>
              )}

              {localTheme.bg_type === 'color' && (
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={localTheme.bg_color}
                    onChange={e => setLocalTheme(p => ({ ...p, bg_color: e.target.value }))}
                    className="w-full h-12 rounded-xl cursor-pointer bg-white/5 border border-white/10 p-1"
                  />
                </div>
              )}
            </div>
          </GlassCard>

          {/* Card Settings */}
          <GlassCard className="p-6">
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Настройки карточки
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter mb-2 block">Ширина: {localTheme.card_width || 500}px</label>
                  <input
                    type="range" min="320" max="800" step="10"
                    value={localTheme.card_width || 500}
                    onChange={e => setLocalTheme(p => ({ ...p, card_width: parseInt(e.target.value) }))}
                    className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-green-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter mb-2 block">Макс: {localTheme.card_max_width || 1200}px</label>
                  <input
                    type="range" min="500" max="1200" step="10"
                    value={localTheme.card_max_width || 1200}
                    onChange={e => setLocalTheme(p => ({ ...p, card_max_width: parseInt(e.target.value) }))}
                    className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter mb-3 block">Фон карточки</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLocalTheme(p => ({ ...p, card_bg_type: 'color' }))}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${localTheme.card_bg_type === 'color' ? 'bg-green-500/20 border-green-500/50' : 'bg-white/5 border-white/8'}`}
                  >
                    Цвет/Прозрачность
                  </button>
                  <button
                    onClick={() => setLocalTheme(p => ({ ...p, card_bg_type: 'image' }))}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${localTheme.card_bg_type === 'image' ? 'bg-green-500/20 border-green-500/50' : 'bg-white/5 border-white/8'}`}
                  >
                    Картинка
                  </button>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className={`p-3 rounded-xl border border-white/5 flex items-center justify-between ${!hasPremium ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                    <span className="text-[10px] font-bold text-white uppercase">GIF Фон</span>
                    {!hasPremium ? <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> : <span className="w-2 h-2 rounded-full bg-green-500" />}
                  </div>
                  <div className={`p-3 rounded-xl border border-white/5 flex items-center justify-between ${!hasPremium ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
                    <span className="text-[10px] font-bold text-white uppercase">Видео Фон</span>
                    {!hasPremium ? <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> : <span className="w-2 h-2 rounded-full bg-green-500" />}
                  </div>
                </div>
              </div>

              {localTheme.card_bg_type === 'color' && (
                <Input
                  label="Цвет RGBA (например: rgba(0,0,0,0.5))"
                  value={localTheme.card_bg_color || ''}
                  onChange={e => setLocalTheme(p => ({ ...p, card_bg_color: e.target.value }))}
                />
              )}

              {localTheme.card_bg_type === 'image' && (
                <div className="space-y-3">
                  {localTheme.card_bg_image ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 h-28">
                      <img src={localTheme.card_bg_image} alt="Card BG" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setLocalTheme((p) => ({ ...p, card_bg_image: '' }))}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 text-white flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-5 text-center hover:border-green-500/30 hover:bg-green-500/[0.02]">
                        {uploadingCardBg ? (
                          <div className="w-6 h-6 border-2 border-t-green-500 rounded-full animate-spin mx-auto" />
                        ) : (
                          <p className="text-gray-400 text-xs font-bold uppercase">Загрузить картинку карточки</p>
                        )}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleCardBgUpload} />
                    </label>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter mb-2 block">Прозрачность {Math.round((localTheme.card_opacity || 0.15) * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.01"
                    value={localTheme.card_opacity || 0.15}
                    onChange={(e) => setLocalTheme((p) => ({ ...p, card_opacity: parseFloat(e.target.value) }))}
                    className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-green-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter mb-2 block">Blur {localTheme.card_blur || 12}px</label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={localTheme.card_blur || 12}
                    onChange={(e) => setLocalTheme((p) => ({ ...p, card_blur: parseInt(e.target.value) }))}
                    className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-green-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter mb-2 block">Скругление {localTheme.card_border_radius || 16}px</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={localTheme.card_border_radius || 16}
                    onChange={(e) => setLocalTheme((p) => ({ ...p, card_border_radius: parseInt(e.target.value) }))}
                    className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-green-500"
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Music Playlist Management */}
          <GlassCard className="p-6">
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Плейлист и Музыка
            </h2>
            
            <div className="space-y-4">
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-green-500/30 hover:bg-green-500/[0.02] transition-all">
                  {uploadingMusic ? <div className="w-6 h-6 border-2 border-t-green-500 rounded-full animate-spin mx-auto" /> : (
                    <>
                      <svg className="w-8 h-8 mx-auto mb-2 text-green-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
                      <p className="text-white text-xs font-bold uppercase tracking-tighter">Загрузить новый трек</p>
                    </>
                  )}
                </div>
                <input type="file" accept="audio/*" className="hidden" onChange={handleMusicUpload} />
              </label>

              {playlist.length > 0 && (
                <div className="space-y-2 mt-4">
                  {playlist.map((track) => (
                    <div key={track.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[11px] font-bold truncate uppercase">{track.title}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleRenameTrack(track.id, track.title)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => handleDeleteTrack(track.id)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </>
      ) : (
        <GlassCard className="p-6">
          <Textarea
            value={localTheme.custom_css}
            onChange={e => setLocalTheme(p => ({ ...p, custom_css: e.target.value }))}
            placeholder=".bio-container { /* ваши стили */ }"
            rows={15}
            className="font-mono text-xs"
          />
        </GlassCard>
      )}

      {/* Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3 px-4 w-full max-w-md">
        <Button variant="primary" onClick={handleSave} loading={saving} className="flex-1 font-black uppercase tracking-widest shadow-2xl shadow-green-500/20">
          Сохранить всё
        </Button>
        <Button variant="secondary" onClick={handleReset} className="font-black uppercase tracking-widest">
          Сброс
        </Button>
      </div>
    </div>
  );
}
