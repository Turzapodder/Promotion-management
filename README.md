# Full-Stack Authentication App

A modern full-stack application with React frontend and Express.js backend, featuring authentication pages with routing.

## 🏗️ Project Structure

```
practice/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   ├── login-form.tsx
│   │   │   └── signup-form.tsx
│   │   ├── pages/        # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── lib/          # Utilities
│   │   └── App.tsx       # Main app with routing
│   └── package.json
└── backend/           # Express.js + TypeScript
    ├── src/
    │   └── index.ts      # Server entry point
    └── package.json
```

## 🚀 Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm run dev          # Development server (http://localhost:5173)
```

### Backend Setup
```bash
cd backend
npm install
npm run dev          # Development server (http://localhost:3000)
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **ts-node-dev** - Development server

## 📱 Features

### Current Implementation
- ✅ Login/Signup page routing (`/login`, `/signup`)
- ✅ Responsive authentication forms
- ✅ Modern UI with shadcn/ui components
- ✅ TypeScript throughout
- ✅ Hot reload for development

### Authentication Forms
- **Login**: Email/password + OAuth buttons (Apple, Google)
- **Signup**: Name, email, password confirmation
- **Navigation**: Seamless routing between forms

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Run production build

## 🎨 UI Components

Built with **shadcn/ui** (New York style):
- Form components (Field, Input, Button)
- Card layouts
- Responsive design
- Dark/light theme support

## 🛣️ Routing

- `/` → Redirects to `/login`
- `/login` → Login page
- `/signup` → Signup page

## 📝 Next Steps

### Backend Development
1. Add authentication endpoints (`/api/auth/login`, `/api/auth/signup`)
2. Implement JWT token handling
3. Add password hashing (bcrypt)
4. Database integration (MongoDB/PostgreSQL)
5. Input validation middleware

### Frontend Enhancements
1. Form validation
2. API integration
3. Protected routes
4. User state management
5. Error handling

### Production Ready
1. Environment variables
2. CORS configuration
3. Rate limiting
4. Security headers
5. Docker containerization

## 🔐 Environment Variables

Create `.env` files:

**Backend (.env)**
```
PORT=3000
JWT_SECRET=your_jwt_secret
DB_CONNECTION_STRING=your_db_url
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000
```

## 📦 Key Dependencies

### Frontend
- `react-router-dom` - Routing
- `@radix-ui/*` - Headless UI primitives
- `tailwindcss` - Styling
- `lucide-react` - Icons

### Backend
- `express` - Web framework
- `@types/express` - TypeScript types
- `ts-node-dev` - Development server

Ready to build your authentication system! 🚀