# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production assets with Vite
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on TypeScript/React files

### Environment Setup
- Copy `.env.local.example` to `.env.local` (if exists) or create `.env.local` with Supabase credentials:
  ```
  VITE_SUPABASE_URL=https://your-project-ref.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  ```

## Architecture Overview

### Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + custom primary/secondary color system
- **State Management**: Zustand for client state
- **Backend**: Supabase (auth, database, real-time)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM v6

### Project Structure
```
src/
├── components/          # Reusable React components
│   ├── AuthProvider.tsx # Auth context wrapper
│   ├── RequireAuth.tsx  # Route protection component
│   └── Layout.tsx       # Main layout wrapper
├── pages/              # Route-level components
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   └── LoginPage.tsx
├── store/              # Zustand state stores
│   ├── authStore.ts    # Authentication state
│   ├── medicalRecordStore.ts
│   └── notificationStore.ts
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Supabase client setup
│   ├── blockchain.ts   # Blockchain verification utilities
│   └── database.types.ts # TypeScript types from Supabase
└── App.tsx             # Main app with routing
```

### Authentication Flow
- Uses Supabase Auth with email/password
- `AuthProvider` wraps the app and initializes user session
- `RequireAuth` component protects dashboard routes
- Authentication state managed via `authStore` (Zustand)
- Automatic profile creation on signup/signin
- Dashboard route is outside main Layout to hide navbar

### State Management Pattern
- **Zustand stores** for global state (auth, medical records, notifications)
- Each store follows consistent pattern:
  - Loading states (`isLoading`)
  - Error handling (`error`)
  - Async actions with try/catch
- Stores are kept in separate files by domain

### Database Integration
- Supabase PostgreSQL backend
- Auto-generated TypeScript types in `database.types.ts`
- Medical records include blockchain verification hashes
- Profile management with role-based access (patient/doctor)

### Blockchain Verification
- Custom blockchain verification system via `lib/blockchain.ts`
- SHA-256 hashing for medical record integrity
- Mock transaction logs for development
- Verification status tracking in database

## Key Patterns

### Component Architecture
- Functional components with TypeScript
- Framer Motion for animations (consistent `initial`, `animate`, `transition` patterns)
- Lucide React icons throughout
- Tailwind utility classes with custom color system

### Error Handling
- Comprehensive error handling in Zustand stores
- Supabase configuration validation (`isSupabaseConfigured()`)
- Graceful fallbacks when Supabase is not configured
- User-friendly error messages

### Routing Structure
- Public routes under `Layout` wrapper (with navbar)
- Protected dashboard route outside Layout
- Authentication redirects handled in auth store
- Route-based code splitting ready

### Environment Configuration
- Vite environment variables with `VITE_` prefix
- Supabase credentials required for full functionality
- Development fallbacks for missing configuration

## Supabase Setup

The app requires Supabase configuration. See `SUPABASE_SETUP.md` for detailed setup instructions. Without proper Supabase credentials, the app will show configuration errors but remain functional for development.

## Development Notes

### TypeScript Configuration
- Project uses TypeScript composite configuration
- Separate configs for app (`tsconfig.app.json`) and Node (`tsconfig.node.json`)
- Strict type checking enabled

### Build System
- Vite for fast development and optimized builds
- ESLint configured for React/TypeScript with hooks plugin
- Tailwind CSS with PostCSS processing
- Lucide React excluded from Vite optimization for better performance