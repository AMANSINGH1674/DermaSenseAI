# DermaSenseAI 🔬

A modern AI-powered dermatology application built with React, TypeScript, and Supabase. DermaSenseAI provides intelligent skin analysis, secure medical record management with blockchain verification, and comprehensive patient profile management.

![DermaSenseAI](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite&logoColor=white)

## ✨ Features

### 🔐 Authentication & Security
- Secure user authentication with Supabase Auth
- Row Level Security (RLS) for data protection
- JWT-based session management
- Role-based access control (Patient/Doctor)

### 👤 Profile Management
- **Comprehensive User Profiles** with editable fields:
  - Full Name
  - Email Address
  - Age
  - Skin Type (Normal, Oily, Dry, Combination, Sensitive)
  - Dermatologist Information
  - Profile Avatar
- **Real-time Profile Updates** with instant UI synchronization
- **Form Validation** with proper error handling

### 🤖 AI-Powered Analysis
- Intelligent skin health scoring
- Mole detection and analysis
- Hydration level assessment
- UV exposure risk evaluation
- AI-powered recommendations and insights

### 🔗 Blockchain Verification
- SHA-256 hashing for medical record integrity
- Mock blockchain transaction logging
- Verification status tracking
- Tamper-proof medical records

### 📊 Dashboard & Analytics
- Interactive health metrics dashboard
- Recent medical records tracking
- Notification system
- Appointment scheduling
- Real-time data visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AMANSINGH1674/DermaSenseAI.git
   cd DermaSenseAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase database**
   
   Go to your Supabase SQL Editor and run the setup script:
   ```sql
   -- Run the contents of create-profiles-table.sql
   -- Then run add-profile-columns.sql to add additional columns
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript with excellent developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom color system
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM v6** - Client-side routing
- **Lucide React** - Beautiful, customizable icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time subscriptions** - Live data updates

### State Management
- **Zustand** - Lightweight state management
- **Custom hooks** - Reusable stateful logic
- **Async state handling** - Loading states and error management

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing and optimization
- **Vite plugins** - Development and build optimizations

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── AuthProvider.tsx # Authentication context wrapper
│   ├── RequireAuth.tsx  # Route protection component
│   ├── Layout.tsx       # Main layout with navigation
│   ├── EditProfileModal.tsx # Profile editing form
│   └── UserProfile.tsx  # Profile display component
├── pages/              # Route-level page components
│   ├── HomePage.tsx    # Landing page
│   ├── DashboardPage.tsx # Main dashboard
│   ├── LoginPage.tsx   # Authentication
│   └── ...            # Other pages
├── store/              # Zustand state stores
│   ├── authStore.ts    # Authentication state management
│   ├── medicalRecordStore.ts # Medical records state
│   └── notificationStore.ts # Notifications state
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Supabase client configuration
│   ├── blockchain.ts   # Blockchain verification utilities
│   └── database.types.ts # TypeScript types from Supabase
└── App.tsx             # Main application component with routing
```

## 🗄️ Database Schema

### Profiles Table
```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text,
  role text CHECK (role IN ('patient', 'doctor')) DEFAULT 'patient',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  age integer,
  skin_type text,
  dermatologist text,
  email text
);
```

### Medical Records Table
```sql
CREATE TABLE public.medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.profiles(id),
  title text NOT NULL,
  description text,
  record_date timestamp with time zone,
  provider text,
  blockchain_hash text,
  verification_status text CHECK (verification_status IN ('pending', 'verified', 'failed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production assets with Vite |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on TypeScript/React files |

## 🔧 Configuration

### Environment Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Supabase Configuration
1. Create a new Supabase project
2. Enable Row Level Security on all tables
3. Set up authentication providers
4. Run the provided SQL migration scripts
5. Configure your environment variables

## 🔒 Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **JWT Authentication** - Secure token-based authentication
- **HTTPS Only** - All communications encrypted
- **Input Validation** - Client and server-side validation
- **SQL Injection Protection** - Parameterized queries via Supabase
- **XSS Protection** - React's built-in XSS protection

## 📱 Responsive Design

DermaSenseAI is fully responsive and works seamlessly across:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aman Singh**
- GitHub: [@AMANSINGH1674](https://github.com/AMANSINGH1674)
- LinkedIn: [Connect with me](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Framer Motion](https://framer.com/motion) for smooth animations
- [Lucide](https://lucide.dev) for beautiful icons
- [React](https://react.dev) team for the incredible framework

## 🐛 Bug Reports & Feature Requests

If you encounter any bugs or have feature requests, please:
1. Check the [Issues](https://github.com/AMANSINGH1674/DermaSenseAI/issues) page
2. Create a new issue with detailed information
3. Use the appropriate issue template

## 📊 Project Status

🚀 **Status**: Active Development  
🔄 **Version**: 0.1.0  
📅 **Last Updated**: January 2025

---

<div align="center">
  
**⭐ Star this repository if you find it helpful!**

</div>