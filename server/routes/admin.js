import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Admin middleware
function adminMiddleware(req, res, next) {
  const user = db.prepare('SELECT role, is_banned FROM users WHERE id = ?').get(req.userId);
  if (!user || user.is_banned) {
    return res.status(403).json({ error: 'Access denied' });
  }
  if (user.role !== 'owner' && user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  req.userRole = user.role;
  next();
}

// Owner-only middleware
function ownerMiddleware(req, res, next) {
  const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  if (!user || user.role !== 'owner') {
    return res.status(403).json({ error: 'Owner access required' });
  }
  next();
}

// Log admin action
function logAction(adminId, action, targetUserId = '', details = '') {
  const id = uuidv4();
  db.prepare('INSERT INTO admin_logs (id, admin_id, action, target_user_id, details) VALUES (?, ?, ?, ?, ?)')
    .run(id, adminId, action, targetUserId, details);
}

// Get all users
router.get('/users', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let query = `
      SELECT u.id, u.email, u.username, u.role, u.vip_status, u.is_banned, u.ban_reason, u.created_at,
             p.views, p.unique_views, p.is_published,
             COUNT(l.id) as link_count
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN links l ON u.id = l.user_id
    `;

    const params = [];
    if (search) {
      query += ' WHERE u.email LIKE ? OR u.username LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const users = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user details
router.get('/users/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare(`
      SELECT u.*, p.*, 
             (SELECT COUNT(*) FROM links WHERE user_id = u.id) as link_count,
             (SELECT COUNT(*) FROM social_links WHERE user_id = u.id) as social_count
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `).get(id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const links = db.prepare('SELECT * FROM links WHERE user_id = ? ORDER BY position').all(id);
    const socials = db.prepare('SELECT * FROM social_links WHERE user_id = ? ORDER BY position').all(id);
    const theme = db.prepare('SELECT * FROM theme_settings WHERE user_id = ?').get(id);

    res.json({ user, links, socials, theme });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ban user
router.post('/users/:id/ban', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const targetUser = db.prepare('SELECT email, role FROM users WHERE id = ?').get(id);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    // Owners cannot be banned
    if (targetUser.role === 'owner') {
      return res.status(403).json({ error: 'Cannot ban owner' });
    }

    // Only owner can ban admins
    if (targetUser.role === 'admin' && req.userRole !== 'owner') {
      return res.status(403).json({ error: 'Only owner can ban admins' });
    }

    db.prepare('UPDATE users SET is_banned = 1, ban_reason = ? WHERE id = ?')
      .run(reason || 'Violated terms of service', id);

    logAction(req.userId, 'BAN_USER', id, reason);

    res.json({ success: true, message: 'User banned' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unban user
router.post('/users/:id/unban', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE users SET is_banned = 0, ban_reason = ? WHERE id = ?').run('', id);
    logAction(req.userId, 'UNBAN_USER', id);
    res.json({ success: true, message: 'User unbanned' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Grant VIP
router.post('/users/:id/vip', authMiddleware, ownerMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { grant } = req.body; // true to grant, false to revoke

    db.prepare('UPDATE users SET vip_status = ? WHERE id = ?').run(grant ? 1 : 0, id);
    logAction(req.userId, grant ? 'GRANT_VIP' : 'REVOKE_VIP', id);

    res.json({ success: true, message: grant ? 'VIP granted' : 'VIP revoked' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Grant VIP by email
router.post('/vip/grant-by-email', authMiddleware, ownerMiddleware, (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const user = db.prepare('SELECT id, username, email FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) return res.status(404).json({ error: 'User not found' });

    db.prepare('UPDATE users SET vip_status = 1 WHERE id = ?').run(user.id);
    logAction(req.userId, 'GRANT_VIP_BY_EMAIL', user.id, email);

    res.json({ success: true, message: `VIP granted to ${user.username}`, user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user content
router.delete('/users/:id/content/:type/:contentId', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id, type, contentId } = req.params;

    if (type === 'link') {
      db.prepare('DELETE FROM links WHERE id = ? AND user_id = ?').run(contentId, id);
    } else if (type === 'social') {
      db.prepare('DELETE FROM social_links WHERE id = ? AND user_id = ?').run(contentId, id);
    } else {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    logAction(req.userId, `DELETE_${type.toUpperCase()}`, id, contentId);
    res.json({ success: true, message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile (admin override)
router.put('/users/:id/profile', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, bio, is_published } = req.body;

    db.prepare('UPDATE profiles SET display_name = ?, bio = ?, is_published = ? WHERE user_id = ?')
      .run(display_name || '', bio || '', is_published ? 1 : 0, id);

    logAction(req.userId, 'UPDATE_USER_PROFILE', id);
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get admin logs
router.get('/logs', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const logs = db.prepare(`
      SELECT l.*, u.username as admin_username, u2.username as target_username
      FROM admin_logs l
      LEFT JOIN users u ON l.admin_id = u.id
      LEFT JOIN users u2 ON l.target_user_id = u2.id
      ORDER BY l.created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM admin_logs').get().count;

    res.json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get statistics
router.get('/stats', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalVips = db.prepare('SELECT COUNT(*) as count FROM users WHERE vip_status = 1').get().count;
    const totalBanned = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_banned = 1').get().count;
    const totalProfiles = db.prepare('SELECT COUNT(*) as count FROM profiles WHERE is_published = 1').get().count;
    const totalLinks = db.prepare('SELECT COUNT(*) as count FROM links').get().count;
    const totalViews = db.prepare('SELECT SUM(views) as total FROM profiles').get().total || 0;

    const recentUsers = db.prepare(`
      SELECT id, username, email, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all();

    res.json({
      totalUsers,
      totalVips,
      totalBanned,
      totalProfiles,
      totalLinks,
      totalViews,
      recentUsers
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
