# Component Documentation

## Component Categories

### 1. UI Components (`src/components/ui/`)
Auto-generated shadcn/ui components. These provide the foundation for all UI elements:

- **Forms**: `input.tsx`, `button.tsx`, `form.tsx`, `label.tsx`
- **Layout**: `card.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`
- **Feedback**: `toast.tsx`, `alert.tsx`, `skeleton.tsx`, `sonner.tsx`
- **Navigation**: `tabs.tsx`, `dropdown-menu.tsx`, `navigation-menu.tsx`
- **Data Display**: `table.tsx`, `badge.tsx`, `avatar.tsx`
- **Overlays**: `dialog.tsx`, `popover.tsx`, `tooltip.tsx`

### 2. Layout Components (`src/components/layout/`)

#### `Navbar.tsx`
- **Responsive Navigation**: Desktop full menu, mobile hamburger
- **Authentication State**: Different menus for auth states
- **Theme Integration**: Dark/light mode toggle
- **Mobile Optimization**: Collapsible navigation drawer
- **Logo Integration**: DocMateX branding with routing

#### `Footer.tsx`
- **Site Footer**: Links and branding
- **Social Media**: Professional social links
- **Legal Links**: Terms, privacy, compliance

#### `DashboardLayout.tsx`
- **Authenticated Layout**: Wrapper for logged-in users
- **Sidebar Navigation**: Professional dashboard navigation
- **Header Integration**: User info and quick actions

#### `MobileBottomNav.tsx`
- **Mobile Navigation**: Bottom tab bar for mobile
- **Quick Access**: Essential features (Feed, Messages, Search, Profile)
- **Active States**: Visual feedback for current page

### 3. Feature Components

#### Authentication (`src/pages/Login.tsx`, `src/pages/Signup.tsx`)
- **Social Login Integration**: Google, LinkedIn, Apple with official branding
- **Form Validation**: Comprehensive input validation
- **Responsive Design**: Mobile-first authentication flows
- **Loading States**: User feedback during authentication
- **Error Handling**: Clear error messages and recovery

#### Chat Interface (`src/pages/Chat.tsx`)
- **Responsive Messaging**: Adaptive layout for all screen sizes
- **File Attachments**: Document, image, and file upload support
- **Real-time Ready**: Prepared for backend integration
- **Mobile Optimization**: 
  - Full-screen chat on mobile
  - Optimized input area with attachment options
  - Touch-friendly interface

#### Professional Features
- **Feed System**: Content sharing and professional discussions
- **Networking**: Professional connections and verification
- **Knowledge Sharing**: Research, case studies, mentorship
- **Career Tools**: Job board and professional development

### 4. Component Patterns

#### Standard Component Structure
```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // ... other props
}

const Component: React.FC<ComponentProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div className={cn("default-classes", className)} {...props}>
      {children}
    </div>
  );
};

export default Component;
```

#### Responsive Component Pattern
```tsx
const ResponsiveComponent = () => {
  return (
    <div className="
      flex flex-col 
      sm:flex-row sm:gap-4 
      md:gap-6 
      lg:gap-8
      p-2 sm:p-4 md:p-6
    ">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        {/* Mobile: full width, SM: half, LG: third */}
      </div>
    </div>
  );
};
```

#### Authentication Aware Component
```tsx
import { useEffect, useState } from 'react';

const AuthAwareComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('docmatex_token');
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) {
    return <div>Please log in to access this feature</div>;
  }

  return <div>{/* Authenticated content */}</div>;
};
```

#### Social Login Component Pattern
```tsx
const SocialLoginButton = ({ provider, icon, onClick }) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-11 bg-white dark:bg-gray-700"
      onClick={() => onClick(provider)}
    >
      {icon}
      Continue with {provider}
    </Button>
  );
};
```

### 5. Best Practices

#### Responsive Design ✅
- Mobile-first approach with progressive enhancement
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- Test on multiple screen sizes
- Touch-friendly interactive elements

#### Component Composition ✅
```tsx
// Good: Composable modal with form
<Dialog>
  <DialogTrigger asChild>
    <Button>Add Professional Info</Button>
  </DialogTrigger>
  <DialogContent>
    <Form>
      <FormField name="specialty" />
      <FormField name="experience" />
    </Form>
  </DialogContent>
</Dialog>
```

#### TypeScript Usage ✅
- Define interfaces for all props
- Use union types for constrained values
- Leverage component prop types from shadcn/ui
- Handle optional props appropriately

#### Error Handling ✅
```tsx
const ComponentWithErrorHandling = () => {
  const handleError = (error: Error) => {
    console.error('Component error:', error);
    toast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive"
    });
  };

  return (
    <ErrorBoundary onError={handleError}>
      {/* Component content */}
    </ErrorBoundary>
  );
};
```

### 6. Component Refactoring Guidelines

When components exceed 250 lines:
- Extract sub-components into separate files
- Create custom hooks for complex logic
- Use composition patterns
- Separate concerns (UI vs logic)

Example refactoring:
```
src/pages/Chat.tsx (300+ lines) →
├── src/components/chat/ChatHeader.tsx
├── src/components/chat/MessageList.tsx
├── src/components/chat/MessageInput.tsx
└── src/hooks/useChat.ts
```

### 7. Professional Healthcare Context

All components should consider:
- **Privacy**: Patient information protection
- **Accessibility**: Medical compliance requirements
- **Professional Standards**: Healthcare industry UX patterns
- **Security**: Secure handling of sensitive data
- **Verification**: Professional credential display
