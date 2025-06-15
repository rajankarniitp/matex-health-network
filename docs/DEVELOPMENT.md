
# Development Guide

## Getting Started

### Prerequisites Setup
1. Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
2. Install a code editor (VS Code recommended)
3. Install Git for version control

### VS Code Extensions (Recommended)
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

### Environment Setup
```bash
# Clone and setup
git clone <repository-url>
cd docmatex
npm install

# Environment configuration
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development
npm run dev
```

## Development Workflow

### 1. Creating New Features

#### Step 1: Plan the Feature
- Identify required components
- Plan state management needs
- Consider API requirements
- Design component hierarchy

#### Step 2: Create Components
```bash
# Create new component
touch src/components/feature/NewComponent.tsx
```

#### Step 3: Add to Routes (if needed)
```tsx
// In src/App.tsx
<Route path="/new-feature" element={<NewFeature />} />
```

#### Step 4: Update Navigation
```tsx
// In src/components/layout/Navbar.tsx
// Add navigation link
```

### 2. Responsive Development Pattern

#### Mobile-First Approach
```tsx
const ResponsiveComponent = () => {
  return (
    <div className="
      // Mobile (default)
      flex flex-col p-4 text-sm
      
      // Small screens (640px+)
      sm:flex-row sm:p-6 sm:text-base
      
      // Medium screens (768px+)
      md:p-8 md:text-lg
      
      // Large screens (1024px+)
      lg:p-10 lg:text-xl
      
      // Extra large (1280px+)
      xl:p-12
    ">
      <div className="
        w-full 
        sm:w-1/2 
        lg:w-1/3
      ">
        Content
      </div>
    </div>
  );
};
```

#### Component Structure for Responsive Design
```
src/components/feature/
├── FeatureComponent.tsx         # Main responsive component
├── FeatureMobileView.tsx       # Mobile-specific layout
├── FeatureDesktopView.tsx      # Desktop-specific layout
├── FeatureCard.tsx             # Reusable card component
└── index.ts                    # Exports
```

### 3. Authentication Integration

#### Current Auth Pattern
```tsx
// Check authentication status
const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  const token = localStorage.getItem('docmatex_token');
  const user = localStorage.getItem('docmatex_user');
  setIsAuthenticated(!!(token && user));
}, []);

// Handle login
const handleLogin = async (credentials) => {
  // Simulate API call
  localStorage.setItem('docmatex_token', 'demo_token');
  localStorage.setItem('docmatex_user', JSON.stringify(userData));
  navigate('/feed');
};

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('docmatex_token');
  localStorage.removeItem('docmatex_user');
  navigate('/login');
};
```

#### Social Login Implementation (Ready for Backend)
```tsx
const handleSocialLogin = (provider: 'google' | 'linkedin' | 'apple') => {
  // Currently shows "Coming Soon"
  toast({
    title: "Coming Soon!",
    description: `${provider} login will be available soon.`,
  });
  
  // Future implementation:
  // window.location.href = `/auth/${provider}`;
};
```

### 4. Chat Interface Development

#### Responsive Chat Pattern
```tsx
const ChatInterface = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header - responsive height */}
      <div className="h-16 sm:h-20 border-b">
        <ChatHeader />
      </div>
      
      {/* Messages - flexible content area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        <MessageList />
      </div>
      
      {/* Input - responsive input area */}
      <div className="p-2 sm:p-4 border-t">
        <MessageInput />
      </div>
    </div>
  );
};
```

#### File Attachment Pattern
```tsx
const AttachmentButton = ({ type, icon, onClick }) => {
  return (
    <button
      onClick={() => onClick(type)}
      className="
        p-2 rounded-lg
        text-gray-500 hover:text-gray-700
        hover:bg-gray-100
        transition-colors
      "
      title={`Attach ${type}`}
    >
      {icon}
    </button>
  );
};
```

### 5. State Management

#### Local State for UI
```tsx
const [isOpen, setIsOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState('tab1');
```

#### Form State with Validation
```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    email: '',
    password: '',
    rememberMe: false
  }
});
```

#### Server State (Future)
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['messages', chatId],
  queryFn: () => fetchMessages(chatId),
  enabled: !!chatId,
});
```

### 6. Styling Guidelines

#### Tailwind Responsive Classes
```css
/* Mobile first approach */
.responsive-element {
  @apply 
    p-2 text-sm                 /* Mobile */
    sm:p-4 sm:text-base         /* Small screens */
    md:p-6 md:text-lg           /* Medium screens */
    lg:p-8 lg:text-xl           /* Large screens */
    xl:p-10 xl:text-2xl;        /* Extra large */
}
```

#### Component Variants
```tsx
const buttonVariants = {
  default: "bg-blue-600 text-white",
  outline: "border border-gray-300 bg-transparent",
  ghost: "bg-transparent hover:bg-gray-100"
};

const sizeVariants = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
};
```

### 7. Error Handling

#### Component Level Error Handling
```tsx
const ComponentWithErrorHandling = () => {
  const [error, setError] = useState(null);

  const handleError = (err: Error) => {
    setError(err.message);
    console.error('Component error:', err);
    
    toast({
      title: "Error",
      description: err.message,
      variant: "destructive"
    });
  };

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
        <Button onClick={() => setError(null)}>
          Try Again
        </Button>
      </div>
    );
  }

  return <div>{/* Normal component content */}</div>;
};
```

### 8. Testing Approach

#### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

test('social login shows coming soon message', () => {
  render(<LoginForm />);
  
  const googleButton = screen.getByText('Continue with Google');
  fireEvent.click(googleButton);
  
  expect(screen.getByText('Coming Soon!')).toBeInTheDocument();
});
```

#### Responsive Testing
```tsx
test('chat interface adapts to mobile', () => {
  // Mock mobile viewport
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  });

  render(<ChatInterface />);
  
  // Test mobile-specific elements
  expect(screen.getByTestId('mobile-chat-input')).toBeInTheDocument();
});
```

### 9. Performance Optimization

#### Code Splitting
```tsx
const LazyComponent = lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<LoadingSkeleton />}>
    <LazyComponent />
  </Suspense>
);
```

#### Image Optimization
```tsx
const OptimizedImage = ({ src, alt, className }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    loading="lazy"
    decoding="async"
  />
);
```

### 10. Deployment Preparation

#### Build Process
```bash
npm run build      # Create production build
npm run preview    # Test production build locally
```

#### Pre-deployment Checklist
- [ ] All responsive breakpoints tested
- [ ] Social login buttons show "Coming Soon"
- [ ] No TypeScript errors
- [ ] No console errors in production
- [ ] Authentication flow works
- [ ] Mobile navigation functions properly
- [ ] Chat interface responsive on all devices
- [ ] File attachment icons display correctly

### 11. Future Backend Integration

#### Supabase Integration Preparation
- All authentication flows ready for OAuth
- Chat interface ready for real-time messaging
- File attachment ready for storage integration
- User management ready for database integration

#### API Integration Points
- Authentication endpoints
- Real-time messaging
- File upload endpoints
- User profile management
- Professional verification
