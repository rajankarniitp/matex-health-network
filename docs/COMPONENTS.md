# Component Documentation

## Component Categories

### 1. UI Components (`src/components/ui/`)
Auto-generated shadcn/ui components. These provide the foundation for all UI elements:

- **Forms**: `input.tsx`, `button.tsx`, `form.tsx`
- **Layout**: `card.tsx`, `separator.tsx`, `sheet.tsx`
- **Feedback**: `toast.tsx`, `alert.tsx`, `skeleton.tsx`
- **Navigation**: `tabs.tsx`, `dropdown-menu.tsx`, `navigation-menu.tsx`

### 2. Layout Components (`src/components/layout/`)

#### `Navbar.tsx`
- Main navigation component
- Responsive design with mobile menu
- Theme toggle integration
- Authentication state handling

#### `Footer.tsx`
- Site footer with links and branding
- Social media links
- Legal links

#### `DashboardLayout.tsx`
- Layout wrapper for authenticated pages
- Sidebar navigation
- Header with user info

### 3. Feature Components

#### Home Page (`src/components/home/`)
- `Hero.tsx`: Landing page hero section
- `Features.tsx`: Feature showcase
- `Stats.tsx`: Statistics display
- `Testimonials.tsx`: User testimonials

#### Notifications (`src/components/notifications/`)
- `NotificationDropdown.tsx`: Notification center

## Component Patterns

### 1. Standard Component Structure
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

### 2. Form Components
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  // validation schema
});

const FormComponent = () => {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      {/* form fields */}
    </Form>
  );
};
```

### 3. Data Fetching Components
```tsx
import { useQuery } from '@tanstack/react-query';

const DataComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data-key'],
    queryFn: fetchData,
  });

  if (isLoading) return <Skeleton />;
  if (error) return <Alert>Error loading data</Alert>;

  return <div>{/* render data */}</div>;
};
```

## Best Practices

### Do's ✅
- Use TypeScript interfaces for all props
- Include className prop for styling flexibility
- Use React.forwardRef for components that need refs
- Handle loading and error states
- Use semantic HTML elements
- Include ARIA labels for accessibility

### Don'ts ❌
- Don't use any types
- Don't forget error boundaries for complex components
- Don't inline large objects in JSX
- Don't use index as key in lists
- Don't mutate props directly

## Component Composition Examples

### Modal with Form
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Form</Button>
  </DialogTrigger>
  <DialogContent>
    <Form>
      {/* form content */}
    </Form>
  </DialogContent>
</Dialog>
```

### Data Table with Actions
```tsx
<Card>
  <CardHeader>
    <CardTitle>Data Table</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      {/* table content */}
    </Table>
  </CardContent>
</Card>
```
