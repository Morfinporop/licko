# API Documentation — BioLink

Complete API reference for BioLink backend.

**Base URL**: `http://localhost:8080/api` (development) or `https://your-domain.up.railway.app/api` (production)

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Token is returned on successful login/registration.

---

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

**Response (201)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

**Validation**:
- Email: valid email format
- Password: minimum 6 characters
- Username: 3-30 characters, letters, numbers, underscore, dash only

---

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

---

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "johndoe",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Check Username Availability

```http
GET /api/auth/check-username/johndoe
```

**Response (200)**:
```json
{
  "available": false,
  "reason": "Username already taken"
}
```

---

### Profile Management

#### Get Profile

```http
GET /api/profile
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "display_name": "John Doe",
    "bio": "Full-stack developer & designer",
    "avatar_url": "/uploads/avatar.jpg",
    "views": 1234,
    "is_published": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Update Profile

```http
PUT /api/profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "display_name": "John Doe",
  "bio": "Software engineer passionate about web development",
  "is_published": true
}
```

**Response (200)**:
```json
{
  "profile": {
    "id": "uuid",
    "display_name": "John Doe",
    "bio": "Software engineer passionate about web development",
    "is_published": 1,
    ...
  }
}
```

---

#### Upload Avatar

```http
POST /api/profile/avatar
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

avatar: [file]
```

**Response (200)**:
```json
{
  "avatar_url": "/uploads/user-id-avatar-1234567890.jpg"
}
```

**Limits**:
- Max size: 5MB
- Allowed formats: JPG, PNG, GIF, WEBP

---

#### Upload Background Image

```http
POST /api/profile/bg-image
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

bg_image: [file]
```

**Response (200)**:
```json
{
  "bg_image_url": "/uploads/user-id-bg-1234567890.jpg"
}
```

**Limits**:
- Max size: 10MB
- Allowed formats: JPG, PNG, GIF, WEBP

---

### Theme Settings

#### Get Theme

```http
GET /api/profile/theme
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "theme": {
    "id": "uuid",
    "user_id": "uuid",
    "bg_type": "gradient",
    "bg_gradient": "linear-gradient(135deg, #0a0a0a 0%, #0d1a0d 50%, #0a0a0a 100%)",
    "bg_color": "#0a0a0a",
    "bg_image_url": "",
    "bg_overlay_opacity": 0.5,
    "card_opacity": 0.15,
    "card_blur": 12,
    "card_border_radius": 16,
    "card_shadow": "lg",
    "card_glow": 0,
    "button_style": "glass",
    "button_radius": 12,
    "spacing": "normal",
    "animation": "fade",
    "accent_color": "#22c55e",
    "custom_css": "",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Update Theme

```http
PUT /api/profile/theme
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "bg_type": "gradient",
  "bg_gradient": "linear-gradient(135deg, #000 0%, #0d1a0d 100%)",
  "card_opacity": 0.2,
  "card_blur": 15,
  "button_style": "solid",
  "custom_css": ".bio-container { padding: 2rem; }"
}
```

**Response (200)**:
```json
{
  "theme": { ... }
}
```

**Custom CSS Security**:
Dangerous patterns are automatically filtered:
- `@import`
- `javascript:`
- `expression()`
- `behavior:`

---

### Links Management

#### Get All Links

```http
GET /api/profile/links
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "links": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Portfolio",
      "url": "https://johndoe.com",
      "icon": "🌐",
      "position": 0,
      "is_active": 1,
      "click_count": 42,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Add Link

```http
POST /api/profile/links
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "GitHub",
  "url": "https://github.com/johndoe",
  "icon": "🐙"
}
```

**Response (201)**:
```json
{
  "link": {
    "id": "uuid",
    "title": "GitHub",
    "url": "https://github.com/johndoe",
    "icon": "🐙",
    "position": 1,
    ...
  }
}
```

---

#### Update Link

```http
PUT /api/profile/links/{link_id}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "url": "https://newurl.com",
  "icon": "🔗",
  "is_active": false
}
```

**Response (200)**:
```json
{
  "link": { ... }
}
```

---

#### Delete Link

```http
DELETE /api/profile/links/{link_id}
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "success": true
}
```

---

#### Reorder Links

```http
PUT /api/profile/links/reorder
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "order": ["link-uuid-3", "link-uuid-1", "link-uuid-2"]
}
```

**Response (200)**:
```json
{
  "links": [ ... ]
}
```

---

### Social Links

#### Get Social Links

```http
GET /api/profile/socials
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "socials": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "platform": "github",
      "url": "https://github.com/johndoe",
      "position": 0,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Add Social Link

