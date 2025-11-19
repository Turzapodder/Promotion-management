import { Routes, Route, Navigate } from "react-router-dom"
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import { AuthProvider, useAuth } from "./hooks/useAuth"
import { queryClient } from './lib/queryClient'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Button } from './components/ui/button'

// Simple Dashboard component for demonstration
const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
        <div className="space-y-4">
          <p>Welcome, {user?.first_name || user?.email}!</p>
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
            <p><strong>Verified:</strong> {user?.is_verified ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
