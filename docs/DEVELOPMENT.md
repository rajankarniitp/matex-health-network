
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

### 2. Component Development Pattern

#### File Structure
```
src/components/feature/
├── FeatureComponent.tsx     # Main component
├── FeatureForm.tsx         # Form component
├── FeatureCard.tsx         # Display component
└── index.ts                # Exports
```

#### Component Template
```tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureComponentProps {
  className?: string;
  title: string;
  onAction?: () => void;
}

const FeatureComponent: React.FC<FeatureComponentProps> = ({
  className,
  title,
  onAction
}) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onAction}>
          Action
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureComponent;
```

### 3. State Management

#### Local State
```tsx
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
```

#### Form State
```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    field: ''
  }
});
```

#### Server State
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['feature', id],
  queryFn: () => fetchFeature(id),
});
```

### 4. Styling Guidelines

#### Tailwind Classes
- Use responsive prefixes: `sm:`, `md:`, `lg:`
- Use semantic spacing: `p-4`, `m-2`, `space-y-4`
- Use color system: `bg-primary`, `text-secondary`

#### Component Variants
```tsx
const variants = {
  default: "bg-white border",
  outlined: "border-2 bg-transparent",
  filled: "bg-primary text-white"
};
```

### 5. Error Handling

#### Component Level
```tsx
try {
  // risky operation
} catch (error) {
  console.error('Feature error:', error);
  toast({
    title: "Error",
    description: "Something went wrong",
    variant: "destructive"
  });
}
```

#### API Level
```tsx
const { data, error } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  onError: (error) => {
    console.error('API Error:', error);
  }
});
```

## Code Quality Standards

### TypeScript
- Always define interfaces for props
- Use proper return types for functions
- Avoid `any` type
- Use union types for constrained values

### React Best Practices
- Use functional components with hooks
- Implement proper dependency arrays
- Use React.memo for performance optimization
- Handle cleanup in useEffect

### Performance
- Lazy load heavy components
- Optimize images and assets
- Use proper keys in lists
- Avoid unnecessary re-renders

## Testing Approach

### Component Testing
```tsx
import { render, screen } from '@testing-library/react';
import FeatureComponent from './FeatureComponent';

test('renders component correctly', () => {
  render(<FeatureComponent title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Hook Testing
```tsx
import { renderHook } from '@testing-library/react';
import useCustomHook from './useCustomHook';

test('hook returns expected value', () => {
  const { result } = renderHook(() => useCustomHook());
  expect(result.current.value).toBe(expectedValue);
});
```

## Debugging

### Browser DevTools
- Use React Developer Tools extension
- Monitor network requests
- Check console for errors
- Use Performance tab for optimization

### Common Issues
1. **Hydration Mismatch**: Check server/client rendering differences
2. **Memory Leaks**: Cleanup useEffect subscriptions
3. **Performance**: Use React Profiler to identify bottlenecks
4. **State Updates**: Ensure proper dependency arrays

## Deployment

### Build Process
```bash
npm run build      # Create production build
npm run preview    # Test production build locally
```

### Pre-deployment Checklist
- [ ] All TypeScript errors resolved
- [ ] No console errors in production
- [ ] Environment variables configured
- [ ] SEO meta tags updated
- [ ] Analytics tracking verified
- [ ] Error monitoring active
