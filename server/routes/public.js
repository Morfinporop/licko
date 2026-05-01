import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

const router = Router();

// Get public bio page by username
router.get('/:username', (req, res) => {
  try {
    const { username } = req.params;

    const user = db.prepare('SELECT id, username FROM users WHERE LOWER(username) = LOWER(?)').get(username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id);
    if (!profile || !profile.is_published) {
      return res.status(404).json({ error: 'Profile not found or not published' });
    }

    // Track unique views
    const viewerIp = req.ip || req.connection.remoteAddress;
    const fingerprint = req.headers['user-agent'] || '';
    
    try {
      const viewId = uuidv4();
      db.prepare('INSERT INTO profile_views (id, user_id, viewer_ip, viewer_fingerprint) VALUES (?, ?, ?, ?)')
        .run(viewId, user.id, viewerIp, fingerprint);
      
      // Increment unique views
      db.prepare('UPDATE profiles SET unique_views = unique_views + 1 WHERE user_id = ?').run(user.id);
    } catch {
      // Already viewed by this IP/fingerprint combo - just increment total views
    }

    // Always increment total view count
    db.prepare('UPDATE profiles SET views = views + 1 WHERE user_id = ?').run(user.id);

    const links = db.prepare('SELECT * FROM links WHERE user_id = ? AND is_active = 1 ORDER BY position ASC').all(user.id);
    const socials = db.prepare('SELECT * FROM social_links WHERE user_id = ? ORDER BY position ASC').all(user.id);
    const theme = db.prepare('SELECT * FROM theme_settings WHERE user_id = ?').get(user.id);
    const playlist = db.prepare('SELECT * FROM music_playlist WHERE user_id = ? ORDER BY position ASC').all(user.id);
    const userData = db.prepare('SELECT role, vip_status FROM users WHERE id = ?').get(user.id);

    res.json({
      username: user.username,
      profile: { ...profile, views: profile.views + 1 },
      links,
      socials,
      theme: theme || {},
      playlist: playlist || [],
      role: userData?.role || 'user',
      vip_status: userData?.vip_status || 0
    });
  } catch (err) {
    console.error('Public profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Track link click
router.post('/:username/click/:linkId', (req, res) => {
  try {
    const { username, linkId } = req.params;
    const user = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(username);
    if (!user) return res.status(404).json({ error: 'Not found' });

    db.prepare('UPDATE links SET click_count = click_count + 1 WHERE id = ? AND user_id = ?')
      .run(linkId, user.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
