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

const BG_COLORS = ['#000000', '#0a0a0a', '#0f0f0f', '#1a1a1a', '#050505'];

export function ThemeTab({ theme, onUpdate }: ThemeTabProps) {
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [localTheme, setLocalTheme] = useState(theme);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [playlist, setPlaylist] = useState<Array<{ id: string; title: string; file_url: string }>>([]);
  const { isVip, isAdmin, isOwner } = useAuthStore();
  const privileged = isVip || isAdmin || isOwner;

  useEffect(() => {
    profileApi.getPlaylist().then((res) => setPlaylist(res.data.playlist || [])).catch(() => {});
  }, []);

  // Live update parent component
  useEffect(() => {
    const debounce = setTimeout(() => {
      onUpdate(localTheme);
    }, 100);
    return () => clearTimeout(debounce);
  }, [localTheme, onUpdate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileApi.updateTheme(localTheme);
      onUpdate(res.data.theme);
      toast.success('Theme saved successfully!');
    } catch {
      toast.error('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalTheme(theme);
    toast.success('Settings reset to last saved state');
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await profileApi.uploadBgImage(file);
      setLocalTheme(prev => ({ ...prev, bg_image_url: res.data.bg_image_url, bg_type: 'image' }));
      toast.success('Background uploaded!');
    } catch {
      toast.error('Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const handleCustomBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await profileApi.uploadCustomBg(file);
      setLocalTheme(prev => ({ ...prev, bg_custom_image: res.data.bg_custom_image }));
      toast.success('Custom background uploaded!');
    } catch {
      toast.error('Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMusic(true);
    try {
      const res = await profileApi.uploadMusic(file);
      if (res.data.track) {
        setPlaylist((prev) => [...prev, res.data.track]);
      }
      setLocalTheme(prev => ({ ...prev, music_url: res.data.track?.file_url || prev.music_url }));
      toast.success('Music uploaded!');
    } catch {
      toast.error('Failed to upload music');
    } finally {
      setUploadingMusic(false);
    }
  };

  const handleDeleteTrack = async (id: string) => {
    try {
      await profileApi.deleteTrack(id);
      setPlaylist((prev) => prev.filter((t) => t.id !== id));
      toast.success('Track deleted');
    } catch {
      toast.error('Failed to delete track');
    }
  };

  const handleRenameTrack = async (id: string, currentTitle: string) => {
    const title = window.prompt('Новое название трека', currentTitle);
    if (!title || !title.trim()) return;
    try {
      const res = await profileApi.updateTrack(id, title.trim());
      setPlaylist((prev) => prev.map((t) => (t.id === id ? res.data.track : t)));
      toast.success('Название обновлено');
    } catch {
      toast.error('Failed to rename track');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <GlassCard className="p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('visual')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${mode === 'visual' ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-white/5 text-gray-500 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Visual Editor
          </button>
          <button
            onClick={() => setMode('code')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${mode === 'code' ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-white/5 text-gray-500 hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Custom CSS
          </button>
        </div>
      </GlassCard>

      {mode === 'visual' ? (
        <>
          {/* Background */}
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Background
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Background Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['gradient', 'color', 'image'].map(type => (
                    <button
                      key={type}
                      onClick={() => setLocalTheme(p => ({ ...p, bg_type: type as any }))}
                      className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${localTheme.bg_type === type ? 'bg-green-500/20 border border-green-500/50 text-white' : 'bg-white/5 border border-white/8 text-gray-500'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/3 border border-white/8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">GIF/Video Background</p>
                    <p className="text-xs text-gray-500">Доступно только для VIP, Admin, Owner</p>
                  </div>
                  {!privileged ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-white/5 text-gray-400 border border-white/10">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Закрыто
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-500/15 text-green-400 border border-green-500/30">Открыто</span>
                  )}
                </div>
              </div>

              {localTheme.bg_type === 'gradient' && (
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Gradient Preset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GRADIENTS.map(g => (
                      <button
                        key={g.name}
                        onClick={() => setLocalTheme(p => ({ ...p, bg_gradient: g.value }))}
                        className={`p-3 rounded-xl border transition-all ${localTheme.bg_gradient === g.value ? 'border-green-500/50' : 'border-white/10'}`}
                        style={{ background: g.value }}
                      >
                        <p className="text-white text-xs font-medium">{g.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {localTheme.bg_type === 'color' && (
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Background Color</label>
                  <div className="flex gap-2">
                    {BG_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setLocalTheme(p => ({ ...p, bg_color: c }))}
                        className={`w-12 h-12 rounded-xl border-2 transition-all ${localTheme.bg_color === c ? 'border-green-500 scale-110' : 'border-white/20'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={localTheme.bg_color}
                      onChange={e => setLocalTheme(p => ({ ...p, bg_color: e.target.value }))}
                      className="w-12 h-12 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {localTheme.bg_type === 'image' && (
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Background Image</label>
                  {localTheme.bg_image_url ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 h-32">
                      <img src={localTheme.bg_image_url} alt="Background" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setLocalTheme(p => ({ ...p, bg_image_url: '' }))}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-green-500/30 hover:bg-green-500/5 transition-all">
                        {uploading ? (
                          <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto" />
                        ) : (
                          <>
                            <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 text-sm">Upload image (max 10MB)</p>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                    </label>
                  )}
                </div>
              )}

              {/* Custom Background Image */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Custom Background (Draw/Upload)
                </label>
                {localTheme.bg_custom_image ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 h-32">
                    <img src={localTheme.bg_custom_image} alt="Custom BG" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setLocalTheme(p => ({ ...p, bg_custom_image: '' }))}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-green-500/30 hover:bg-green-500/5 transition-all">
                      {uploading ? (
                        <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto" />
                      ) : (
                        <>
                          <svg className="w-6 h-6 mx-auto mb-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <p className="text-gray-500 text-xs">Upload custom bg</p>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCustomBgUpload} />
                  </label>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Overlay Opacity: {Math.round(localTheme.bg_overlay_opacity * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={localTheme.bg_overlay_opacity}
                  onChange={e => setLocalTheme(p => ({ ...p, bg_overlay_opacity: parseFloat(e.target.value) }))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>
            </div>
          </GlassCard>

          {/* Card Settings - Advanced */}
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Card Settings
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Width: {localTheme.card_width || 500}px</label>
                  <input
                    type="range"
                    min="320"
                    max="500"
                    step="10"
                    value={localTheme.card_width || 500}
                    onChange={e => setLocalTheme(p => ({ ...p, card_width: parseInt(e.target.value) }))}
                    className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Max Width: {localTheme.card_max_width || 1200}px</label>
                  <input
                    type="range"
                    min="500"
                    max="1200"
                    step="10"
                    value={localTheme.card_max_width || 1200}
                    onChange={e => setLocalTheme(p => ({ ...p, card_max_width: parseInt(e.target.value) }))}
                    className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Card Opacity: {Math.round(localTheme.card_opacity * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={localTheme.card_opacity}
                  onChange={e => setLocalTheme(p => ({ ...p, card_opacity: parseFloat(e.target.value) }))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Blur Strength: {localTheme.card_blur}px</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={localTheme.card_blur}
                  onChange={e => setLocalTheme(p => ({ ...p, card_blur: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Border Radius: {localTheme.card_border_radius}px</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="2"
                  value={localTheme.card_border_radius}
                  onChange={e => setLocalTheme(p => ({ ...p, card_border_radius: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Padding: {localTheme.card_padding}px</label>
                  <input
                    type="range"
                    min="8"
                    max="80"
                    step="4"
                    value={localTheme.card_padding}
                    onChange={e => setLocalTheme(p => ({ ...p, card_padding: parseInt(e.target.value) }))}
                    className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Margin Top: {localTheme.card_margin_top}px</label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="4"
                    value={localTheme.card_margin_top}
                    onChange={e => setLocalTheme(p => ({ ...p, card_margin_top: parseInt(e.target.value) }))}
                    className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Margin Bottom: {localTheme.card_margin_bottom}px</label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="4"
                    value={localTheme.card_margin_bottom}
                    onChange={e => setLocalTheme(p => ({ ...p, card_margin_bottom: parseInt(e.target.value) }))}
                    className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Border Width: {localTheme.card_border_width}px</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={localTheme.card_border_width}
                  onChange={e => setLocalTheme(p => ({ ...p, card_border_width: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>

              <Input
                label="Border Color (RGBA)"
                value={localTheme.card_border_color}
                onChange={e => setLocalTheme(p => ({ ...p, card_border_color: e.target.value }))}
                placeholder="rgba(255,255,255,0.1)"
              />

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Shadow</label>
                <div className="grid grid-cols-5 gap-2">
                  {['none', 'sm', 'md', 'lg', 'xl'].map(s => (
                    <button
                      key={s}
                      onClick={() => setLocalTheme(p => ({ ...p, card_shadow: s }))}
                      className={`py-2 px-3 rounded-lg text-xs capitalize transition-all ${localTheme.card_shadow === s ? 'bg-green-500/20 border border-green-500/50 text-white' : 'bg-white/5 border border-white/8 text-gray-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">Card Glow</p>
                  <p className="text-gray-500 text-xs">Add green glow effect</p>
                </div>
                <button
                  onClick={() => setLocalTheme(p => ({ ...p, card_glow: p.card_glow ? 0 : 1 }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${localTheme.card_glow ? 'bg-green-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${localTheme.card_glow ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Button Settings - Advanced */}
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Button Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {['glass', 'solid', 'outline', 'minimal'].map(s => (
                    <button
                      key={s}
                      onClick={() => setLocalTheme(p => ({ ...p, button_style: s }))}
                      className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${localTheme.button_style === s ? 'bg-green-500/20 border border-green-500/50 text-white' : 'bg-white/5 border border-white/8 text-gray-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Button Radius: {localTheme.button_radius}px</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="2"
                  value={localTheme.button_radius}
                  onChange={e => setLocalTheme(p => ({ ...p, button_radius: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Padding Y: {localTheme.button_padding_y}px</label>
                  <input
                    type="range"
                    min="4"
                    max="32"
                    step="2"
                    value={localTheme.button_padding_y}
                    onChange={e => setLocalTheme(p => ({ ...p, button_padding_y: parseInt(e.target.value) }))}
                    className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Padding X: {localTheme.button_padding_x}px</label>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    step="4"
                    value={localTheme.button_padding_x}
                    onChange={e => setLocalTheme(p => ({ ...p, button_padding_x: parseInt(e.target.value) }))}
                    className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Font Size: {localTheme.button_font_size}px</label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    step="1"
                    value={localTheme.button_font_size}
                    onChange={e => setLocalTheme(p => ({ ...p, button_font_size: parseInt(e.target.value) }))}
                    className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Font Weight: {localTheme.button_font_weight}</label>
                  <input
                    type="range"
                    min="300"
                    max="900"
                    step="100"
                    value={localTheme.button_font_weight}
                    onChange={e => setLocalTheme(p => ({ ...p, button_font_weight: parseInt(e.target.value) }))}
                    className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Border Width: {localTheme.button_border_width}px</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={localTheme.button_border_width}
                  onChange={e => setLocalTheme(p => ({ ...p, button_border_width: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>
            </div>
          </GlassCard>

          {/* Music Player */}
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Background Music
            </h2>

            <div className="space-y-4">
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-green-500/30 hover:bg-green-500/5 transition-all">
                  {uploadingMusic ? (
                    <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <p className="text-gray-500 text-sm">Upload music (MP3, WAV, OGG, M4A - max 15MB)</p>
                    </>
                  )}
                </div>
                <input type="file" accept="audio/*" className="hidden" onChange={handleMusicUpload} />
              </label>

              {playlist.length > 0 && (
                <div className="space-y-2">
                  {playlist.map((track) => (
                    <div key={track.id} className="p-3 rounded-xl bg-white/3 border border-white/8 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-green-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{track.title}</p>
                      </div>
                      <button onClick={() => handleRenameTrack(track.id, track.title)} className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                        <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDeleteTrack(track.id)} className="w-8 h-8 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10">
                        <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {playlist.length > 0 && (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                    <div>
                      <p className="text-white text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Автозапуск
                      </p>
                      <p className="text-gray-500 text-xs">Музыка начнет играть автоматически при открытии страницы</p>
                    </div>
                    <button
                      onClick={() => setLocalTheme(p => ({ ...p, music_autoplay: p.music_autoplay ? 0 : 1 }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${localTheme.music_autoplay ? 'bg-green-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${localTheme.music_autoplay ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                    <div>
                      <p className="text-white text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Зацикливание
                      </p>
                      <p className="text-gray-500 text-xs">Плейлист будет повторяться по кругу</p>
                    </div>
                    <button
                      onClick={() => setLocalTheme(p => ({ ...p, music_loop: p.music_loop ? 0 : 1 }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${localTheme.music_loop ? 'bg-green-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${localTheme.music_loop ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-2 block flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      Громкость по умолчанию: {Math.round(localTheme.music_volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={localTheme.music_volume}
                      onChange={e => setLocalTheme(p => ({ ...p, music_volume: parseFloat(e.target.value) }))}
                      className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                    />
                  </div>
                </>
              )}
            </div>
          </GlassCard>

          {/* Other Settings */}
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-5">Other Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-2 block">Spacing</label>
                <div className="grid grid-cols-3 gap-2">
                  {['compact', 'normal', 'relaxed'].map(s => (
                    <button
                      key={s}
                      onClick={() => setLocalTheme(p => ({ ...p, spacing: s }))}
                      className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${localTheme.spacing === s ? 'bg-green-500/20 border border-green-500/50 text-white' : 'bg-white/5 border border-white/8 text-gray-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Animation</label>
                <div className="grid grid-cols-4 gap-2">
                  {['none', 'fade', 'slide', 'scale'].map(a => (
                    <button
                      key={a}
                      onClick={() => setLocalTheme(p => ({ ...p, animation: a }))}
                      className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${localTheme.animation === a ? 'bg-green-500/20 border border-green-500/50 text-white' : 'bg-white/5 border border-white/8 text-gray-500'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Accent Color"
                type="color"
                value={localTheme.accent_color}
                onChange={e => setLocalTheme(p => ({ ...p, accent_color: e.target.value }))}
              />
            </div>
          </GlassCard>
        </>
      ) : (
        <GlassCard className="p-6">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Custom CSS
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Write custom CSS that applies only to your bio page. Dangerous patterns are automatically filtered.
          </p>
          <Textarea
            value={localTheme.custom_css}
            onChange={e => setLocalTheme(p => ({ ...p, custom_css: e.target.value }))}
            placeholder=".bio-container { /* your styles */ }"
            rows={15}
            className="font-mono text-xs"
          />
          <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
            <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-yellow-400 text-xs">
              Note: @import, javascript:, expression(), and behavior: are blocked for security.
            </p>
          </div>
        </GlassCard>
      )}

      <div className="flex gap-3 sticky bottom-4">
        <Button variant="primary" onClick={handleSave} loading={saving} className="flex-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save All Changes
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </Button>
      </div>
    </div>
  );
}
