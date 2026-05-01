# Testing Checklist — BioLink

Complete checklist for testing all features before deployment.

## ✅ Pre-Deployment Checklist

### Environment Setup
- [ ] `.env` file created from `.env.example`
- [ ] `JWT_SECRET` set to secure random string
- [ ] `NODE_ENV` set to `production` (for production)
- [ ] Dependencies installed (`npm install`)
- [ ] Project builds without errors (`npm run build`)

### Database
- [ ] `data/` directory exists (auto-created)
- [ ] `data/uploads/` directory exists (auto-created)
- [ ] Database tables created on first run
- [ ] Foreign keys working

---

## 🧪 Functional Testing

### 1. Authentication

#### Registration
- [ ] Navigate to `/register`
- [ ] Try registering with invalid email → Shows error
- [ ] Try registering with short password (< 6 chars) → Shows error
- [ ] Try registering with invalid username → Shows error
- [ ] Register with valid data → Success, auto-login, redirect to dashboard
- [ ] Try registering same email again → "Email already registered" error
- [ ] Try registering same username again → "Username already taken" error

#### Username Validation
- [ ] Type username in register form
- [ ] Real-time availability check works
- [ ] Green checkmark for available username
- [ ] Red X for taken username
- [ ] Usernames with special chars rejected (only letters, numbers, _, - allowed)

#### Login
- [ ] Navigate to `/login`
- [ ] Try login with wrong email → Error
- [ ] Try login with wrong password → Error
- [ ] Login with correct credentials → Success, redirect to dashboard
- [ ] Token stored in localStorage
- [ ] User data stored in localStorage

#### Session Persistence
- [ ] Login, refresh page → Still logged in
- [ ] Logout → Redirected to home
- [ ] Try accessing `/dashboard` while logged out → Redirected to `/login`
- [ ] Login again → Can access dashboard

---

### 2. Dashboard

#### Stats Display
- [ ] Profile card shows avatar (or default icon)
- [ ] Display name or username shown
- [ ] Bio shown (if set)
- [ ] View count displayed
- [ ] Links count correct
- [ ] Socials count correct
- [ ] Status shows "Live" or "Hidden" based on `is_published`

#### Public URL
- [ ] Copy URL button works
- [ ] URL format: `/u/username`
- [ ] Clicking "View Page" opens in new tab
- [ ] URL accessible

#### Quick Actions
- [ ] "Edit Bio Page" navigates to editor
- [ ] "Customize Theme" navigates to editor theme tab
- [ ] "View Public Page" opens bio page

#### Links Summary
- [ ] Shows first 4 links
- [ ] Click count displayed for each
- [ ] "Manage" button goes to editor
- [ ] Shows "No links yet" when empty

---

### 3. Profile Editor

#### Profile Tab
- [ ] Display name field editable
- [ ] Bio textarea editable
- [ ] Published toggle works
- [ ] Username field disabled (shows current username)
- [ ] Save button saves changes
- [ ] Success toast on save

#### Avatar Upload
- [ ] Click "Upload Photo" opens file picker
- [ ] Select image file (.jpg, .png, .gif, .webp)
- [ ] Upload succeeds
- [ ] Avatar displayed immediately
- [ ] Avatar URL saved
- [ ] Large files (> 5MB) rejected

---

### 4. Links Editor

#### Add Link
- [ ] Click "Add Link" button
- [ ] Form appears
- [ ] Icon picker shows 20 icons
- [ ] Selecting icon updates form
- [ ] Title and URL fields work
- [ ] "Add Link" saves to database
- [ ] New link appears in list
- [ ] Success toast shown

#### Edit Link
- [ ] Click edit icon on existing link
- [ ] Form pre-fills with link data
- [ ] Can change title, URL, icon
- [ ] "Save Changes" updates link
- [ ] Changes reflected immediately

#### Delete Link
- [ ] Click delete icon
- [ ] Link removed from list
- [ ] Database updated
- [ ] Success toast shown

#### Reorder Links
- [ ] Drag link by drag handle (≡ icon)
- [ ] Drop in new position
- [ ] Order updated in database
- [ ] Order persists after refresh

#### Toggle Link Visibility
- [ ] Click eye icon to hide link
- [ ] Icon changes to "eye slash"
- [ ] Link grayed out
- [ ] Click again to show
- [ ] Hidden links don't appear on public page

#### Empty State
- [ ] With no links, shows "No links yet" message
- [ ] "Add your first link" button works

---

### 5. Social Links Editor

#### Add Social
- [ ] Click "Add Social" button
- [ ] Platform selector appears
- [ ] Select platform (e.g., GitHub)
- [ ] URL field shows placeholder for that platform
- [ ] Enter URL
- [ ] "Add" saves social link
- [ ] Social appears in list with correct icon

#### Platform Icons
- [ ] Twitter shows X icon
- [ ] Instagram shows camera icon
- [ ] GitHub shows octocat icon
- [ ] LinkedIn shows briefcase icon
- [ ] YouTube shows play icon
- [ ] All 12 platforms have correct SVG icons

