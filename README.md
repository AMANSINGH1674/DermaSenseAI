# 🏥 DermaSenseAI - Educational Dermatology Platform

A comprehensive web application providing educational guidance on dermatological conditions, skin health, and medical document analysis.

## ✨ Features

### 🩺 **Intelligent Chat Assistant**
- Contextual responses about common skin conditions (acne, psoriasis, eczema, moles)
- Professional dermatological guidance and education
- Proper medical disclaimers and referral recommendations
- Conversation history saved to database

### 📷 **Image Analysis Guidance**
- Comprehensive skin condition evaluation guidance
- ABCDE melanoma screening education
- Professional referral recommendations
- File upload with drag-and-drop support

### 📄 **Medical Document Review**
- PDF document analysis guidance
- Medical report interpretation assistance
- Key findings and recommendation identification
- Educational content about medical terminology

### 🔐 **User Management**
- Secure authentication with Supabase
- User profiles and personalization
- Chat history persistence
- Row-level security (RLS) implementation

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Build Tool**: Vite
- **UI Components**: Custom components with Lucide React icons
- **Animations**: Framer Motion
- **State Management**: Zustand

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+
- Supabase account

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/AMANSINGH1674/DermaSenseAI.git
   cd DermaSenseAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase database**
   Run the SQL files in your Supabase SQL Editor:
   ```bash
   # Create user profiles table
   cat safe-create-profiles-table.sql | supabase db sql

   # Create chat messages table
   cat create-chat-tables.sql | supabase db sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗃️ Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);
```

### Chat Messages Table
```sql
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  role text CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  image_url text,
  attachment_url text,
  attachment_type text CHECK (attachment_type IN ('image', 'pdf')),
  created_at timestamptz DEFAULT now()
);
```

## 🎯 Usage Examples

### Chat Interface
Ask questions about dermatological topics:
- "What are the signs of melanoma?"
- "Tell me about acne treatment options"
- "How do I examine a suspicious mole?"
- "What causes psoriasis flare-ups?"

### Image Upload
1. Click the camera icon or upload button
2. Select a dermatological image
3. Receive comprehensive analysis guidance
4. Get professional referral recommendations

### PDF Analysis
1. Upload medical documents or reports
2. Receive structured review guidance
3. Get key findings explanations
4. Understand next steps and follow-up care

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
DermaSenseAI/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # React components
│   │   ├── ChatInterface.tsx
│   │   ├── AuthProvider.tsx
│   │   └── ...
│   ├── lib/                 # Utility libraries
│   │   ├── supabase.ts
│   │   └── database.types.ts
│   ├── pages/               # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── ...
│   ├── services/            # Business logic
│   │   └── medgemmaService.ts
│   ├── store/               # State management
│   │   └── authStore.ts
│   └── main.tsx
├── .env.local               # Environment variables
└── package.json
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Get your project URL and anon key from Settings → API
3. Enable Row Level Security (RLS) on all tables
4. Create the required database tables using provided SQL files

### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🚨 Important Disclaimers

**Medical Disclaimer**: This application provides educational information only and is not intended for medical diagnosis or treatment. Always consult qualified healthcare professionals for medical concerns.

**Educational Purpose**: All responses and guidance provided by the system are for educational purposes and should not replace professional medical advice.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide
2. Search existing [GitHub Issues](https://github.com/AMANSINGH1674/DermaSenseAI/issues)
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- Built with React and modern web technologies
- Database and authentication powered by Supabase
- Medical guidance based on established dermatological practices
- UI/UX inspired by modern healthcare applications

---

**⚠️ Remember**: This is an educational platform. For actual medical concerns, always consult with qualified healthcare professionals.