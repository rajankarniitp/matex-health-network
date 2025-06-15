
# DocMateX - Healthcare Professional Network

A modern React-based web application for healthcare professionals to connect, collaborate, and share knowledge.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (auto-generated)
│   ├── layout/         # Layout components (Navbar, Footer, etc.)
│   ├── home/           # Home page specific components
│   └── notifications/  # Notification components
├── contexts/           # React Context providers
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
├── hooks/              # Custom React hooks
│   ├── useSEO.ts      # SEO management hook
│   └── use-*.tsx      # Other utility hooks
├── lib/                # Utility libraries and configurations
│   ├── seo.ts         # SEO service and utilities
│   ├── analytics.ts   # Analytics tracking service
│   ├── security.ts    # Security utilities and CSP
│   ├── sentry.ts      # Error tracking setup
│   └── utils.ts       # General utility functions
├── pages/              # Page components (route handlers)
│   ├── Index.tsx      # Home/Landing page
│   ├── Dashboard.tsx  # User dashboard
│   ├── Login.tsx      # Authentication pages
│   └── ...           # Other page components
├── App.tsx            # Main app component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## 🛠 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Context + React Query
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics 4
- **UI Components**: Radix UI (via shadcn/ui)
- **Icons**: Lucide React
- **Charts**: Recharts

## 🔧 Development Guide

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/layout/Navbar.tsx`
4. Add SEO data in `src/lib/seo.ts`

### Creating Components
- Use `src/components/ui/` for reusable UI components
- Use specific folders (`layout/`, `home/`, etc.) for domain-specific components
- Follow the existing component patterns and TypeScript types

### State Management
- Use React Context for global state (theme, notifications)
- Use React Query for server state and data fetching
- Use local state (useState) for component-specific state

### Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow responsive design patterns (`sm:`, `md:`, `lg:` breakpoints)
- Use shadcn/ui components for consistency
- Dark mode support is built-in via ThemeContext

### SEO Optimization
- Use the `useSEO` hook in page components
- Add page-specific SEO data in `src/lib/seo.ts`
- Structured data is automatically handled

## 🔒 Security Features

- Content Security Policy (CSP) headers
- XSS protection headers
- Client-side rate limiting
- Secure cookie settings (when backend is added)
- Input sanitization patterns

## 📊 Analytics & Monitoring

- **Error Tracking**: Sentry integration for error monitoring
- **Analytics**: Google Analytics 4 for user behavior tracking
- **Performance**: Built-in performance monitoring
- **Load Testing**: K6 scripts available in `/load-testing/`

## 🚀 Deployment

### Environment Variables
Required environment variables in `.env.local`:
```env
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Build for Production
```bash
npm run build
npm run preview  # Test production build locally
```

### Deployment Platforms
- **Recommended**: Vercel, Netlify (automatic CI/CD)
- **Manual**: Any static hosting service

## 🧪 Testing & Quality

### Load Testing
```bash
# Install k6 (macOS)
brew install k6

# Run load tests
cd load-testing
k6 run k6-script.js
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent component patterns
- Error boundaries for error handling

## 🔄 Adding Backend Integration

This is a frontend-only application. To add backend functionality:

1. **Recommended**: Use Supabase integration via Lovable platform
2. **Alternative**: Create separate backend API and update service files in `src/lib/`

## 🎨 Theme & Customization

- Dark/Light mode built-in
- Customizable via `src/contexts/ThemeContext.tsx`
- Color scheme defined in `tailwind.config.ts`
- Component variants in `src/components/ui/`

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Mobile navigation optimized
- Touch-friendly interactions

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Add appropriate error handling
4. Update documentation for significant changes
5. Test on multiple devices/browsers

## 📞 Support

- Check existing components in `src/components/ui/` before creating new ones
- Follow the established patterns in existing pages
- Use the SEO service for all new pages
- Implement proper error boundaries for new features

## 🔗 Useful Links

- [Lovable Documentation](https://docs.lovable.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
