# Changelog

All notable changes to BioLink will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### 🎉 Initial Release

Complete fullstack bio page builder with modern glassmorphism UI.

### ✨ Features

**Authentication**
- User registration with email and unique username
- JWT-based authentication
- Secure password hashing with bcrypt
- Username availability check

**Profile Management**
- Custom display name and bio
- Avatar upload (JPG, PNG, GIF, WEBP up to 5MB)
- Profile visibility toggle (published/unpublished)
- View counter for bio pages

**Links System**
- Unlimited custom links
- Drag-and-drop reordering
- Icon picker with 20+ options
- Show/hide individual links
- Click tracking analytics
- Active/inactive status

**Social Links**
- Support for 12 platforms (Twitter, Instagram, GitHub, LinkedIn, YouTube, TikTok, Telegram, Discord, Twitch, Spotify, Website, Email)
- SVG icons for each platform
- Direct links to social profiles

**Visual Theme Editor**
- Background options:
  - 5 gradient presets
  - Solid colors with color picker
  - Custom image upload (up to 10MB)
  - Overlay opacity control
- Card customization:
  - Opacity slider (0-50%)
  - Blur strength (0-30px)
  - Border radius (0-40px)
  - Shadow presets (none, sm, md, lg, xl)
  - Optional green glow effect
- Button styles:
  - Glass, Solid, Outline, Minimal
  - Custom border radius
- Layout options:
  - Spacing: Compact, Normal, Relaxed
  - Animations: None, Fade, Slide, Scale
- Accent color picker
- Live preview

**Custom CSS Mode**
- Write custom CSS for advanced styling
- Scoped to bio page only
- Security filtering (blocks @import, javascript:, etc.)
- Syntax-safe sanitization

**Analytics**
- Page view tracking
- Link click tracking
- Stats dashboard

**UI/UX**
- Glassmorphism design
- Dark theme with green accents
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Live preview while editing
- Ticker animation with studio names

**Public Bio Pages**
- Clean, customizable URLs: `/u/username`
- Fast loading with optimized assets
- SEO-friendly
- Shareable links

### 🛠️ Technical

**Frontend**
- React 19 with TypeScript
- Vite 7 for fast builds
- TailwindCSS 4
- React Router for navigation
- Zustand for state management
- Axios for API calls
- React Hot Toast for notifications
- DnD Kit for drag-and-drop

**Backend**
- Node.js 22
- Express 5
- Better-SQLite3 database
- JWT authentication
- Multer for file uploads
- Bcrypt password hashing
- Rate limiting protection
- CORS configuration

**Security**
- Password hashing (12 rounds)
- JWT tokens (30-day expiry)
- Input validation
- SQL injection protection
- XSS prevention
- CSS sanitization
- Rate limiting (500/15min general, 20/15min auth)

**Deployment**
- Railway-ready configuration
- Health check endpoint
- Environment variable support
- Persistent SQLite storage
- Static file serving

### 📚 Documentation

- Comprehensive README
- API documentation (API.md)
- Deployment guide (DEPLOYMENT.md)
- Contributing guidelines (CONTRIBUTING.md)
- .env.example with all variables
- Inline code comments

### 🎨 Design

- Black and green color scheme
- Glassmorphism effects with blur and transparency
- Smooth animations
- Responsive design
- Accessibility considerations

### 🚀 Performance

- Optimized bundle size
- Lazy loading
- Efficient database queries
- Image optimization
- Fast page loads

---

## [Unreleased]

### Planned Features

- [ ] Dark/light theme toggle
- [ ] Multiple bio pages per user
- [ ] Advanced analytics dashboard
- [ ] QR code generation
- [ ] Export profile data
- [ ] Theme marketplace
- [ ] Link scheduling
- [ ] Custom domains
- [ ] API webhooks
- [ ] Team collaboration

### Known Issues

- None currently

---

## Version History

- **1.0.0** (2024-01-XX) - Initial release

---

**Note**: This is a production-ready application. All core features are fully functional and tested.
