
# DoxyAI API Documentation

## Overview
DoxyAI is a medical AI assistant with real-time PubMed integration, statistical analysis, and clinical reasoning capabilities.

## Endpoints

### POST /doxy-ai
Main DoxyAI inference endpoint with RAG capabilities.

#### Request Format
```json
{
  "message": "Compare HbA1c reduction of Metformin vs Semaglutide"
}
```

#### Response Format
```json
{
  "response": "Clinical response with markdown formatting",
  "pubmedIntegrated": true,
  "articleCount": 5,
  "citations": [
    {
      "pmid": "27293260",
      "title": "Study title",
      "journal": "Journal name",
      "year": "2024",
      "authors": ["Author 1", "Author 2"],
      "doi": "10.1000/example",
      "pubmedUrl": "https://pubmed.ncbi.nlm.nih.gov/27293260/"
    }
  ],
  "hasCalculation": false,
  "calculationType": null,
  "ragEnabled": true,
  "searchStrategy": "PubMed RAG Pipeline - 5 Articles"
}
```

## Query Types

### Medical Queries
Trigger PubMed RAG pipeline with evidence-based responses.

**Examples:**
- `"Compare HbA1c reduction of Metformin vs Semaglutide"`
- `"Pembrolizumab vs Nivolumab efficacy in NSCLC"`
- `"What's the 5-year survival rate for triple-negative breast cancer?"`

### Statistical Queries
Automatically detect and perform medical calculations.

**Supported Calculations:**
- BMI: `"Calculate BMI for 70kg, 1.75m patient"`
- BSA: `"Body surface area for 80kg, 180cm patient"`
- Creatinine Clearance: `"Creatinine clearance for 65-year-old female, 60kg, creatinine 1.2"`

### Identity Queries
Handle questions about DoxyAI and DocMateX platform.

**Examples:**
- `"Who made you?"`
- `"What is DocMateX?"`

## PubMed Integration

### Search Strategy
1. Enhanced query construction with medical term mapping
2. Study type filtering (RCTs, meta-analyses)
3. Human studies and English language filters
4. Fallback to broader search if no results

### Abstract Processing
- Real-time PMID fetching via E-utilities API
- Structured XML parsing
- Citation metadata extraction
- DOI and PubMed URL generation

### Medical Term Mapping
```javascript
const medicalTerms = {
  'metformin': 'metformin[tw] OR glucophage[tw]',
  'semaglutide': 'semaglutide[tw] OR ozempic[tw] OR wegovy[tw]',
  'hba1c': 'hba1c[tw] OR "hemoglobin a1c"[tw] OR "glycated hemoglobin"[tw]'
  // ... more mappings
};
```

## Statistical Engine

### Available Functions
```javascript
{
  bmi: (weight, height) => weight / (height * height),
  bsa: (weight, height) => Math.sqrt((weight * height) / 3600),
  creatinineClearance: (age, weight, creatinine, isFemale),
  chisquare: (observed[], expected[]),
  bodyFatPercentage: (bmi, age, isMale),
  idealBodyWeight: (height, isMale)
}
```

### Detection Patterns
- BMI: `/bmi|body mass index|weight.*height/i`
- BSA: `/bsa|body surface area/i`
- Creatinine: `/creatinine clearance|cockroft|gault/i`

## Response Structure

### Clinical Format
```markdown
## 🔬 Clinical Assessment
Brief clinical overview

## 📊 Key Research Findings
- Evidence from recent literature (PMIDs cited)
- Comparative data and statistics
- Trial names and endpoints

## 💊 Clinical Recommendations  
- Evidence-based approaches
- Risk-benefit considerations

## 📈 Statistical Analysis
[Calculations when applicable]

## 🔗 References & Citations
- PubMed sources with PMIDs

## ⚠️ Clinical Disclaimer
Professional guidance notice
```

## Error Handling

### Common Errors
- Missing GEMINI_API_KEY: Returns 500 with configuration error
- Empty message: Returns 400 with validation error
- PubMed API failure: Graceful fallback to general knowledge
- Gemini API error: Returns 500 with generation error

