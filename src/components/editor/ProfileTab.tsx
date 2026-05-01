import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { profileApi, ProfileData } from '@/lib/api';
import toast from 'react-hot-toast';

interface ProfileTabProps {
  profile: ProfileData;
  username: string;
  onUpdate: (p: ProfileData) => void;
}

export function ProfileTab({ profile, username, onUpdate }: ProfileTabProps) {
  const [form, setForm] = useState({
    display_name: profile.display_name || '',
    bio: profile.bio || '',
    is_published: profile.is_published
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileApi.update(form);
      onUpdate(res.data.profile);
      toast.success('Profile saved!');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await profileApi.uploadAvatar(file);
      onUpdate({ ...profile, avatar_url: res.data.avatar_url });
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <h2 className="text-white font-semibold mb-5">Profile Info</h2>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/5">
          <div className="relative">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-green-500/30" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center text-3xl">
                👤
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-medium mb-1">Profile Photo</p>
            <p className="text-gray-500 text-xs mb-3">JPG, PNG, GIF or WEBP. Max 5MB.</p>
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Photo
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Display Name"
            value={form.display_name}
            onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
            placeholder="Your full name"
          />

          <Input
            label="Username"
            value={username}
            disabled
            hint="Username cannot be changed after registration"
            leftIcon={<span className="text-green-500/60 text-sm font-mono">@</span>}
          />

          <Textarea
            label="Bio"
            value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            placeholder="Tell people about yourself..."
            rows={4}
          />

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
            <div>
              <p className="text-white text-sm font-medium">Published</p>
              <p className="text-gray-500 text-xs">Make your bio page visible to the public</p>
            </div>
            <button
              onClick={() => setForm(p => ({ ...p, is_published: !p.is_published }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${form.is_published ? 'bg-green-500' : 'bg-white/10'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${form.is_published ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        <Button variant="primary" onClick={handleSave} loading={saving} className="mt-5 w-full sm:w-auto">
          Save Profile
        </Button>
      </GlassCard>
    </div>
  );
}
