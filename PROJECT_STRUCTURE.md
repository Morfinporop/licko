# Project Structure — BioLink

Complete overview of the BioLink project file structure and architecture.

## 📁 Root Directory

```
biolink/
├── server/              # Backend (Node.js + Express)
├── src/                 # Frontend (React + TypeScript)
├── dist/                # Built frontend (generated)
├── data/                # Database & uploads (generated)
├── public/              # Static assets
├── node_modules/        # Dependencies
├── package.json         # Project config
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
└── README.md            # Main documentation
```

---

## 🖥️ Backend Structure (`server/`)

```
server/
├── index.js             # Express server entry point
├── db.js                # Database setup & schema
├── middleware/
│   └── auth.js          # JWT authentication middleware
└── routes/
    ├── auth.js          # Authentication endpoints
    ├── profile.js       # Profile & theme management
    └── public.js        # Public bio pages
```

### `server/index.js`
- Express app setup
- CORS configuration
- Rate limiting
- Static file serving
- API route mounting
- SPA fallback handling

### `server/db.js`
- SQLite database initialization
- Table schemas (users, profiles, links, social_links, theme_settings)
- Database connection export

### `server/middleware/auth.js`
- JWT token generation
- Token verification
- Auth middleware for protected routes

### `server/routes/auth.js`
**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/check-username/:username` - Check availability

### `server/routes/profile.js`
**Endpoints:**
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/avatar` - Upload avatar
- `POST /api/profile/bg-image` - Upload background
- `GET /api/profile/theme` - Get theme settings
- `PUT /api/profile/theme` - Update theme
- `GET /api/profile/links` - Get links
- `POST /api/profile/links` - Add link
- `PUT /api/profile/links/:id` - Update link
- `DELETE /api/profile/links/:id` - Delete link
- `PUT /api/profile/links/reorder` - Reorder links
- `GET /api/profile/socials` - Get social links
- `POST /api/profile/socials` - Add social
- `DELETE /api/profile/socials/:id` - Delete social

### `server/routes/public.js`
**Endpoints:**
- `GET /api/public/:username` - Get public bio page
- `POST /api/public/:username/click/:linkId` - Track click

---

## ⚛️ Frontend Structure (`src/`)

```
src/
├── components/
│   ├── editor/          # Editor-specific components
│   │   ├── ProfileTab.tsx
│   │   ├── LinksTab.tsx
│   │   ├── SocialsTab.tsx
│   │   └── ThemeTab.tsx
│   ├── ui/              # Reusable UI components
│   │   ├── GlassCard.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Navbar.tsx
│   │   └── Ticker.tsx
│   └── BioPreview.tsx   # Live preview component
├── lib/
│   ├── api.ts           # Axios API client
│   └── socialIcons.tsx  # Social platform icons
├── pages/
│   ├── HomePage.tsx     # Landing page
│   ├── AuthPage.tsx     # Login/Register
│   ├── DashboardPage.tsx
│   ├── EditorPage.tsx   # Bio editor
│   ├── PublicBioPage.tsx
│   └── NotFoundPage.tsx
├── store/
│   └── authStore.ts     # Zustand auth store
├── utils/
│   └── cn.ts            # Tailwind class merger
├── App.tsx              # Main app with routing
├── main.tsx             # React entry point
├── index.css            # Global styles
└── vite-env.d.ts        # Vite type definitions
```

### Components Breakdown

#### `components/editor/`
**ProfileTab.tsx**
- Display name, bio editing
- Avatar upload
- Publish toggle

**LinksTab.tsx**
- Link list with drag-and-drop
- Add/edit/delete links
- Icon picker
- Active/inactive toggle

**SocialsTab.tsx**
- Social platform selector
- Add/remove social links
- 12 supported platforms

**ThemeTab.tsx**
- Visual mode: Background, cards, buttons, spacing
- Code mode: Custom CSS editor
- Live settings update

#### `components/ui/`
**GlassCard.tsx**
- Glassmorphism card component
- Optional glow effect
- Hover animations

**Button.tsx**
- 4 variants: primary, secondary, ghost, danger
- 3 sizes: sm, md, lg
- Loading state