### CORS Support
All endpoints include CORS headers for web application integration.

## Authentication
Uses Supabase authentication. Calls are made through the Supabase client with automatic token handling.

## Rate Limits
Inherits Supabase Edge Function rate limits. PubMed E-utilities respects NCBI guidelines (max 3 requests/second).

## Usage Examples

### Frontend Integration
```typescript
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase.functions.invoke('doxy-ai', {
  body: { message: 'Compare HbA1c reduction of Metformin vs Semaglutide' }
});

if (!error && data) {
  console.log('Response:', data.response);
  console.log('Citations:', data.citations);
  console.log('PubMed integrated:', data.pubmedIntegrated);
}
```

### React Component Usage
```typescript
import DoxyAIIntegration from '@/components/doxy/DoxyAIIntegration';

<DoxyAIIntegration 
  context="Patient case context"
  placeholder="Ask DoxyAI for medical insights..."
  title="Clinical Consultation"
/>
```

## Legacy API Integration Guide

### API Service Pattern
```typescript
// src/lib/api/baseApi.ts
class ApiService {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.headers,
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
```

### Feature-Specific Services
```typescript
// src/lib/api/userService.ts
export const userService = {
  getProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (id: string, data: UserData) => api.post(`/users/${id}`, data),
  getUsers: (params: SearchParams) => api.get('/users', { params }),
};

// src/lib/api/postService.ts
export const postService = {
  getPosts: () => api.get('/posts'),
  createPost: (data: PostData) => api.post('/posts', data),
  updatePost: (id: string, data: PostData) => api.post(`/posts/${id}`, data),
};
```

## React Query Integration

### Query Hooks
```typescript
// src/hooks/api/useUsers.ts
export const useUsers = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getProfile(id),
    enabled: !!id,
  });
};
```

### Mutation Hooks
```typescript
// src/hooks/api/useUserMutations.ts
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserData }) =>
      userService.updateProfile(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

## Authentication Integration

### Auth Service
```typescript
// src/lib/auth/authService.ts
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('docmatex_token', response.token);
    return response;
  },

  logout: () => {
    localStorage.removeItem('docmatex_token');
    // Redirect to login
  },

  getToken: () => localStorage.getItem('docmatex_token'),

  isAuthenticated: () => !!authService.getToken(),
};
```

### Auth Context
```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Implementation...
};
```

## Error Handling

### API Error Types
```typescript
interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiException extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
```

### Global Error Handler
```typescript
// src/lib/api/errorHandler.ts
export const handleApiError = (error: ApiException) => {
  // Log to Sentry
  captureException(error);

  // Show user-friendly message
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });

  // Handle specific error cases
  if (error.status === 401) {
    // Redirect to login
    authService.logout();
  }
};
```

## Data Types

### User Types
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  specialty?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  specialty?: string;
}
```

### Post Types
```typescript
interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface CreatePostRequest {
  title: string;
  content: string;
  tags: string[];
}
```

## Recommended Backend Integration

### Supabase Integration (Recommended)
1. Click the Supabase button in Lovable interface
2. Set up authentication tables
3. Configure Row Level Security (RLS)
4. Use Supabase client instead of custom API service

### Alternative: Custom Backend
1. Set up Express/FastAPI backend
2. Implement JWT authentication
3. Create REST/GraphQL endpoints
4. Add proper validation and error handling

## Migration Strategy

### Phase 1: Authentication
- Implement login/logout functionality
- Add protected routes
- Update navigation based on auth state

### Phase 2: Data Persistence
- Replace localStorage with API calls
- Implement CRUD operations
- Add optimistic updates

### Phase 3: Real-time Features
- Add WebSocket connections
- Implement live notifications
- Add collaborative features

## Testing API Integration

### Mock Service Worker (MSW)
```typescript
// src/mocks/handlers.ts
export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json(mockUsers));
  }),

  rest.post('/api/users', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
];
```

### Integration Tests
```typescript
test('user login flow', async () => {
  render(<LoginForm />);
  
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(screen.getByText('Login'));
  
  await waitFor(() => {
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});
```