#### Delete Social
- [ ] Click delete icon
- [ ] Social removed
- [ ] Success toast shown

#### Platform Limit
- [ ] Can only add each platform once
- [ ] After adding all 12 platforms, "Add Social" button hidden

---

### 6. Theme Editor

#### Visual Mode

**Background Settings**
- [ ] Switch bg_type to "Gradient"
- [ ] Select gradient preset → Preview updates
- [ ] Switch bg_type to "Color"
- [ ] Pick color → Preview updates
- [ ] Switch bg_type to "Image"
- [ ] Upload image → Preview updates
- [ ] Delete background image works
- [ ] Overlay opacity slider works (0-100%)

**Card Settings**
- [ ] Card opacity slider works (0-50%)
- [ ] Blur slider works (0-30px)
- [ ] Border radius slider works (0-40px)
- [ ] Shadow presets work (none, sm, md, lg, xl)
- [ ] Glow toggle works
- [ ] Preview reflects all changes

**Button Settings**
- [ ] Button style selector works (glass, solid, outline, minimal)
- [ ] Button radius slider works (0-40px)
- [ ] Preview shows correct button style

**Other Settings**
- [ ] Spacing selector works (compact, normal, relaxed)
- [ ] Animation selector works (none, fade, slide, scale)
- [ ] Accent color picker works

**Actions**
- [ ] "Save Theme" button saves all settings
- [ ] Success toast shown
- [ ] "Reset" button reverts to saved theme

#### Code Mode
- [ ] Switch to "Custom CSS" tab
- [ ] CSS textarea editable
- [ ] Can write custom CSS
- [ ] CSS applied to preview
- [ ] Warning about blocked patterns shown
- [ ] Save button saves CSS
- [ ] Dangerous patterns filtered (`@import`, `javascript:`, etc.)

#### Live Preview
- [ ] Preview updates as settings change
- [ ] Preview shows same layout as public page
- [ ] Avatar, name, bio displayed
- [ ] Links displayed with correct icons
- [ ] Social icons displayed
- [ ] Theme applied correctly

---

### 7. Public Bio Page

#### Access
- [ ] Navigate to `/u/username`
- [ ] Page loads (not 404)
- [ ] Page displays for published profiles
- [ ] Unpublished profiles show 404

#### Content Display
- [ ] Avatar displayed (or default icon)
- [ ] Display name shown
- [ ] Username shown with @
- [ ] Bio text shown (if set)
- [ ] All active links displayed
- [ ] Link icons shown
- [ ] Social links displayed
- [ ] Social icons correct

#### Theme Application
- [ ] Background type applied (gradient/color/image)
- [ ] Background overlay opacity correct
- [ ] Card blur effect visible
- [ ] Card opacity correct
- [ ] Border radius matches settings
- [ ] Button style matches settings
- [ ] Spacing matches settings
- [ ] Animation plays on load (if set)
- [ ] Custom CSS applied (if set)

#### Interactions
- [ ] Clicking link opens in new tab
- [ ] Link click tracked (increment click_count)
- [ ] Social links open in new tab
- [ ] Hover effects work on buttons
- [ ] Hover effects work on social icons

#### Analytics
- [ ] View counter increments on page load
- [ ] View count displayed at bottom
- [ ] Count persists in database

#### Responsive Design
- [ ] Page looks good on desktop (1920px+)
- [ ] Page looks good on laptop (1366px)
- [ ] Page looks good on tablet (768px)
- [ ] Page looks good on mobile (375px)
- [ ] No horizontal scroll
- [ ] Touch interactions work on mobile

---

### 8. Navigation & Routing

#### Navbar
- [ ] Logo links to home
- [ ] "Home" link works
- [ ] "Dashboard" link works (when logged in)
- [ ] "Editor" link works (when logged in)
- [ ] User avatar/username shown when logged in
- [ ] "Login" button shown when logged out
- [ ] "Get Started" button shown when logged out
- [ ] "Logout" button works

#### Protected Routes
- [ ] `/dashboard` requires auth → Redirects to `/login` if not logged in
- [ ] `/editor` requires auth → Redirects to `/login` if not logged in
- [ ] After login, redirected to dashboard

#### Public Routes
- [ ] `/login` redirects to `/dashboard` if already logged in
- [ ] `/register` redirects to `/dashboard` if already logged in

#### 404 Page
- [ ] Invalid URL shows 404 page
- [ ] "Back to Home" button works
- [ ] 404 page styled correctly

---

### 9. File Uploads

#### Avatar Upload
- [ ] JPG file uploads
- [ ] PNG file uploads
- [ ] GIF file uploads
- [ ] WEBP file uploads
- [ ] Files > 5MB rejected
- [ ] Non-image files rejected
- [ ] Uploaded file accessible at `/uploads/filename`
- [ ] Old avatar files not deleted (manual cleanup needed)

#### Background Image Upload
- [ ] Image uploads
- [ ] Files > 10MB rejected
- [ ] Background applied to theme
- [ ] Image accessible via URL

