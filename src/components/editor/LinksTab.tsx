import { useState } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { profileApi, LinkData } from '@/lib/api';
import { LINK_ICONS } from '@/lib/socialIcons';
import toast from 'react-hot-toast';

interface SortableLinkProps {
  link: LinkData;
  onEdit: (link: LinkData) => void;
  onDelete: (id: string) => void;
  onToggle: (link: LinkData) => void;
}

function SortableLink({ link, onEdit, onDelete, onToggle }: SortableLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${link.is_active ? 'bg-white/3 border-white/8' : 'bg-white/1 border-white/4 opacity-60'}`}>
      <button {...attributes} {...listeners} className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing p-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base flex-shrink-0">
        {link.icon || '🔗'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{link.title}</p>
        <p className="text-gray-500 text-xs truncate">{link.url}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onToggle(link)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${link.is_active ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-600 hover:bg-white/5'}`}
          title={link.is_active ? 'Hide link' : 'Show link'}
        >
          {link.is_active ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </button>
        <button onClick={() => onEdit(link)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={() => onDelete(link.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface LinksTabProps {
  links: LinkData[];
  onUpdate: (links: LinkData[]) => void;
}

export function LinksTab({ links, onUpdate }: LinksTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editLink, setEditLink] = useState<LinkData | null>(null);
  const [form, setForm] = useState({ title: '', url: '', icon: '🔗' });
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex(l => l.id === active.id);
    const newIndex = links.findIndex(l => l.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);
    onUpdate(reordered);
    try {
      await profileApi.reorderLinks(reordered.map(l => l.id));
    } catch {
      toast.error('Failed to save order');
      onUpdate(links);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.url) { toast.error('Title and URL are required'); return; }
    setSaving(true);
    try {
      if (editLink) {
        const res = await profileApi.updateLink(editLink.id, form);
        onUpdate(links.map(l => l.id === editLink.id ? res.data.link : l));
        toast.success('Link updated!');
      } else {
        const res = await profileApi.addLink(form);
        onUpdate([...links, res.data.link]);
        toast.success('Link added!');
      }
      setShowForm(false);
      setEditLink(null);
      setForm({ title: '', url: '', icon: '🔗' });
    } catch {
      toast.error('Failed to save link');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await profileApi.deleteLink(id);
      onUpdate(links.filter(l => l.id !== id));
      toast.success('Link deleted');
    } catch {
      toast.error('Failed to delete link');
    }
  };

  const handleEdit = (link: LinkData) => {
    setEditLink(link);
    setForm({ title: link.title, url: link.url, icon: link.icon || '🔗' });
    setShowForm(true);
  };

  const handleToggle = async (link: LinkData) => {
    try {
      const res = await profileApi.updateLink(link.id, { is_active: !link.is_active });
      onUpdate(links.map(l => l.id === link.id ? res.data.link : l));
    } catch {
      toast.error('Failed to update link');
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Links ({links.length})</h2>
          <Button variant="primary" size="sm" onClick={() => { setEditLink(null); setForm({ title: '', url: '', icon: '🔗' }); setShowForm(true); }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Link
          </Button>
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <div className="mb-5 p-4 rounded-xl bg-green-500/5 border border-green-500/20 space-y-4">
            <h3 className="text-white text-sm font-medium">{editLink ? 'Edit Link' : 'New Link'}</h3>

            {/* Icon selector */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Icon</p>
              <div className="flex flex-wrap gap-2">
                {LINK_ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setForm(p => ({ ...p, icon }))}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${form.icon === icon ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/5 border border-white/8 hover:border-white/20'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Title"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="My Portfolio"
            />
            <Input
              label="URL"
              value={form.url}
              onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              placeholder="https://..."
            />

            <div className="flex gap-3">
              <Button variant="primary" size="sm" loading={saving} onClick={handleSubmit}>
                {editLink ? 'Save Changes' : 'Add Link'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditLink(null); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {links.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <div className="text-4xl mb-3">🔗</div>
            <p className="text-sm">No links yet. Add your first link!</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {links.map(link => (
                  <SortableLink key={link.id} link={link} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </GlassCard>
    </div>
  );
}
