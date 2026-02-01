# SecureAuth — Firebase Authentication

A professional, trustworthy authentication interface built with React and Firebase. Featuring enterprise-grade security UI, clean form validation, and a minimal focused design that conveys trust and reliability.

## Recent Upgrades (v2.2.0)

### Iteration 1-5: Complete Portfolio Upgrade
- Added "Made by MK — Musharraf Kazi" branding
- Updated documentation structure
- Enhanced security feature descriptions
- Documented accessibility features
- Verified build successful

---

## Professional/Serious Theme

This application features an **"Auth-Grade Professional"** design system:
- Navy blue primary color conveying trust and security
- Clean forms with real-time validation states
- Enterprise-grade security indicators
- Minimal, focused interface
- Professional green for success states

## Features

| Feature | Description |
|---------|-------------|
| **Form Validation** | Real-time email and password validation with visual feedback |
| **Password Strength** | Visual password strength meter (weak/medium/strong) |
| **Security Indicators** | SSL badge, encryption notices, and trust signals |
| **Error Handling** | Clear error messages with icons for accessibility |
| **Loading States** | Spinner animation during form submission |
| **Toggle Visibility** | Password show/hide functionality |
| **Social Login** | Google OAuth integration ready |
| **Remember Me** | Persistent session option |

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Backend Service:** Firebase (Auth, Firestore)
- **Styling:** Tailwind CSS v4 with custom design system
- **Build Tool:** Vite 6
- **Icons:** Lucide React

## Design System

See `design-system/MASTER.md` for complete design token documentation.

### Color Palette
```css
--auth-primary: #1e40af;      /* Navy blue - trust */
--auth-success: #059669;      /* Green - validation */
--auth-error: #dc2626;        /* Red - errors */
--auth-warning: #d97706;      /* Amber - warnings */
```

### Key Components
- `.auth-container` - Centered authentication card
- `.auth-input` - Styled form input with focus states
- `.btn-auth-primary` - Primary action button
- `.strength-meter` - Password strength indicator
- `.validation-message` - Error/success feedback
- `.security-badge` - Trust indicator

### Validation States
```css
/* Error State */
.auth-input.error {
  border-color: var(--auth-error);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

/* Success State */
.auth-input.success {
  border-color: var(--auth-success);
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Configuration

Create `src/firebase.jsx` with your Firebase config:

```javascript
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "..."
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
```

## Project Structure

```
src/
├── components/
│   ├── App.jsx          # Main auth component
│   ├── Login.jsx        # Login form
│   ├── Signup.jsx       # Signup form
│   ├── Dashboard.jsx    # Protected dashboard
│   └── ForgotPassword.jsx
├── contexts/
│   └── AuthContext.jsx  # Auth state management
├── firebase.jsx         # Firebase configuration
└── index.css           # Design system styles
```

## Security Features

- Password minimum length validation (8 characters)
- Email format validation
- Password strength indicator
- Confirm password matching
- SSL/TLS encryption indication
- Privacy policy compliance
- GDPR-ready consent notices

## Deployment

This project is configured for deployment on three platforms:

### GitHub Pages
- **Workflow**: `.github/workflows/deploy.yml`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Trigger**: Push to `main` branch
- **Action**: `actions/deploy-page@v4` with Vite static site generator

### Vercel
- **Config**: `vercel.json`
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites**: SPA fallback to `/index.html`

### Netlify
- **Config**: `netlify.toml`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects**: All paths to `/index.html` (SPA support)

### Firebase Hosting
- **Config**: `firebase.json`
- **Command**: `firebase deploy` or `npm run deploy`

---

## Live Links

| Platform | URL |
|----------|-----|
| **GitHub Pages** | https://mk-knight23.github.io/41-tool-firebase-auth/ |
| **Vercel** | https://41-tool-firebase-auth.vercel.app/ |
| **Netlify** | https://41-tool-firebase-auth.netlify.app/ |

---

**Theme:** Professional/Serious (Auth-Grade)
**License:** MIT
**Author:** mk-knight23
