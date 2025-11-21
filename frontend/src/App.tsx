import { Routes, Route, Navigate } from "react-router-dom"
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DashboardPage from "./pages/DashboardPage"
import DashboardHome from "./pages/DashboardHome"
import OrdersPage from "./pages/OrdersPage"
import PromotionsPage from "./pages/PromotionsPage"
import ProductsPage from "./pages/ProductsPage"
import { AuthProvider } from "./hooks/useAuth"
import { queryClient } from './lib/queryClient'
import { ProtectedRoute } from './components/ProtectedRoute'

 

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
