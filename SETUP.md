# JWT Authentication System - Setup Guide

## Complete Authentication System with Access & Refresh Tokens

### Features
- ✅ JWT Access & Refresh Token Authentication
- ✅ Automatic Token Refresh
- ✅ React Query Integration
- ✅ Protected Routes
- ✅ Rate Limiting
- ✅ Password Hashing (bcrypt)
- ✅ Input Validation
- ✅ PostgreSQL Database
- ✅ TypeScript (Frontend & Backend)

## Backend Setup

### 1. Database Setup

```bash
# Install PostgreSQL (if not installed)
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql  # macOS
```

### 2. Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE auth_db;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE auth_db TO your_username;
\q
```

### 3. Run Database Schema

```bash
cd backend
psql -U your_username -d auth_db -f src/config/database.sql
```

### 4. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/auth_db
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-jwt-key-at-least-32-characters-long
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 5. Install Dependencies & Start

```bash
npm install
npm run dev
```

Backend runs on: http://localhost:3000

## Frontend Setup

### 1. Configure Environment

```bash
cd frontend
```

`.env` already exists with:
```env
VITE_API_URL=http://localhost:3000
```

### 2. Install Dependencies & Start

```bash
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## API Endpoints

### Public Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Protected Endpoints (Requires Access Token)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

## Token Flow

1. **Login/Signup**: Returns `accessToken` (15min) & `refreshToken` (7 days)
2. **API Requests**: Use `accessToken` in Authorization header
3. **Token Expired**: Frontend automatically refreshes using `refreshToken`
4. **Refresh Token Expired**: User must login again
5. **Logout**: Invalidates refresh token in database

## Security Features

- Access tokens expire in 15 minutes
- Refresh tokens stored in database
- Rate limiting on auth endpoints (5 attempts/15min)
- Password requirements: 8+ chars, uppercase, lowercase, number, special char
- CORS configured for specific origins
- Helmet.js security headers
- SQL injection prevention with parameterized queries
- XSS protection

## Testing the System

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

### 3. Access Protected Route
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Frontend Usage

### Login
1. Navigate to http://localhost:5173/login
2. Enter credentials
3. Automatically redirected to dashboard

### Signup
1. Navigate to http://localhost:5173/signup
2. Fill form (password must meet requirements)
3. Automatically redirected to dashboard

### Dashboard
- Protected route (requires authentication)
- Shows user profile
- Logout button

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database and tables exist

### CORS Error
- Check CORS_ORIGIN in backend .env
- Ensure frontend URL matches

### Token Refresh Not Working
- Check JWT_REFRESH_SECRET is set
- Verify refresh_tokens table exists
- Check browser console for errors

### Rate Limit Error
- Wait 15 minutes
- Or restart backend server (clears in-memory store)

## Production Deployment

### Backend
1. Set strong JWT secrets (32+ characters)
2. Use environment-specific CORS_ORIGIN
3. Set NODE_ENV=production
4. Use proper database connection pooling
5. Enable HTTPS
6. Use Redis for rate limiting (replace in-memory store)

### Frontend
1. Update VITE_API_URL to production backend
2. Build: `npm run build`
3. Deploy dist folder to CDN/hosting

## Tech Stack

### Backend
- Express.js
- TypeScript
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- helmet
- cors

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- React Query (TanStack Query)
- Tailwind CSS
- shadcn/ui

## License
MIT
