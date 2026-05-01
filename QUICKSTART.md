# Quick Start Guide — BioLink

Get BioLink up and running in 5 minutes!

## 🚀 Option 1: Local Development (Fastest)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
JWT_SECRET=change-this-to-random-string
```

### 3. Build & Start
```bash
npm run build
npm start
```

**Done!** Open http://localhost:8080

---

## 🌐 Option 2: Deploy to Railway (Production)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/biolink.git
git push -u origin main
```

### 2. Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects and deploys

### 3. Set Environment Variables

In Railway dashboard, add:
```env
NODE_ENV=production
JWT_SECRET=<your-secure-random-string>
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Done!** Your app is live at `https://your-app.up.railway.app`

---

## 💻 Development Mode

Run frontend and backend separately for hot reload:

**Terminal 1 (Frontend)**:
```bash
npm run dev
```
Opens at http://localhost:5173

**Terminal 2 (Backend)**:
```bash
npm run dev:server
```
Runs at http://localhost:8080

---

## 📝 First Steps After Setup

### 1. Register Account
- Visit your app URL
- Click "Get Started"
- Enter email, username, password
- Click "Create Account"

### 2. Create Bio Page
- You're automatically logged in
- Click "Go to Dashboard"
- Click "Edit Page"

### 3. Customize Profile
- **Profile Tab**: Add avatar, name, bio
- **Links Tab**: Add your links (portfolio, social, etc.)
- **Socials Tab**: Connect social media
- **Theme Tab**: Customize colors, effects, layout

### 4. Share Your Page
- Your bio page: `/u/your-username`
- Click "Copy" to copy URL
- Share on social media, email signature, etc.

---

## 🎨 Customization Tips

### Theme Presets
Try these gradient combinations:
- **Dark Green**: Default, subtle green tint
- **Deep Black**: Pure black for minimalists
- **Emerald**: Rich green gradient
- **Matrix**: Classic matrix green

### Button Styles
- **Glass**: Transparent with blur (default)
- **Solid**: Bold green buttons
- **Outline**: Border-only
- **Minimal**: Text-only links

### Spacing
- **Compact**: Tight spacing, more links visible
- **Normal**: Balanced (recommended)
- **Relaxed**: Spacious, focus on few links

### Animations
- **Fade**: Smooth fade-in
- **Slide**: Slide up effect
- **Scale**: Zoom in
- **None**: Instant (best for slow connections)

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Development (frontend)
npm run dev

# Development (backend)
npm run dev:server

# Build for production
npm run build

# Start production server
npm start

# Preview production build
npm run preview
```

---

## 📱 Test on Mobile

### During Development
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from phone: `http://YOUR_IP:8080`

### After Deployment
Just visit your Railway URL on mobile browser.

---

## ✅ Verification Checklist

- [ ] App loads at `http://localhost:8080`
- [ ] Can register new account
- [ ] Can login
- [ ] Can upload avatar
- [ ] Can add/remove links
- [ ] Can drag-and-drop reorder links
- [ ] Can add social links
- [ ] Can change theme settings
- [ ] Public bio page works: `/u/username`
- [ ] Responsive on mobile

---

## 🆘 Troubleshooting

### Port 8080 already in use
```bash
# Change PORT in .env
PORT=3000
```

### Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database errors
```bash
# Delete database and restart
rm -rf data/
npm start
```

### Avatar upload not working
Check that `data/uploads/` directory exists (created automatically on first upload).

---

## 📚 Next Steps

- Read full [README.md](README.md)
- Check [API Documentation](API.md)
- Review [Deployment Guide](DEPLOYMENT.md)
- Explore customization options
- Share your bio page!

---

## 🎯 Example Bio Page

Visit: `http://localhost:8080/u/demo` (after creating `demo` account)

Try creating:
- Portfolio site
- Social media hub
- Link collection
- Business card
- Event page
- Contact page

---

## 💡 Tips

1. **Unique Username**: Choose memorable username (it's your URL!)
2. **Avatar**: Use square image (500x500px or larger)
3. **Bio**: Keep it short and engaging
4. **Links**: Order by importance (drag to reorder)
5. **Theme**: Match your brand colors
6. **Preview**: Always check preview before publishing

---

## 🌟 Features Showcase

**What you can build:**
- Personal portfolio hub
- Social media aggregator
- Business link page
- Event registration
- Product showcase
- Creator hub
- Contact card
- Resource library

**Customization power:**
- 5+ background options
- 4 button styles
- Custom CSS for unlimited designs
- 20+ link icons
- 12 social platforms

---

## ⚡ Performance

Average load time: **< 1 second**  
Optimized bundle: **~438KB JS + 50KB CSS**  
Database: **SQLite** (fast, no external DB needed)

---

**Ready to go?** Start creating your bio page! 🚀

For detailed documentation, see [README.md](README.md)
