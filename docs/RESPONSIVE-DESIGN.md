
# Responsive Design Guide

## Overview
DocMateX follows a mobile-first responsive design approach, ensuring optimal user experience across all device types commonly used by healthcare professionals.

## Breakpoint Strategy

### Tailwind CSS Breakpoints
```css
/* Mobile first approach */
/* Default: 0px - 639px (Mobile) */
sm: 640px    /* Small devices (large phones) */
md: 768px    /* Medium devices (tablets) */
lg: 1024px   /* Large devices (laptops) */
xl: 1280px   /* Extra large devices (desktops) */
2xl: 1536px  /* 2X Extra large devices (large desktops) */
```

### Device Targeting
- **Mobile (320px - 639px)**: Primary focus for healthcare professionals on-the-go
- **Tablet (640px - 1023px)**: Balanced experience for clinical settings
- **Desktop (1024px+)**: Full-featured experience for administrative work

## Component Responsive Patterns

### 1. Navigation Components

#### Navbar Responsive Behavior
```tsx
// Mobile: Hamburger menu
<div className="md:hidden">
  <Button variant="ghost" size="icon">
    <Menu className="h-6 w-6" />
  </Button>
</div>

// Desktop: Full navigation
<div className="hidden md:flex md:space-x-8">
  <NavigationMenu />
</div>
```

#### Mobile Bottom Navigation
```tsx
// Only visible on mobile devices
<div className="
  fixed bottom-0 left-0 right-0 
  bg-white border-t 
  md:hidden
  safe-area-bottom
">
  <BottomNavigation />
</div>
```

### 2. Chat Interface Responsive Design

#### Layout Adaptation
```tsx
const ChatInterface = () => (
  <div className="
    flex flex-col h-screen
    max-w-full
    sm:max-w-2xl sm:mx-auto
    lg:max-w-4xl
  ">
    {/* Header */}
    <div className="
      h-14 sm:h-16 lg:h-20
      px-3 sm:px-4 lg:px-6
      border-b
    ">
      <ChatHeader />
    </div>
    
    {/* Messages */}
    <div className="
      flex-1 overflow-y-auto
      p-2 sm:p-4 lg:p-6
    ">
      <MessageList />
    </div>
    
    {/* Input */}
    <div className="
      p-2 sm:p-4 lg:p-6
      border-t
    ">
      <MessageInput />
    </div>
  </div>
);
```

#### Message Bubbles
```tsx
const MessageBubble = ({ message, isOwn }) => (
  <div className={`
    flex mb-3 sm:mb-4
    ${isOwn ? 'justify-end' : 'justify-start'}
  `}>
    <div className={`
      max-w-[85%] sm:max-w-[75%] lg:max-w-[60%]
      px-3 py-2 sm:px-4 sm:py-3
      rounded-2xl
      text-sm sm:text-base
      ${isOwn 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-800'
      }
    `}>
      {message.content}
    </div>
  </div>
);
```

#### Attachment Controls
```tsx
const AttachmentControls = () => (
  <div className="
    flex gap-1 sm:gap-2 lg:gap-3
    mr-2 sm:mr-3
  ">
    {/* Mobile: Smaller icons */}
    <AttachmentButton 
      icon={<Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />}
      type="file"
    />
    <AttachmentButton 
      icon={<FileText className="h-4 w-4 sm:h-5 sm:w-5" />}
      type="document"
    />
    <AttachmentButton 
      icon={<Image className="h-4 w-4 sm:h-5 sm:w-5" />}
      type="image"
    />
  </div>
);
```

### 3. Authentication Pages

#### Login Form Responsive Layout
```tsx
const LoginPage = () => (
  <div className="
    min-h-screen bg-gradient-to-br from-blue-50 to-white
    flex items-center justify-center
    py-6 px-4 sm:px-6 lg:px-8
  ">
    <div className="
      max-w-md w-full space-y-6 sm:space-y-8
    ">
      {/* Logo */}
      <div className="text-center">
        <div className="
          w-16 h-16 sm:w-20 sm:h-20
          mx-auto mb-4 sm:mb-6
        ">
          <Logo />
        </div>
        <h2 className="
          text-2xl sm:text-3xl font-bold
        ">
          Welcome back to DocMateX
        </h2>
      </div>
      
      {/* Form */}
      <Card className="shadow-lg">
        <CardContent className="px-4 sm:px-6">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  </div>
);
```

#### Social Login Buttons
```tsx
const SocialLoginButton = ({ provider, icon, onClick }) => (
  <Button
    type="button"
    variant="outline"
    className="
      w-full h-10 sm:h-11
      text-sm sm:text-base
      bg-white dark:bg-gray-700
      border-gray-300 dark:border-gray-600
    "
    onClick={() => onClick(provider)}
  >
    <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3">
      {icon}
    </div>
    <span className="hidden sm:inline">Continue with </span>
    <span className="sm:hidden">Login </span>
    {provider}
  </Button>
);
```

