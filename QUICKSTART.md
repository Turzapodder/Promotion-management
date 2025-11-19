# Quick Start Guide

## Complete JWT Authentication System

### What's Included
✅ Access & Refresh Tokens (15min / 7 days)  
✅ Automatic Token Refresh  
✅ React Query Integration  
✅ Protected Routes  
✅ Rate Limiting  
✅ Password Validation  
✅ PostgreSQL Database  

---

## 🚀 Quick Setup (5 minutes)

### 1. Database Setup
```bash
# Create PostgreSQL database
sudo -u postgres psql
CREATE DATABASE auth_db;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE auth_db TO myuser;
\q

# Run schema
cd backend
psql -U myuser -d auth_db -f src/config/database.sql
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run dev
```

Backend: http://localhost:3000 ✅

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173 ✅

---

## 🎯 Test It Out

1. **Open**: http://localhost:5173/signup
2. **Register**: Create account (password needs: 8+ chars, uppercase, lowercase, number, special char)
3. **Login**: Use your credentials
4. **Dashboard**: See your profile with logout button

---

## 🔑 Key Features

### Token Management
- **Access Token**: 15 minutes (for API requests)
- **Refresh Token**: 7 days (stored in database)
- **Auto-Refresh**: Frontend automatically refreshes expired tokens
- **Logout**: Invalidates refresh token

### Security
- Rate limiting: 5 login attempts per 15 minutes
- Password hashing with bcrypt (12 rounds)
- SQL injection prevention
- CORS protection
- Helmet.js security headers

### API Endpoints
```
POST /api/auth/signup       - Register
POST /api/auth/login        - Login
POST /api/auth/refresh      - Refresh token
POST /api/auth/logout       - Logout
GET  /api/auth/profile      - Get profile (protected)
PUT  /api/auth/profile      - Update profile (protected)
POST /api/auth/change-password - Change password (protected)
```

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/auth_db
JWT_SECRET=your-32-char-secret-key-here
JWT_REFRESH_SECRET=your-32-char-refresh-secret-here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

**Database connection error?**
- Check PostgreSQL is running: `sudo service postgresql status`
- Verify DATABASE_URL in backend/.env

**CORS error?**
- Ensure CORS_ORIGIN matches frontend URL
- Check both servers are running

**Token not refreshing?**
- Open browser DevTools → Network tab
- Check for /api/auth/refresh calls
- Verify refresh_tokens table exists

**Rate limit error?**
- Wait 15 minutes or restart backend

---

## 📚 Tech Stack

**Backend**: Express.js, TypeScript, PostgreSQL, JWT, bcrypt  
**Frontend**: React 19, TypeScript, React Query, React Router, Tailwind CSS, shadcn/ui

---

## 🎓 How It Works

1. User logs in → receives access + refresh tokens
2. Frontend stores both tokens in localStorage
3. API requests use access token in Authorization header
4. When access token expires (15min):
   - Frontend detects 401 error
   - Automatically calls /api/auth/refresh with refresh token
   - Gets new access + refresh tokens
   - Retries original request
5. When refresh token expires (7 days):
   - User must login again

---

## 📖 Full Documentation

See [SETUP.md](./SETUP.md) for detailed documentation.

---

## ✅ You're Ready!

Your complete JWT authentication system is now running with:
- Secure token management
- Automatic refresh
- Protected routes
- Rate limiting
- Production-ready architecture

Happy coding! 🎉