```http
POST /api/profile/socials
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "platform": "twitter",
  "url": "https://twitter.com/johndoe"
}
```

**Response (201)**:
```json
{
  "social": {
    "id": "uuid",
    "platform": "twitter",
    "url": "https://twitter.com/johndoe",
    ...
  }
}
```

**Supported Platforms**:
- twitter
- instagram
- github
- linkedin
- youtube
- tiktok
- telegram
- discord
- twitch
- spotify
- website
- email

---

#### Delete Social Link

```http
DELETE /api/profile/socials/{social_id}
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "success": true
}
```

---

### Public Endpoints

#### Get Public Bio Page

```http
GET /api/public/{username}
```

**Response (200)**:
```json
{
  "username": "johndoe",
  "profile": {
    "display_name": "John Doe",
    "bio": "Full-stack developer",
    "avatar_url": "/uploads/avatar.jpg",
    "views": 1235,
    ...
  },
  "links": [ ... ],
  "socials": [ ... ],
  "theme": { ... }
}
```

**Note**: Only returns published profiles with `is_published = 1`

---

#### Track Link Click

```http
POST /api/public/{username}/click/{link_id}
```

**Response (200)**:
```json
{
  "success": true
}
```

Increments `click_count` for analytics.

---

### Health Check

#### Health Endpoint

```http
GET /health
```

**Response (200)**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "BioLink"
}
```

Used for monitoring and uptime checks.

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

**General endpoints**: 500 requests per 15 minutes per IP

**Auth endpoints** (`/api/auth/*`): 20 requests per 15 minutes per IP

Rate limit headers:
```
RateLimit-Limit: 500
RateLimit-Remaining: 499
RateLimit-Reset: 1640000000
```

---

## Example Usage (JavaScript)

### Register & Login

```javascript
// Register
const response = await fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    username: 'johndoe'
  })
});

const { token, user } = await response.json();
localStorage.setItem('token', token);

// Use token for authenticated requests
const profileResponse = await fetch('http://localhost:8080/api/profile', {
  headers: { 
    'Authorization': `Bearer ${token}`
  }
});

const { profile } = await profileResponse.json();
```

### Upload Avatar

```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

const response = await fetch('http://localhost:8080/api/profile/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const { avatar_url } = await response.json();
```

---

## Database Schema

### users
- id (TEXT, PRIMARY KEY)
- email (TEXT, UNIQUE)
- password_hash (TEXT)
- username (TEXT, UNIQUE)
- created_at (TEXT)
- updated_at (TEXT)

### profiles
- id (TEXT, PRIMARY KEY)
- user_id (TEXT, FOREIGN KEY)
- display_name (TEXT)
- bio (TEXT)
- avatar_url (TEXT)
- views (INTEGER)
- is_published (INTEGER)
- created_at (TEXT)
- updated_at (TEXT)

### links
- id (TEXT, PRIMARY KEY)
- user_id (TEXT, FOREIGN KEY)
- title (TEXT)
- url (TEXT)
- icon (TEXT)
- position (INTEGER)
- is_active (INTEGER)
- click_count (INTEGER)
- created_at (TEXT)

### social_links
- id (TEXT, PRIMARY KEY)
- user_id (TEXT, FOREIGN KEY)
- platform (TEXT)
- url (TEXT)
- position (INTEGER)
- created_at (TEXT)

### theme_settings
- id (TEXT, PRIMARY KEY)
- user_id (TEXT, FOREIGN KEY)
- bg_type (TEXT)
- bg_gradient (TEXT)
- bg_color (TEXT)
- bg_image_url (TEXT)
- bg_overlay_opacity (REAL)
- card_opacity (REAL)
- card_blur (INTEGER)
- card_border_radius (INTEGER)
- card_shadow (TEXT)
- card_glow (INTEGER)
- button_style (TEXT)
- button_radius (INTEGER)
- spacing (TEXT)
- animation (TEXT)
- accent_color (TEXT)
- custom_css (TEXT)
- created_at (TEXT)
- updated_at (TEXT)

---

**For more information, see the main README.md**