**Input.tsx / Textarea.tsx**
- Form inputs with labels
- Error/hint display
- Icon support

**Navbar.tsx**
- App navigation
- Auth status display
- Responsive menu

**Ticker.tsx**
- Animated ticker/marquee
- Studio names display

#### `components/BioPreview.tsx`
- Live preview of bio page
- Theme application
- Link rendering

### Pages Breakdown

**HomePage.tsx**
- Landing page
- Features showcase
- Hero section
- CTA buttons

**AuthPage.tsx**
- Login/Register forms
- Username validation
- JWT handling

**DashboardPage.tsx**
- User stats
- Quick actions
- Profile summary
- Links overview

**EditorPage.tsx**
- Tab navigation
- Split view (editor + preview)
- Real-time updates

**PublicBioPage.tsx**
- Public bio display
- Theme rendering
- Click tracking
- View counter

**NotFoundPage.tsx**
- 404 error page
- Home link

### Library Files

**lib/api.ts**
- Axios instance
- API endpoints
- Request/response interceptors
- TypeScript types

**lib/socialIcons.tsx**
- SVG icons for social platforms
- Platform configuration
- Icon getter function

### State Management

**store/authStore.ts**
- Zustand store
- User state
- Token management
- Login/logout

---

## 🗄️ Database (`data/`)

```
data/
├── biolink.db           # SQLite database
├── biolink.db-shm       # Shared memory file
├── biolink.db-wal       # Write-ahead log
└── uploads/             # User uploads
    ├── {userId}-avatar-{timestamp}.jpg
    └── {userId}-bg-{timestamp}.jpg
```

### Database Schema

**users**
```sql
id TEXT PRIMARY KEY
email TEXT UNIQUE
password_hash TEXT
username TEXT UNIQUE
created_at TEXT
updated_at TEXT
```

**profiles**
```sql
id TEXT PRIMARY KEY
user_id TEXT (FK → users.id)
display_name TEXT
bio TEXT
avatar_url TEXT
views INTEGER
is_published INTEGER
created_at TEXT
updated_at TEXT
```

**links**
```sql
id TEXT PRIMARY KEY
user_id TEXT (FK → users.id)
title TEXT
url TEXT
icon TEXT
position INTEGER
is_active INTEGER
click_count INTEGER
created_at TEXT
```

**social_links**
```sql
id TEXT PRIMARY KEY
user_id TEXT (FK → users.id)
platform TEXT
url TEXT
position INTEGER
created_at TEXT
```

**theme_settings**
```sql
id TEXT PRIMARY KEY
user_id TEXT (FK → users.id)
bg_type TEXT
bg_gradient TEXT
bg_color TEXT
bg_image_url TEXT
bg_overlay_opacity REAL
card_opacity REAL
card_blur INTEGER
card_border_radius INTEGER
card_shadow TEXT
card_glow INTEGER
button_style TEXT
button_radius INTEGER
spacing TEXT
animation TEXT
accent_color TEXT
custom_css TEXT
created_at TEXT
updated_at TEXT
```

---

## 📦 Built Files (`dist/`)

```
dist/
├── index.html           # Entry HTML
├── assets/
│   ├── index-[hash].css # Bundled CSS
│   └── index-[hash].js  # Bundled JS
└── [static files]       # Copied from public/
```

**Build process:**
1. `npm run build` → Vite builds frontend
2. Outputs to `dist/`
3. Server serves from `dist/` in production

---

## 🔧 Configuration Files

### `package.json`
- Dependencies
- Scripts (dev, build, start)
- Project metadata

### `vite.config.ts`
- Vite configuration
- React plugin
- Tailwind plugin
- Path aliases (@/ → src/)
- Build settings

### `tsconfig.json`
- TypeScript compiler options
- Path mappings
- JSX configuration

### `.env` (not in repo)
```env
PORT=8080
NODE_ENV=production
JWT_SECRET=your-secret-here
ALLOWED_ORIGINS=https://your-domain.com
DATA_DIR=./data
UPLOADS_DIR=./data/uploads
```

