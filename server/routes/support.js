import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/ticket', (req, res) => {
  try {
    const { email, subject, message } = req.body;
    if (!email || !subject || !message) {
      return res.status(400).json({ error: 'Email, subject, and message are required' });
    }

    const id = uuidv4();
    const userId = req.headers.authorization ? null : null;
    db.prepare('INSERT INTO support_tickets (id, user_id, email, subject, message) VALUES (?, ?, ?, ?, ?)')
      .run(id, userId, email.toLowerCase(), subject, message);

    res.status(201).json({ success: true, ticketId: id });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/feedback', (req, res) => {
  try {
    const { email, content, kind } = req.body;
    if (!content) return res.status(400).json({ error: 'Content required' });
    const id = uuidv4();
    db.prepare('INSERT INTO feedback_ideas (id, email, content, kind) VALUES (?, ?, ?, ?)')
      .run(id, (email || '').toLowerCase(), content, kind || 'idea');
    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/faq', (req, res) => {
  res.json({
    faq: [
      { q: 'Что такое BioLink?', a: 'BioLink - это сервис для создания персональной страницы со ссылками и контактами.' },
      { q: 'Как получить VIP?', a: 'VIP выдается администратором по заявке через поддержку.' },
      { q: 'Как связаться с поддержкой?', a: 'Напишите в форму поддержки или на biolinksupport@gmail.com.' }
    ]
  });
});

router.get('/legal-docs', (req, res) => {
  res.json({
    email: 'biolinksupport@gmail.com',
    terms: 'Используя сервис, вы соглашаетесь не размещать запрещенный контент, спам и незаконные материалы. Администрация может ограничить доступ в случае нарушений.',
    privacy: 'Мы храним только необходимые данные для работы сервиса: email, username, контент профиля и статистику просмотров. Данные не передаются третьим лицам, кроме случаев, предусмотренных законом.'
  });
});

// Admin endpoints
router.get('/admin/tickets', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tickets = db.prepare('SELECT * FROM support_tickets ORDER BY created_at DESC').all();
    res.json({ tickets });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/admin/tickets/:id', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const { id } = req.params;
    const { status, admin_reply } = req.body;
    db.prepare('UPDATE support_tickets SET status = ?, admin_reply = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .run(status || 'open', admin_reply || '', id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/admin/feedback', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const feedback = db.prepare('SELECT * FROM feedback_ideas ORDER BY created_at DESC').all();
    res.json({ feedback });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;