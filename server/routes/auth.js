import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

function validateUsername(username) {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(username);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password and username are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({ error: 'Username must be 3-30 chars, only letters, numbers, _ and -' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const existingUsername = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(username);
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    const profileId = uuidv4();
    const themeId = uuidv4();

    // Check if this is the owner email
    const role = email.toLowerCase() === 'energoferon41@gmail.com' ? 'owner' : 'user';
    const vipStatus = email.toLowerCase() === 'energoferon41@gmail.com' ? 1 : 0;

    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, username, role, vip_status) VALUES (?, ?, ?, ?, ?, ?)
    `);
    const insertProfile = db.prepare(`
      INSERT INTO profiles (id, user_id, display_name) VALUES (?, ?, ?)
    `);
    const insertTheme = db.prepare(`
      INSERT INTO theme_settings (id, user_id) VALUES (?, ?)
    `);

    const transaction = db.transaction(() => {
      insertUser.run(userId, email.toLowerCase(), passwordHash, username, role, vipStatus);
      insertProfile.run(profileId, userId, username);
      insertTheme.run(themeId, userId);
    });

    transaction();

    const token = generateToken(userId);
    res.status(201).json({
      token,
      user: { id: userId, email: email.toLowerCase(), username }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, username, role, vip_status, is_banned, created_at FROM users WHERE id = ?').get(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.is_banned) return res.status(403).json({ error: 'Account banned', reason: user.ban_reason });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check username availability
router.get('/check-username/:username', (req, res) => {
  const { username } = req.params;
  if (!validateUsername(username)) {
    return res.json({ available: false, reason: 'Invalid format' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(username);
  res.json({ available: !existing });
});

export default router;
