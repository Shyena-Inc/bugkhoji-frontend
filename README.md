# 🐛 BugKhoji Frontend

A modern bug bounty platform interface built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Navigate to frontend
cd bugkhoji-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Application runs on **http://localhost:8080** (or next available port)

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- BugKhoji Backend running on port 4001

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:4001
VITE_APP_NAME=BugKhoji
VITE_APP_VERSION=1.0.0
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:8080` or show the port in terminal.

## 🎨 Features

### 🔐 Authentication
- User registration (Researcher/Organizer)
- Secure login with JWT
- Password reset
- Session management
- Auto token refresh

### 👨‍💻 Researcher Dashboard
- View all bug bounty programs
- Submit vulnerability reports
- Track report status
- View rewards and earnings
- Real-time notifications
- Personal leaderboard ranking

### 🏢 Organizer Dashboard
- Create and manage programs
- Review submitted reports
- Award bounties
- Manage program participants
- View analytics
- Process rewards

### 👨‍💼 Admin Panel
- User management
- System analytics
- Program oversight
- Report moderation
- User ban/unban
- Platform statistics

### 🏆 Leaderboard
- Global researcher rankings
- Program-specific leaderboards
- Time-based filters (all-time, monthly, weekly)
- Personal rank tracking

### 💰 Rewards System
- View earning history
- Track pending rewards
- Payment status
- Transaction details

### 🔔 Notifications
- Real-time updates
- Report status changes
- Reward notifications
- System announcements
- Mark as read
- Unread count badge

## 📱 Pages & Routes

### Public Routes
```
/                     → Landing page
/login               → Login page
/register            → Registration page
/forgot-password     → Password reset
```

### Researcher Routes
```
/dashboard           → Researcher dashboard
/programs            → Browse programs
/programs/:id        → Program details
/reports             → My reports
/reports/new         → Submit report
/rewards             → My rewards
/leaderboard         → Rankings
/profile             → Profile settings
/notifications       → Notifications
```

### Organizer Routes
```
/organizer/dashboard → Organizer dashboard
/organizer/programs  → Manage programs
/organizer/reports   → Review reports
/organizer/rewards   → Manage rewards
/organizer/analytics → Program analytics
```

### Admin Routes
```
/admin/dashboard     → Admin dashboard
/admin/users         → User management
/admin/programs      → Program oversight
/admin/reports       → Report moderation
/admin/analytics     → System analytics
```

## 🔌 API Integration

### Authentication Flow

```typescript
// Login
const response = await fetch('http://localhost:4001/v1/login/researcher', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token, refreshToken } = await response.json();
localStorage.setItem('token', token);
```

### Protected Requests

```typescript
// Fetch with auth token
const response = await fetch('http://localhost:4001/api/v1/programs', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### API Service Structure

```typescript
// services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const api = {
  // Auth
  login: (credentials) => post('/v1/login/researcher', credentials),
  register: (data) => post('/v1/register/researcher', data),
  
  // Programs
  getPrograms: () => get('/api/v1/programs'),
  getProgram: (id) => get(`/api/v1/programs/${id}`),
  
  // Reports
  submitReport: (data) => post('/api/v1/reports', data),
  getMyReports: () => get('/api/v1/researcher/reports'),
  
  // Leaderboard
  getLeaderboard: () => get('/user/leaderboard'),
  getMyRank: () => get('/user/leaderboard/my-rank'),
  
  // Rewards
  getRewards: () => get('/api/v1/researcher/rewards'),
  
  // Notifications
  getNotifications: () => get('/notifications'),
  markAsRead: (id) => patch(`/notifications/${id}/read`),
};
```

## 🎨 Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── RecentReports.tsx
│   │   └── ProgramList.tsx
│   ├── programs/
│   │   ├── ProgramCard.tsx
│   │   ├── ProgramDetails.tsx
│   │   └── ProgramForm.tsx
│   ├── reports/
│   │   ├── ReportCard.tsx
│   │   ├── ReportForm.tsx
│   │   └── ReportDetails.tsx
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx
│   │   ├── RankBadge.tsx
│   │   └── UserStats.tsx
│   └── notifications/
│       ├── NotificationBell.tsx
│       ├── NotificationList.tsx
│       └── NotificationItem.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProgramsPage.tsx
│   ├── ReportsPage.tsx
│   ├── LeaderboardPage.tsx
│   └── AdminPage.tsx
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── storage.ts
├── hooks/
│   ├── useAuth.ts
│   ├── usePrograms.ts
│   ├── useReports.ts
│   └── useNotifications.ts
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
├── types/
│   ├── user.ts
│   ├── program.ts
│   └── report.ts
├── App.tsx
└── main.tsx
```

## 🎨 Styling

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      }
    }
  }
}
```

### Custom Styles

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark;
  }
  
  .card {
    @apply bg-white shadow-md rounded-lg p-6;
  }
}
```

## 🔒 Authentication State Management

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Usage in components
const { user, isAuthenticated, login, logout } = useAuth();
```

