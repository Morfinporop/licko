import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('biolink_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('biolink_token');
      localStorage.removeItem('biolink_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  register: (data: { email: string; password: string; username: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  checkUsername: (username: string) => api.get(`/auth/check-username/${username}`)
};

// Profile
export const profileApi = {
  get: () => api.get('/profile'),
  update: (data: Partial<ProfileData>) => api.put('/profile', data),
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return api.post('/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadBgImage: (file: File) => {
    const fd = new FormData();
    fd.append('bg_image', file);
    return api.post('/profile/bg-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadCustomBg: (file: File) => {
    const fd = new FormData();
    fd.append('custom_bg', file);
    return api.post('/profile/custom-bg', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadMusic: (file: File, title?: string) => {
    const fd = new FormData();
    fd.append('music', file);
    if (title) fd.append('title', title);
    return api.post('/profile/music', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getPlaylist: () => api.get('/profile/music/playlist'),
  updateTrack: (id: string, title: string) => api.put(`/profile/music/${id}`, { title }),
  deleteTrack: (id: string) => api.delete(`/profile/music/${id}`),
  reorderPlaylist: (order: string[]) => api.put('/profile/music/reorder', { order }),
  getTheme: () => api.get('/profile/theme'),
  updateTheme: (data: Partial<ThemeSettings>) => api.put('/profile/theme', data),
  getLinks: () => api.get('/profile/links'),
  addLink: (data: { title: string; url: string; icon?: string }) => api.post('/profile/links', data),
  updateLink: (id: string, data: Partial<LinkData>) => api.put(`/profile/links/${id}`, data),
  deleteLink: (id: string) => api.delete(`/profile/links/${id}`),
  reorderLinks: (order: string[]) => api.put('/profile/links/reorder', { order }),
  getSocials: () => api.get('/profile/socials'),
  addSocial: (data: { platform: string; url: string }) => api.post('/profile/socials', data),
  deleteSocial: (id: string) => api.delete(`/profile/socials/${id}`)
};

// Public
export const publicApi = {
  getProfile: (username: string) => api.get(`/public/${username}`),
  trackClick: (username: string, linkId: string) => api.post(`/public/${username}/click/${linkId}`)
};

// Admin
export const adminApi = {
  getUsers: (page = 1, limit = 50, search = '') => api.get('/admin/users', { params: { page, limit, search } }),
  getUserDetails: (id: string) => api.get(`/admin/users/${id}`),
  banUser: (id: string, reason: string) => api.post(`/admin/users/${id}/ban`, { reason }),
  unbanUser: (id: string) => api.post(`/admin/users/${id}/unban`),
  grantVip: (id: string, grant: boolean) => api.post(`/admin/users/${id}/vip`, { grant }),
  grantVipByEmail: (email: string) => api.post('/admin/vip/grant-by-email', { email }),
  deleteUserContent: (userId: string, type: string, contentId: string) => 
    api.delete(`/admin/users/${userId}/content/${type}/${contentId}`),
  updateUserProfile: (id: string, data: any) => api.put(`/admin/users/${id}/profile`, data),
  getLogs: (page = 1, limit = 50) => api.get('/admin/logs', { params: { page, limit } }),
  getStats: () => api.get('/admin/stats'),
  getSupportTickets: () => api.get('/support/admin/tickets'),
  updateSupportTicket: (id: string, data: { status: string; admin_reply: string }) => api.put(`/support/admin/tickets/${id}`, data),
  getFeedback: () => api.get('/support/admin/feedback')
};

export const supportApi = {
  createTicket: (data: { email: string; subject: string; message: string }) => api.post('/support/ticket', data),
  sendFeedback: (data: { email?: string; content: string; kind?: string }) => api.post('/support/feedback', data),
  getFaq: () => api.get('/support/faq'),
  getLegalDocs: () => api.get('/support/legal-docs')
};

// Types
export interface ProfileData {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  views: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LinkData {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  is_active: boolean;
  click_count: number;
}

export interface SocialLink {
  id: string;
  user_id: string;
  platform: string;
  url: string;
  position: number;
}

export interface ThemeSettings {
  id: string;
  user_id: string;
  bg_type: 'gradient' | 'color' | 'image';
  bg_gradient: string;
  bg_color: string;
  bg_image_url: string;
  bg_overlay_opacity: number;
  bg_custom_image: string;
  card_opacity: number;
  card_blur: number;
  card_border_radius: number;
  card_shadow: string;
  card_glow: boolean | number;
  card_width: number;
  card_max_width: number;
  card_padding: number;
  card_margin_top: number;
  card_margin_bottom: number;
  card_border_width: number;
  card_border_color: string;
  card_bg_type: 'color' | 'image' | 'gif' | 'video';
  card_bg_color: string;
  card_bg_image: string;
  button_style: string;
  button_radius: number;
  button_padding_y: number;
  button_padding_x: number;
  button_font_size: number;
  button_font_weight: number;
  button_border_width: number;
  spacing: string;
  animation: string;
  accent_color: string;
  custom_css: string;
  music_url: string;
  music_autoplay: boolean | number;
  music_loop: boolean | number;
  music_volume: number;
  show_watermark?: number;
  custom_animations?: string;
  particle_effects?: number;
}

export interface MusicTrack {
  id: string;
  user_id: string;
  title: string;
  file_url: string;
  position: number;
  created_at: string;
}

export interface PublicProfile {
  username: string;
  profile: ProfileData;
  links: LinkData[];
  socials: SocialLink[];
  theme: ThemeSettings;
  playlist: MusicTrack[];
  role: string;
  vip_status: number;
}

export default api;
