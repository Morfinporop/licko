import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { profileApi, SocialLink } from '@/lib/api';
import { SOCIAL_PLATFORMS, getSocialIcon } from '@/lib/socialIcons';
import toast from 'react-hot-toast';

interface SocialsTabProps {
  socials: SocialLink[];
  onUpdate: (socials: SocialLink[]) => void;
}

export function SocialsTab({ socials, onUpdate }: SocialsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ platform: '', url: '' });
  const [saving, setSaving] = useState(false);

  const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.id === form.platform);

  const handleSubmit = async () => {
    if (!form.platform || !form.url) { toast.error('Platform and URL are required'); return; }
    setSaving(true);
    try {
      const res = await profileApi.addSocial(form);
      onUpdate([...socials, res.data.social]);
      setShowForm(false);
      setForm({ platform: '', url: '' });
      toast.success('Social link added!');
    } catch {
      toast.error('Failed to add social link');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await profileApi.deleteSocial(id);
      onUpdate(socials.filter(s => s.id !== id));
      toast.success('Removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const availablePlatforms = SOCIAL_PLATFORMS.filter(p => !socials.some(s => s.platform === p.id));

  return (
    <div className="space-y-4">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Social Links</h2>
          {availablePlatforms.length > 0 && (
            <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Social
            </Button>
          )}
        </div>

        {showForm && (
          <div className="mb-5 p-4 rounded-xl bg-green-500/5 border border-green-500/20 space-y-4">
            <h3 className="text-white text-sm font-medium">Add Social Link</h3>

            <div>
              <p className="text-xs text-gray-500 mb-2">Platform</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availablePlatforms.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setForm(prev => ({ ...prev, platform: p.id, url: '' }))}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-sm ${form.platform === p.id ? 'bg-green-500/15 border-green-500/40 text-white' : 'bg-white/3 border-white/8 text-gray-400 hover:border-white/20'}`}
                  >
                    <span className="text-white">{getSocialIcon(p.id)}</span>
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {form.platform && (
              <Input
                label={`${selectedPlatform?.label} URL`}
                value={form.url}
                onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                placeholder={selectedPlatform?.placeholder}
              />
            )}

            <div className="flex gap-3">
              <Button variant="primary" size="sm" loading={saving} onClick={handleSubmit}>Add</Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setForm({ platform: '', url: '' }); }}>Cancel</Button>
            </div>
          </div>
        )}

        {socials.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <div className="text-4xl mb-3">📱</div>
            <p className="text-sm">No social links yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {socials.map(social => {
              const platform = SOCIAL_PLATFORMS.find(p => p.id === social.platform);
              return (
                <div key={social.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white flex-shrink-0">
                    {getSocialIcon(social.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{platform?.label || social.platform}</p>
                    <p className="text-gray-500 text-xs truncate">{social.url}</p>
                  </div>
                  <button onClick={() => handleDelete(social.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