#### Upload Errors
- [ ] Network error handled gracefully
- [ ] File too large → Error toast
- [ ] Invalid file type → Error toast

---

### 10. Security

#### Authentication
- [ ] JWT token required for protected endpoints
- [ ] Invalid token → 401 error
- [ ] Expired token → 401 error (after 30 days)
- [ ] Password hashed in database (not plaintext)

#### Input Validation
- [ ] Email validation works
- [ ] Password length validation works
- [ ] Username validation works (3-30 chars, alphanumeric + _ -)
- [ ] URL validation for links
- [ ] SQL injection prevented (prepared statements)

#### Rate Limiting
- [ ] General endpoints: 500 req/15min
- [ ] Auth endpoints: 20 req/15min
- [ ] Exceeding limit returns 429 status

#### CSS Sanitization
- [ ] `@import` removed from custom CSS
- [ ] `javascript:` removed
- [ ] `expression()` removed
- [ ] `behavior:` removed
- [ ] Other CSS allowed

#### CORS
- [ ] API accessible from allowed origins
- [ ] Blocked from other origins (if `ALLOWED_ORIGINS` set)

---

### 11. Error Handling

#### API Errors
- [ ] 400 Bad Request → Error toast with message
- [ ] 401 Unauthorized → Redirect to login
- [ ] 404 Not Found → Error toast
- [ ] 409 Conflict → Error toast (e.g., duplicate email)
- [ ] 500 Server Error → Generic error toast

#### Network Errors
- [ ] Offline → Error toast
- [ ] Timeout → Error toast
- [ ] Retry works after network restored

#### Form Validation
- [ ] Client-side validation shows errors
- [ ] Server-side validation returns errors
- [ ] Error messages clear and helpful

---

### 12. Performance

#### Load Times
- [ ] Home page loads < 2s
- [ ] Dashboard loads < 2s
- [ ] Editor loads < 2s
- [ ] Public bio page loads < 1s

#### Build
- [ ] `npm run build` succeeds
- [ ] Bundle size reasonable (~450KB JS + 50KB CSS)
- [ ] No build warnings
- [ ] No TypeScript errors

#### Database
- [ ] Queries fast (< 100ms)
- [ ] No N+1 queries
- [ ] Foreign keys indexed

---

### 13. Accessibility

#### Keyboard Navigation
- [ ] Tab through form fields works
- [ ] Enter submits forms
- [ ] Escape closes modals (if any)

#### Screen Reader
- [ ] Alt text on images
- [ ] ARIA labels on buttons
- [ ] Semantic HTML used

#### Contrast
- [ ] Text readable against background
- [ ] Green on black has sufficient contrast

---

### 14. Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)

---

### 15. Production Build

#### Environment
- [ ] `NODE_ENV=production` set
- [ ] `JWT_SECRET` is secure (not default)
- [ ] `ALLOWED_ORIGINS` configured

#### Server
- [ ] `npm start` works
- [ ] Server listens on correct PORT
- [ ] Static files served from `dist/`
- [ ] API endpoints work
- [ ] Health check returns 200
- [ ] Logs show no errors

#### Database
- [ ] Data persists across restarts
- [ ] Uploads persist across restarts
- [ ] No data loss

---

## 🚀 Deployment Testing (Railway)

### Pre-Deploy
- [ ] Code pushed to GitHub
- [ ] All tests above passed locally
- [ ] `.env` variables documented

### During Deploy
- [ ] Railway build succeeds
- [ ] No build errors
- [ ] Environment variables set

### Post-Deploy
- [ ] App accessible at Railway URL
- [ ] Health check works: `https://your-app.up.railway.app/health`
- [ ] Can register new account
- [ ] Can create bio page
- [ ] Public bio page accessible
- [ ] File uploads work
- [ ] Database persists

### Monitoring
- [ ] Check Railway logs for errors
- [ ] Check CPU/memory usage
- [ ] Check response times

---

## 📊 Testing Summary

**Total Tests**: 200+ checkpoints

**Categories**:
- Authentication: 15 tests
- Dashboard: 10 tests
- Profile Editor: 8 tests
- Links Editor: 15 tests
- Social Links: 10 tests
- Theme Editor: 25 tests
- Public Page: 20 tests
- Navigation: 12 tests
- File Uploads: 12 tests
- Security: 15 tests
- Error Handling: 10 tests
- Performance: 8 tests
- Accessibility: 8 tests
- Browser Compat: 6 tests
- Production: 12 tests
- Deployment: 14 tests

---

## 🐛 Bug Report Template

If you find a bug:

**Title**: Brief description

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. See error

**Expected**: What should happen

**Actual**: What actually happened

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Version: 1.0.0

**Screenshots**: (if applicable)

---

## ✅ Sign-Off

**Tested by**: _______________  
**Date**: _______________  
**Version**: 1.0.0  
**Status**: ☐ Passed ☐ Failed  

**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________

---

**Ready for production?** ✅ All checkpoints passed!
