import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { profileApi, ThemeSettings } from '@/lib/api';
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileApi.updateTheme(localTheme);
      onUpdate(res.data.theme);
      toast.success('Theme saved!');
    } catch {
      toast.error('Failed to save theme');
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <GlassCard className="p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('visual')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'visual' ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-white/5 text-gray-500 hover:text-white'}`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Visual Editor
          </button>
          <button
            onClick={() => setMode('code')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'code' ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-white/5 text-gray-500 hover:text-white'}`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <h2 className="text-white font-semibold mb-5">Background</h2>
            
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
                            <p className="text-gray-500 text-sm">Upload image</p>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                    </label>
                  )}
                </div>
              )}

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

          {/* Card Style */}
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-5">Card Style</h2>
            
            <div className="space-y-4">
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
                  max="30"
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
                  max="40"
                  step="2"
                  value={localTheme.card_border_radius}
                  onChange={e => setLocalTheme(p => ({ ...p, card_border_radius: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Shadow</label>
                <div className="grid grid-cols-3 gap-2">
                  {['none', 'sm', 'md', 'lg', 'xl'].map(s => (
                    <button
                      key={s}
                      onClick={() => setLocalTheme(p => ({ ...p, card_shadow: s }))}
                      className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${localTheme.card_shadow === s ? 'bg-green-500/20 border border-green-500/50 text-white' : 'bg-white/5 border border-white/8 text-gray-500'}`}
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

          {/* Button Style */}
          <GlassCard className="p-6">
            <h2 className="text-white font-semibold mb-5">Button Style</h2>
            
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
                  max="40"
                  step="2"
                  value={localTheme.button_radius}
                  onChange={e => setLocalTheme(p => ({ ...p, button_radius: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>
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
                <div className="grid grid-cols-3 gap-2">
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
          <h2 className="text-white font-semibold mb-3">Custom CSS</h2>
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
          <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-yellow-400 text-xs">
              <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Note: @import, javascript:, expression(), and behavior: are blocked for security.
            </p>
          </div>
        </GlassCard>
      )}

      <div className="flex gap-3">
        <Button variant="primary" onClick={handleSave} loading={saving} className="flex-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Theme
        </Button>
        <Button variant="ghost" onClick={() => setLocalTheme(theme)}>
          Reset
        </Button>
      </div>
    </div>
  );
}