### 4. Form Input Responsive Design

#### Input Field Sizing
```tsx
const ResponsiveInput = ({ icon, ...props }) => (
  <div className="relative">
    <div className="
      absolute inset-y-0 left-0 pl-3
      flex items-center pointer-events-none
    ">
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
    </div>
    <Input
      className="
        pl-9 sm:pl-10
        h-10 sm:h-11
        text-sm sm:text-base
      "
      {...props}
    />
  </div>
);
```

## Layout Patterns

### 1. Container Responsive Patterns
```tsx
// Full width with responsive max-width
<div className="
  w-full max-w-7xl mx-auto
  px-4 sm:px-6 lg:px-8
">

// Responsive grid
<div className="
  grid grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4 sm:gap-6 lg:gap-8
">

// Responsive flex
<div className="
  flex flex-col
  sm:flex-row
  gap-4 sm:gap-6
">
```

### 2. Card Responsive Design
```tsx
const ResponsiveCard = ({ children }) => (
  <Card className="
    w-full
    p-4 sm:p-6 lg:p-8
    shadow-sm sm:shadow-md lg:shadow-lg
    rounded-lg sm:rounded-xl
  ">
    <CardContent className="
      space-y-3 sm:space-y-4 lg:space-y-6
    ">
      {children}
    </CardContent>
  </Card>
);
```

### 3. Typography Responsive Scale
```css
/* Heading responsive scale */
.responsive-h1 {
  @apply text-2xl sm:text-3xl lg:text-4xl xl:text-5xl;
}

.responsive-h2 {
  @apply text-xl sm:text-2xl lg:text-3xl xl:text-4xl;
}

.responsive-h3 {
  @apply text-lg sm:text-xl lg:text-2xl;
}

.responsive-body {
  @apply text-sm sm:text-base lg:text-lg;
}

.responsive-caption {
  @apply text-xs sm:text-sm;
}
```

## Touch-Friendly Design

### 1. Interactive Element Sizing
```tsx
// Minimum touch target: 44px x 44px
const TouchFriendlyButton = ({ children, ...props }) => (
  <Button
    className="
      min-h-[44px] min-w-[44px]
      px-4 py-2
      sm:min-h-[48px] sm:min-w-[48px]
      sm:px-6 sm:py-3
    "
    {...props}
  >
    {children}
  </Button>
);
```

### 2. Spacing for Touch
```css
/* Touch-friendly spacing */
.touch-spacing {
  @apply space-y-4 sm:space-y-2; /* More space on mobile */
}

.touch-padding {
  @apply p-4 sm:p-2; /* More padding on mobile */
}
```

## Performance Considerations

### 1. Image Responsive Loading
```tsx
const ResponsiveImage = ({ src, alt, className }) => (
  <img
    src={src}
    alt={alt}
    className={`
      w-full h-auto
      object-cover
      ${className}
    `}
    loading="lazy"
    decoding="async"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
);
```

### 2. Conditional Rendering
```tsx
const ResponsiveContent = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  return (
    <>
      {isMobile ? (
        <MobileOptimizedComponent />
      ) : (
        <DesktopComponent />
      )}
    </>
  );
};
```

## Testing Responsive Design

### 1. Device Testing Matrix
- **Mobile**: iPhone SE, iPhone 12/13/14, Samsung Galaxy S21
- **Tablet**: iPad, iPad Pro, Samsung Galaxy Tab
- **Desktop**: 1366x768, 1920x1080, 2560x1440

### 2. Responsive Testing Tools
```bash
# Chrome DevTools device emulation
# Firefox Responsive Design Mode
# Safari Web Inspector
```

### 3. Testing Checklist
- [ ] Navigation works on all screen sizes
- [ ] Forms are usable on mobile devices
- [ ] Touch targets are appropriately sized
- [ ] Text remains readable at all sizes
- [ ] Images scale appropriately
- [ ] Chat interface works on mobile
- [ ] Authentication flows are mobile-friendly

## Accessibility in Responsive Design

### 1. Screen Reader Considerations
```tsx
// Hide decorative elements on mobile
<div className="hidden sm:block" aria-hidden="true">
  <DecorativeElement />
</div>

// Responsive aria labels
<Button aria-label={isMobile ? "Menu" : "Open navigation menu"}>
```

### 2. Focus Management
```css
/* Visible focus indicators on all devices */
.focus-visible:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Larger focus targets on mobile */
@media (max-width: 640px) {
  .focus-visible:focus {
    @apply ring-4 ring-offset-4;
  }
}
```

## Best Practices Summary

1. **Mobile First**: Design for mobile, enhance for larger screens
2. **Touch Friendly**: Minimum 44px touch targets
3. **Performance**: Optimize images and conditional loading
4. **Accessibility**: Maintain usability across all devices
5. **Testing**: Regular testing on real devices
6. **Content Strategy**: Prioritize content for smaller screens
7. **Navigation**: Clear, accessible navigation on all devices
