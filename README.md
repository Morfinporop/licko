# 🔗 BioLink — Personal Bio Page Builder

<div align="center">

![Status](https://img.shields.io/badge/status-production%20ready-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-22.22.2-green)
![License](https://img.shields.io/badge/license-MIT-orange)

**Create stunning bio pages with custom links, social profiles, and beautiful glassmorphism themes**

[Quick Start](#-quick-start) • [Features](#-features) • [Demo](#-demo) • [Deploy](#-deployment)

</div>

---

A modern, production-ready fullstack application for creating beautiful personal bio pages with custom links, social media profiles, and unique themes.

## 🚀 Features

- **User Authentication** - Register, login, JWT-based auth
- **Personal Bio Pages** - Create your custom bio page with unique username
- **Link Management** - Add unlimited links with drag-and-drop sorting
- **Social Links** - Connect all your social media profiles
- **Visual Theme Editor** - Customize background, cards, buttons, spacing, animations
- **Custom CSS** - Write your own CSS for advanced customization
- **Analytics** - View counter and link click tracking
- **Live Preview** - See changes in real-time
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Glassmorphism UI** - Modern dark theme with blur and transparency effects

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- React Router
- TailwindCSS 4
- Zustand (state management)
- Axios
- React Hot Toast
- DnD Kit (drag and drop)

**Backend:**
- Node.js 22
- Express
- Better-SQLite3
- JWT authentication
- Bcrypt password hashing
- Multer (file uploads)
- Rate limiting

## 📦 Installation

### Prerequisites
- Node.js 22.22.2 or higher
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd biolink
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

Edit `.env` and set your configuration:
- Change `JWT_SECRET` to a secure random string
- Adjust `PORT` if needed (default: 8080)

4. **Build frontend**
```bash
npm run build
```

5. **Start server**
```bash
npm start
```

The app will be available at `http://localhost:8080`

### Development Mode

Run frontend dev server (with hot reload):
```bash
npm run dev
```

Run backend server (with auto-restart):
```bash
npm run dev:server
```

## 🚂 Railway Deployment

This app is ready for one-click deployment on Railway.

### Deployment Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Railway**
- Go to [railway.app](https://railway.app)
- Click "New Project" → "Deploy from GitHub repo"
- Select your repository
- Railway will auto-detect the configuration

3. **Environment Variables**

Add these environment variables in Railway dashboard:

```env
NODE_ENV=production
JWT_SECRET=<generate-a-strong-random-secret>
ALLOWED_ORIGINS=https://deleteai.up.railway.app
```

To generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. **Domain Configuration**

Railway provides a domain like `deleteai.up.railway.app`. Your app will be automatically available there.

5. **Database & Uploads**

The app uses SQLite (Better-SQLite3) which stores data in files:
- Database: `./data/biolink.db`
- Uploads: `./data/uploads/`

Railway provides persistent volumes. Data persists across deployments.

## 📁 Project Structure

```
biolink/
├── server/                 # Backend code
│   ├── db.js              # Database setup & schema
│   ├── index.js           # Express server
│   ├── middleware/        # Auth middleware
│   └── routes/            # API routes
│       ├── auth.js        # Authentication routes
│       ├── profile.js     # Profile & theme management
│       └── public.js      # Public bio pages
├── src/                   # Frontend code
│   ├── components/        # React components
│   │   ├── editor/        # Editor tabs
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # API client & utilities
│   ├── pages/             # Page components
│   ├── store/             # Zustand store
│   └── App.tsx            # Main app with routing
├── data/                  # SQLite DB & uploads (generated)
├── dist/                  # Built frontend (generated)
├── .env                   # Environment variables (create from .env.example)
└── package.json
```

## 🔧 Configuration

### Server Configuration

Environment variables (`.env`):

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `*` |
| `DATA_DIR` | Database directory | `./data` |
| `UPLOADS_DIR` | Uploads directory | `./data/uploads` |

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)
- `GET /api/auth/check-username/:username` - Check username availability

**Profile Management (requires auth):**
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/avatar` - Upload avatar
- `GET /api/profile/theme` - Get theme settings
- `PUT /api/profile/theme` - Update theme
- `POST /api/profile/bg-image` - Upload background image

**Links (requires auth):**
- `GET /api/profile/links` - Get all links
- `POST /api/profile/links` - Add link
- `PUT /api/profile/links/:id` - Update link
- `DELETE /api/profile/links/:id` - Delete link
- `PUT /api/profile/links/reorder` - Reorder links

**Social Links (requires auth):**
- `GET /api/profile/socials` - Get social links
- `POST /api/profile/socials` - Add social link
- `DELETE /api/profile/socials/:id` - Delete social link

**Public:**
- `GET /api/public/:username` - Get public bio page
- `POST /api/public/:username/click/:linkId` - Track link click

**Health:**
- `GET /health` - Health check endpoint

## 🎨 Features Detail

### Visual Theme Editor

Customize your bio page with:
- **Background**: Gradient, solid color, or custom image
- **Card Style**: Opacity, blur, border radius, shadows, glow
- **Button Style**: Glass, solid, outline, or minimal
- **Spacing**: Compact, normal, or relaxed
- **Animations**: Fade, slide, scale, or none
- **Accent Color**: Custom color picker

### Custom CSS Mode

Write your own CSS that applies only to your bio page. Dangerous patterns like `@import`, `javascript:`, and `expression()` are automatically filtered for security.

### Drag & Drop Links

Reorder your links with intuitive drag-and-drop interface.

### Analytics

- Real-time view counter
- Click tracking for each link
- Statistics in dashboard

## 🔒 Security

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Protection against brute force
- **Input Validation**: All inputs validated and sanitized
- **SQL Injection Protection**: Prepared statements
- **XSS Protection**: CSS sanitization
- **CORS**: Configurable allowed origins

## 📱 Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard (protected)
- `/editor` - Bio page editor (protected)
- `/u/:username` - Public bio page

## 🐛 Troubleshooting

### Port already in use
```bash
# Change PORT in .env or kill the process
lsof -ti:8080 | xargs kill -9
```

### Database locked
SQLite uses file locking. Make sure only one instance is running.

### Uploads not working
Check that `data/uploads/` directory exists and has write permissions.

### CORS errors
Add your frontend URL to `ALLOWED_ORIGINS` in `.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💡 Credits

Built with modern web technologies and designed with glassmorphism aesthetics.

**Studios mentioned in ticker:**
MorStudio, Maicrosoft, FnStudio, GreenPixel Studio, VoidForge, BlackGlass Studio, NeonFrame, DarkMint, HexaCore, GlassCode, NightSignal Studio

---

Made with 💚 by the BioLink team