## 📊 State Management

### Context API (Current)
- AuthContext - User authentication
- ThemeContext - Dark/light mode
- NotificationContext - Real-time notifications

### Future: Redux/Zustand (Optional)
```typescript
// store/index.ts
export const useStore = create((set) => ({
  programs: [],
  reports: [],
  setPrograms: (programs) => set({ programs }),
  addReport: (report) => set((state) => ({ 
    reports: [...state.reports, report] 
  })),
}));
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import { LoginForm } from './LoginForm';

test('renders login form', () => {
  render(<LoginForm />);
  expect(screen.getByText('Login')).toBeInTheDocument();
});
```

## 🔧 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

## 🐛 Troubleshooting

### Backend Connection Issues

**Problem**: Cannot connect to backend
```bash
# Check backend is running
curl http://localhost:4001/api/health

# Verify CORS settings in backend
# Check .env VITE_API_BASE_URL
```

**Solution**: Ensure backend is running on port 4001

### Build Errors

**Problem**: TypeScript errors
```bash
# Clear node_modules
rm -rf node_modules
npm install

# Clear cache
rm -rf dist
npm run build
```

### Hot Reload Not Working

```bash
# Restart dev server
npm run dev

# Clear browser cache
# Ctrl + Shift + R (hard refresh)
```

### Port Already in Use

```bash
# Kill process on port 8080
lsof -i :8080
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Programs = lazy(() => import('./pages/Programs'));
```

### Image Optimization
```typescript
// Use WebP format
<img src="image.webp" alt="..." loading="lazy" />
```

### Caching Strategy
```typescript
// Cache API responses
const cachedPrograms = localStorage.getItem('programs');
if (cachedPrograms && !isStale) {
  return JSON.parse(cachedPrograms);
}
```

## 📱 Responsive Design

### Breakpoints
```
sm: 640px   → Mobile
md: 768px   → Tablet
lg: 1024px  → Desktop
xl: 1280px  → Large Desktop
```

### Usage
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## 🎯 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Features Checklist

- ✅ User authentication
- ✅ Program browsing
- ✅ Report submission
- ✅ Leaderboard
- ✅ Rewards tracking
- ✅ Notifications
- ✅ Admin panel
- ✅ Responsive design
- ✅ Dark mode ready
- ✅ Error handling

## 🔐 Security Best Practices

1. **Token Storage**: Store JWT in httpOnly cookies (recommended) or localStorage
2. **CSRF Protection**: Use CSRF tokens for state-changing operations
3. **XSS Prevention**: Sanitize user inputs, use React's built-in escaping
4. **HTTPS**: Always use HTTPS in production
5. **Content Security Policy**: Configure CSP headers

## 📞 Support

For issues:
1. Check backend is running
2. Verify API endpoints
3. Check browser console
4. Review network tab
5. Clear cache and try again

## 📄 Scripts Reference

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

## 🎨 Design System

Colors, typography, and component patterns are documented in `src/styles/design-system.md`

## 📄 License

MIT License - See LICENSE file

---

**Built with ❤️ for BugKhoji Platform**

*Need help? Check the backend README for API documentation.*