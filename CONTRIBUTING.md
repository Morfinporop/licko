# Contributing to BioLink

Thank you for your interest in contributing to BioLink! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js 22.22.2 or higher
- npm or yarn
- Git

### Getting Started

1. **Fork the repository**

2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/biolink.git
cd biolink
```

3. **Install dependencies**
```bash
npm install
```

4. **Create .env file**
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
JWT_SECRET=your-dev-secret-key
```

5. **Start development**

Terminal 1 (frontend):
```bash
npm run dev
```

Terminal 2 (backend):
```bash
npm run dev:server
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:8080`

## Project Structure

```
biolink/
├── server/                 # Backend
│   ├── db.js              # Database schema & setup
│   ├── index.js           # Express server
│   ├── middleware/        # Middleware (auth, etc.)
│   └── routes/            # API routes
├── src/                   # Frontend
│   ├── components/        # React components
│   │   ├── editor/        # Editor-specific components
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utilities & API client
│   ├── pages/             # Page components
│   ├── store/             # State management (Zustand)
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
└── data/                  # Generated (DB & uploads)
```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for type safety
- Use functional components with hooks
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic

### Component Structure

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface MyComponentProps {
  title: string;
  onSave: () => void;
}

export function MyComponent({ title, onSave }: MyComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onSave}>Save</Button>
    </div>
  );
}
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme (black/green)
- Use glassmorphism patterns
- Ensure responsive design (mobile-first)

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `style/` - UI/styling changes

### 2. Make Your Changes

- Write clean, readable code
- Follow existing patterns
- Test your changes thoroughly
- Update documentation if needed

### 3. Test Your Changes

**Frontend:**
```bash
npm run dev
```
Test in browser at `http://localhost:5173`

**Backend:**
```bash
npm run dev:server
```

**Build test:**
```bash
npm run build
```

### 4. Commit Your Changes

Write clear commit messages:

```bash
git add .
git commit -m "feat: add dark mode toggle"
# or
git commit -m "fix: resolve avatar upload issue"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, styling
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Description of what was changed and why
- Screenshots (for UI changes)
- Related issue numbers (if applicable)

## What to Contribute

### Ideas for Contributions

**Features:**
- [ ] Export bio page as image/PDF
- [ ] Analytics dashboard with charts
- [ ] QR code generation
- [ ] Multiple theme presets
- [ ] Import/export profile data
- [ ] Link scheduling (show/hide at specific times)
- [ ] Custom fonts
- [ ] Video backgrounds
- [ ] Integration with other services (Calendar, Spotify, etc.)

**Improvements:**
- [ ] Better mobile UX
- [ ] More animation options
- [ ] Advanced CSS editor with syntax highlighting
- [ ] Bulk link operations
- [ ] SEO optimization
- [ ] Performance optimizations
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

**Bug Fixes:**
- Check GitHub Issues for bugs to fix

**Documentation:**
- Improve README
- Add code comments
- Write tutorials
- Create video guides

## Guidelines

### Do's ✅

- Write clean, maintainable code
- Test on multiple devices/browsers
- Keep commits focused and atomic
- Update documentation
- Ask questions if unsure
- Be respectful and professional

### Don'ts ❌

- Don't break existing functionality
- Don't add unnecessary dependencies
- Don't ignore linting errors
- Don't commit `.env` or sensitive data
- Don't use console.log in production code (use proper logging)

## Testing Checklist

Before submitting PR, ensure:

- [ ] Code builds without errors (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile (responsive)
- [ ] Works with different data scenarios (empty state, lots of data)
- [ ] Authentication still works
- [ ] File uploads work
- [ ] Links are clickable and tracked
- [ ] Theme customization works
- [ ] Public bio page displays correctly

## Database Changes

If you modify database schema:

1. Update `server/db.js`
2. Document the changes in migration notes
3. Test with fresh database
4. Test with existing database (if applicable)

Example:
```javascript
// Add new column
db.exec(`
  ALTER TABLE profiles ADD COLUMN new_field TEXT DEFAULT '';
`);
```

## API Changes

If you add/modify API endpoints:

1. Update `server/routes/` files
2. Update `src/lib/api.ts`
3. Update `API.md` documentation
4. Ensure backwards compatibility when possible

## Security

**Critical**: Always validate and sanitize user input

- Validate on both client and server
- Use prepared statements for database queries
- Sanitize HTML/CSS to prevent XSS
- Don't expose sensitive data in errors
- Rate limit sensitive endpoints

Example:
```javascript
// Bad
const user = db.prepare(`SELECT * FROM users WHERE email = '${email}'`).get();

// Good
const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
```

## Performance

- Optimize images before uploading
- Minimize database queries
- Use indexes for frequently queried fields
- Lazy load heavy components
- Cache when appropriate

## Accessibility

- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

## Getting Help

- Check existing documentation
- Search GitHub Issues
- Ask in Pull Request comments
- Join community discussions

## Code Review Process

1. PR is submitted
2. Automated checks run
3. Maintainer reviews code
4. Feedback provided
5. Changes requested (if needed)
6. Approved and merged

**Review time**: Usually 1-3 days

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in commit history

## Thank You! 💚

Your contributions make BioLink better for everyone. We appreciate your time and effort!

---

**Questions?** Open an issue or reach out to maintainers.