### `railway.json`
- Railway deployment config
- Build command
- Start command
- Restart policy

---

## 🚦 Request Flow

### 1. User Registration
```
Browser → POST /api/auth/register
       ↓
   authRoutes.js (validate input)
       ↓
   db.js (create user, profile, theme)
       ↓
   auth.js (generate JWT)
       ↓
   Response with token & user
```

### 2. Protected Request (e.g., Add Link)
```
Browser → POST /api/profile/links
       ↓
   auth middleware (verify JWT)
       ↓
   profileRoutes.js (add link to DB)
       ↓
   Response with new link
```

### 3. Public Bio Page
```
Browser → GET /api/public/username
       ↓
   publicRoutes.js (fetch profile, links, theme)
       ↓
   db.js (increment views)
       ↓
   Response with all data
       ↓
   PublicBioPage.tsx (render with theme)
```

### 4. SPA Navigation
```
Browser → GET /dashboard
       ↓
   server/index.js (SPA fallback)
       ↓
   Serve dist/index.html
       ↓
   React Router handles /dashboard
       ↓
   DashboardPage.tsx renders
```

---

## 🔐 Security Layers

1. **Input Validation** - Both client & server
2. **Prepared Statements** - SQL injection prevention
3. **JWT Tokens** - Stateless auth
4. **Bcrypt Hashing** - Password security
5. **Rate Limiting** - Brute force protection
6. **CORS** - Origin restrictions
7. **CSS Sanitization** - XSS prevention
8. **File Upload Limits** - DoS prevention

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─── Static Files ────→ dist/
       │
       ├─── Uploads ─────────→ /uploads
       │
       ├─── API Requests ────→ /api/*
       │                        │
       │                        ├─→ /api/auth/*
       │                        ├─→ /api/profile/*
       │                        └─→ /api/public/*
       │                             │
       │                             ↓
       │                       ┌──────────┐
       │                       │   DB     │
       │                       │ (SQLite) │
       │                       └──────────┘
       │
       └─── SPA Routes ───────→ React Router
```

---

## 🎨 Styling Architecture

**Tailwind CSS 4**
- Utility-first CSS
- Custom animations in `index.css`
- Dark theme colors
- Responsive breakpoints

**Glassmorphism**
- backdrop-filter: blur
- Semi-transparent backgrounds
- Layered depth

**Color Palette**
- Background: #050505, #0a0a0a
- Primary: #22c55e (green-500)
- Text: white, gray-400, gray-500
- Borders: white/10, white/20

---

## 🧪 Testing Structure

**Manual Testing Checklist:**
- Auth flow (register, login, logout)
- Profile editing
- Link CRUD operations
- Theme customization
- File uploads
- Public page display
- Mobile responsiveness

**Future: Automated Tests**
- Unit tests (components)
- Integration tests (API)
- E2E tests (Playwright/Cypress)

---

## 📈 Performance Optimization

- **Code Splitting**: React lazy loading
- **Image Optimization**: Max file sizes
- **Bundle Minification**: Vite production build
- **Database Indexing**: Unique constraints
- **Static Caching**: Express static middleware
- **Gzip Compression**: Built-in server compression

---

## 🔄 Development Workflow

```bash
# 1. Make changes
edit src/components/...

# 2. Test locally
npm run dev (frontend)
npm run dev:server (backend)

# 3. Build
npm run build

# 4. Test production
npm start

# 5. Deploy
git push (triggers Railway deploy)
```

---

## 📚 Key Dependencies

**Frontend:**
- react 19.2.3
- react-router-dom 7.14.2
- zustand 5.0.12
- axios 1.15.2
- @dnd-kit/* 6.3.1+
- react-hot-toast 2.6.0

**Backend:**
- express 5.2.1
- better-sqlite3 12.9.0
- bcryptjs 3.0.3
- jsonwebtoken 9.0.3
- multer 2.1.1
- express-rate-limit 8.4.1

**Build Tools:**
- vite 7.2.4
- typescript 5.9.3
- tailwindcss 4.1.17

---

**For more details, see individual files or the main [README.md](README.md)**
