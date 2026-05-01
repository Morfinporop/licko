import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '../../data/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.userId}-avatar-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

const bgStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.userId}-bg-${Date.now()}${ext}`);
  }
});

const uploadBg = multer({
  storage: bgStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

const musicStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.userId}-music-${Date.now()}${ext}`);
  }
});

const uploadMusic = multer({
  storage: musicStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.mp3', '.wav', '.ogg', '.m4a'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only audio files allowed'));
  }
});

const router = Router();

// Get own profile
router.get('/', authMiddleware, (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.userId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile
router.put('/', authMiddleware, (req, res) => {
  try {
    const { display_name, bio, is_published } = req.body;
    db.prepare(`
      UPDATE profiles SET display_name = ?, bio = ?, is_published = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(
      display_name || '',
      bio || '',
      is_published !== undefined ? (is_published ? 1 : 0) : 1,
      req.userId
    );
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.userId);
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    db.prepare(`UPDATE profiles SET avatar_url = ?, updated_at = datetime('now') WHERE user_id = ?`)
      .run(avatarUrl, req.userId);
    res.json({ avatar_url: avatarUrl });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload background image
router.post('/bg-image', authMiddleware, uploadBg.single('bg_image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const bgUrl = `/uploads/${req.file.filename}`;
    db.prepare(`UPDATE theme_settings SET bg_image_url = ?, bg_type = 'image', updated_at = datetime('now') WHERE user_id = ?`)
      .run(bgUrl, req.userId);
    res.json({ bg_image_url: bgUrl });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload custom background
router.post('/custom-bg', authMiddleware, uploadBg.single('custom_bg'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const bgUrl = `/uploads/${req.file.filename}`;
    db.prepare(`UPDATE theme_settings SET bg_custom_image = ?, updated_at = datetime('now') WHERE user_id = ?`)
      .run(bgUrl, req.userId);
    res.json({ bg_custom_image: bgUrl });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload music to playlist
router.post('/music', authMiddleware, uploadMusic.single('music'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const musicUrl = `/uploads/${req.file.filename}`;
    const title = req.body.title || req.file.originalname;
    
    const maxPos = db.prepare('SELECT MAX(position) as max FROM music_playlist WHERE user_id = ?').get(req.userId);
    const position = (maxPos?.max ?? -1) + 1;
    const id = uuidv4();

    db.prepare('INSERT INTO music_playlist (id, user_id, title, file_url, position) VALUES (?, ?, ?, ?, ?)')
      .run(id, req.userId, title, musicUrl, position);

    const track = db.prepare('SELECT * FROM music_playlist WHERE id = ?').get(id);
    res.json({ track });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get playlist
router.get('/music/playlist', authMiddleware, (req, res) => {
  try {
    const playlist = db.prepare('SELECT * FROM music_playlist WHERE user_id = ? ORDER BY position ASC').all(req.userId);
    res.json({ playlist });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete track from playlist
router.delete('/music/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM music_playlist WHERE id = ? AND user_id = ?').run(id, req.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/music/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    db.prepare('UPDATE music_playlist SET title = ? WHERE id = ? AND user_id = ?').run(title, id, req.userId);
    const track = db.prepare('SELECT * FROM music_playlist WHERE id = ? AND user_id = ?').get(id, req.userId);
    res.json({ track });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder playlist
router.put('/music/reorder', authMiddleware, (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Order must be an array' });

    const updatePos = db.prepare('UPDATE music_playlist SET position = ? WHERE id = ? AND user_id = ?');
    const transaction = db.transaction(() => {
      order.forEach((id, index) => {
        updatePos.run(index, id, req.userId);
      });
    });
    transaction();

    const playlist = db.prepare('SELECT * FROM music_playlist WHERE user_id = ? ORDER BY position ASC').all(req.userId);
    res.json({ playlist });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get theme settings
router.get('/theme', authMiddleware, (req, res) => {
  try {
    const theme = db.prepare('SELECT * FROM theme_settings WHERE user_id = ?').get(req.userId);
    if (!theme) return res.status(404).json({ error: 'Theme not found' });
    res.json({ theme });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update theme settings
router.put('/theme', authMiddleware, (req, res) => {
  try {
    const {
      bg_type, bg_gradient, bg_color, bg_image_url, bg_overlay_opacity, bg_custom_image,
      card_opacity, card_blur, card_border_radius, card_shadow, card_glow,
      card_width, card_max_width, card_padding, card_margin_top, card_margin_bottom,
      card_border_width, card_border_color, card_bg_type, card_bg_color, card_bg_image,
      button_style, button_radius, button_padding_y, button_padding_x,
      button_font_size, button_font_weight, button_border_width,
      spacing, animation, accent_color, custom_css,
      music_url, music_autoplay, music_loop, music_volume
    } = req.body;

    // Sanitize custom_css: remove dangerous patterns
    let safeCss = (custom_css || '').replace(/<[^>]*>/g, '');
    safeCss = safeCss.replace(/javascript\s*:/gi, '');
    safeCss = safeCss.replace(/expression\s*\(/gi, '');
    safeCss = safeCss.replace(/@import/gi, '');
    safeCss = safeCss.replace(/behavior\s*:/gi, '');

    db.prepare(`
      UPDATE theme_settings SET
        bg_type = ?, bg_gradient = ?, bg_color = ?, bg_image_url = ?, bg_overlay_opacity = ?, bg_custom_image = ?,
        card_opacity = ?, card_blur = ?, card_border_radius = ?, card_shadow = ?, card_glow = ?,
        card_width = ?, card_max_width = ?, card_padding = ?, card_margin_top = ?, card_margin_bottom = ?,
        card_border_width = ?, card_border_color = ?, card_bg_type = ?, card_bg_color = ?, card_bg_image = ?,
        button_style = ?, button_radius = ?, button_padding_y = ?, button_padding_x = ?,
        button_font_size = ?, button_font_weight = ?, button_border_width = ?,
        spacing = ?, animation = ?, accent_color = ?, custom_css = ?,
        music_url = ?, music_autoplay = ?, music_loop = ?, music_volume = ?,
        updated_at = datetime('now')
      WHERE user_id = ?
    `).run(
      bg_type || 'gradient',
      bg_gradient || 'linear-gradient(135deg, #0a0a0a 0%, #0d1a0d 50%, #0a0a0a 100%)',
      bg_color || '#0a0a0a',
      bg_image_url || '',
      bg_overlay_opacity ?? 0.5,
      bg_custom_image || '',
      card_opacity ?? 0.15,
      card_blur ?? 12,
      card_border_radius ?? 16,
      card_shadow || 'lg',
      card_glow ? 1 : 0,
      card_width ?? 500,
      card_max_width ?? 1200,
      card_padding ?? 32,
      card_margin_top ?? 48,
      card_margin_bottom ?? 48,
      card_border_width ?? 1,
      card_border_color || 'rgba(255,255,255,0.1)',
      card_bg_type || 'color',
      card_bg_color || 'rgba(255,255,255,0.05)',
      card_bg_image || '',
      button_style || 'glass',
      button_radius ?? 12,
      button_padding_y ?? 14,
      button_padding_x ?? 24,
      button_font_size ?? 16,
      button_font_weight ?? 500,
      button_border_width ?? 1,
      spacing || 'normal',
      animation || 'fade',
      accent_color || '#22c55e',
      safeCss,
      music_url || '',
      music_autoplay ? 1 : 0,
      music_loop ? 1 : 0,
      music_volume ?? 0.5,
      req.userId
    );

    const theme = db.prepare('SELECT * FROM theme_settings WHERE user_id = ?').get(req.userId);
    res.json({ theme });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get links
router.get('/links', authMiddleware, (req, res) => {
  try {
    const links = db.prepare('SELECT * FROM links WHERE user_id = ? ORDER BY position ASC').all(req.userId);
    res.json({ links });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add link
router.post('/links', authMiddleware, (req, res) => {
  try {
    const { title, url, icon } = req.body;
    if (!title || !url) return res.status(400).json({ error: 'Title and URL are required' });

    const maxPos = db.prepare('SELECT MAX(position) as max FROM links WHERE user_id = ?').get(req.userId);
    const position = (maxPos?.max ?? -1) + 1;
    const id = uuidv4();

    db.prepare('INSERT INTO links (id, user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, req.userId, title, url, icon || '', position);

    const link = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
    res.status(201).json({ link });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update link
router.put('/links/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, icon, is_active } = req.body;

    const link = db.prepare('SELECT * FROM links WHERE id = ? AND user_id = ?').get(id, req.userId);
    if (!link) return res.status(404).json({ error: 'Link not found' });

    db.prepare('UPDATE links SET title = ?, url = ?, icon = ?, is_active = ? WHERE id = ?')
      .run(title || link.title, url || link.url, icon ?? link.icon, is_active !== undefined ? (is_active ? 1 : 0) : link.is_active, id);

    const updated = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
    res.json({ link: updated });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete link
router.delete('/links/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const link = db.prepare('SELECT * FROM links WHERE id = ? AND user_id = ?').get(id, req.userId);
    if (!link) return res.status(404).json({ error: 'Link not found' });
    db.prepare('DELETE FROM links WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder links
router.put('/links/reorder', authMiddleware, (req, res) => {
  try {
    const { order } = req.body; // array of ids in new order
    if (!Array.isArray(order)) return res.status(400).json({ error: 'Order must be an array' });

    const updatePos = db.prepare('UPDATE links SET position = ? WHERE id = ? AND user_id = ?');
    const transaction = db.transaction(() => {
      order.forEach((id, index) => {
        updatePos.run(index, id, req.userId);
      });
    });
    transaction();

    const links = db.prepare('SELECT * FROM links WHERE user_id = ? ORDER BY position ASC').all(req.userId);
    res.json({ links });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get social links
router.get('/socials', authMiddleware, (req, res) => {
  try {
    const socials = db.prepare('SELECT * FROM social_links WHERE user_id = ? ORDER BY position ASC').all(req.userId);
    res.json({ socials });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add social link
router.post('/socials', authMiddleware, (req, res) => {
  try {
    const { platform, url } = req.body;
    if (!platform || !url) return res.status(400).json({ error: 'Platform and URL required' });

    const maxPos = db.prepare('SELECT MAX(position) as max FROM social_links WHERE user_id = ?').get(req.userId);
    const position = (maxPos?.max ?? -1) + 1;
    const id = uuidv4();

    db.prepare('INSERT INTO social_links (id, user_id, platform, url, position) VALUES (?, ?, ?, ?, ?)')
      .run(id, req.userId, platform, url, position);

    const social = db.prepare('SELECT * FROM social_links WHERE id = ?').get(id);
    res.status(201).json({ social });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete social link
router.delete('/socials/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const social = db.prepare('SELECT * FROM social_links WHERE id = ? AND user_id = ?').get(id, req.userId);
    if (!social) return res.status(404).json({ error: 'Social link not found' });
    db.prepare('DELETE FROM social_links WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
