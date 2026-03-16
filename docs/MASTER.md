# Professional/Serious Design System (Auth-Grade)

**Theme Identity:** Trustworthy, secure, enterprise-grade authentication UI

## Color Palette

### Primary Colors
```css
--auth-primary: #1e40af;      /* Navy blue - trust & security */
--auth-primary-hover: #1e3a8a;
--auth-success: #059669;      /* Green - validation success */
--auth-error: #dc2626;        /* Red - validation error */
--auth-warning: #d97706;      /* Amber - warnings */
```

### Background & Surface
```css
--auth-bg: #f8fafc;           /* Light gray-blue */
--auth-surface: #ffffff;      /* White */
--auth-surface-alt: #f1f5f9;  /* Light gray */
```

### Text Colors
```css
--auth-text-primary: #0f172a; /* Dark slate */
--auth-text-secondary: #475569; /* Slate gray */
--auth-text-muted: #94a3b8;   /* Light slate */
```

### Border Colors
```css
--auth-border: #e2e8f0;       /* Light border */
--auth-border-focus: #3b82f6; /* Focus blue */
```

## Typography

### Font Families
```css
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale
```css
--text-xs: 0.75rem;     /* 12px - labels, hints */
--text-sm: 0.875rem;    /* 14px - secondary text */
--text-base: 1rem;      /* 16px - body, inputs */
--text-lg: 1.125rem;    /* 18px - emphasized */
--text-xl: 1.25rem;     /* 20px - small headings */
--text-2xl: 1.5rem;     /* 24px - section headings */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Spacing System

```css
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
```

## Border Radius

```css
--radius-sm: 0.375rem;  /* 6px - inputs */
--radius-md: 0.5rem;    /* 8px - buttons */
--radius-lg: 0.75rem;   /* 12px - cards */
```

## Component Patterns

### Auth Container
```css
.auth-container {
  max-width: 440px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: var(--auth-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
}
```

### Form Inputs
```css
.auth-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--auth-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.auth-input:focus {
  border-color: var(--auth-border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.auth-input.error {
  border-color: var(--auth-error);
}

.auth-input.success {
  border-color: var(--auth-success);
}
```

### Primary Button
```css
.btn-auth-primary {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--auth-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.btn-auth-primary:hover {
  background: var(--auth-primary-hover);
}

.btn-auth-primary:disabled {
  background: var(--auth-text-muted);
  cursor: not-allowed;
}
```

### Validation States
```css
.validation-message {
  font-size: var(--text-xs);
  margin-top: 0.25rem;
}

.validation-message.error {
  color: var(--auth-error);
}

.validation-message.success {
  color: var(--auth-success);
}
```

### Security Indicators
```css
.security-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #ecfdf5;
  color: var(--auth-success);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}
```

## Form Patterns

### Input Group
```css
.input-group {
  margin-bottom: 1.25rem;
}

.input-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--auth-text-primary);
  margin-bottom: 0.375rem;
}

.input-hint {
  font-size: var(--text-xs);
  color: var(--auth-text-muted);
  margin-top: 0.375rem;
}
```

### Password Strength
```css
.strength-meter {
  height: 4px;
  background: var(--auth-border);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.strength-meter-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-meter-fill.weak { background: var(--auth-error); }
.strength-meter-fill.medium { background: var(--auth-warning); }
.strength-meter-fill.strong { background: var(--auth-success); }
```

## Design Tokens Summary

| Token | Value | Purpose |
|-------|-------|---------|
| Primary | #1e40af | Main action color |
| Success | #059669 | Validation success |
| Error | #dc2626 | Validation error |
| Warning | #d97706 | Warning messages |
| Background | #f8fafc | Page background |
| Surface | #ffffff | Card/panel background |
| Border | #e2e8f0 | Input borders |

## Accessibility

- Focus states with visible outline
- ARIA labels for form inputs
- Error announcements for screen readers
- Keyboard navigation support
- Minimum contrast ratio of 4.5:1
