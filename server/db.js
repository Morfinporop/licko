import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'biolink.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    vip_status INTEGER DEFAULT 0,
    is_banned INTEGER DEFAULT 0,
    ban_reason TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    display_name TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS profile_views (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    viewer_ip TEXT NOT NULL,
    viewer_fingerprint TEXT DEFAULT '',
    viewed_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, viewer_ip, viewer_fingerprint)
  );

  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT DEFAULT '',
    position INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    click_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS social_links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS theme_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    bg_type TEXT DEFAULT 'gradient',
    bg_gradient TEXT DEFAULT 'linear-gradient(135deg, #0a0a0a 0%, #0d1a0d 50%, #0a0a0a 100%)',
    bg_color TEXT DEFAULT '#0a0a0a',
    bg_image_url TEXT DEFAULT '',
    bg_overlay_opacity REAL DEFAULT 0.5,
    bg_custom_image TEXT DEFAULT '',
    card_opacity REAL DEFAULT 0.15,
    card_blur INTEGER DEFAULT 12,
    card_border_radius INTEGER DEFAULT 16,
    card_shadow TEXT DEFAULT 'lg',
    card_glow INTEGER DEFAULT 0,
    card_width INTEGER DEFAULT 500,
    card_max_width INTEGER DEFAULT 1200,
    card_padding INTEGER DEFAULT 32,
    card_margin_top INTEGER DEFAULT 48,
    card_margin_bottom INTEGER DEFAULT 48,
    card_border_width INTEGER DEFAULT 1,
    card_border_color TEXT DEFAULT 'rgba(255,255,255,0.1)',
    card_bg_type TEXT DEFAULT 'color',
    card_bg_color TEXT DEFAULT 'rgba(255,255,255,0.05)',
    card_bg_image TEXT DEFAULT '',
    button_style TEXT DEFAULT 'glass',
    button_radius INTEGER DEFAULT 12,
    button_padding_y INTEGER DEFAULT 14,
    button_padding_x INTEGER DEFAULT 24,
    button_font_size INTEGER DEFAULT 16,
    button_font_weight INTEGER DEFAULT 500,
    button_border_width INTEGER DEFAULT 1,
    spacing TEXT DEFAULT 'normal',
    animation TEXT DEFAULT 'fade',
    accent_color TEXT DEFAULT '#22c55e',
    custom_css TEXT DEFAULT '',
    music_url TEXT DEFAULT '',
    music_autoplay INTEGER DEFAULT 0,
    music_loop INTEGER DEFAULT 1,
    music_volume REAL DEFAULT 0.5,
    show_watermark INTEGER DEFAULT 1,
    custom_animations TEXT DEFAULT '',
    particle_effects INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS music_playlist (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS admin_logs (
    id TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_user_id TEXT DEFAULT '',
    details TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    admin_reply TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS feedback_ideas (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    email TEXT DEFAULT '',
    content TEXT NOT NULL,
    kind TEXT DEFAULT 'idea',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );
`);

export default db;
