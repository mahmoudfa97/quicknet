"use client"

import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/components/AuthProvider"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "@/components/LoginForm"
import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import Clients from "./pages/Clients"
import Payments from "./pages/Payments"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const AuthenticationFlow = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  return <LoginForm onToggleMode={() => setIsRegisterMode(!isRegisterMode)} isRegisterMode={isRegisterMode} />
}

const AppRoutes = () => {
  const { authState } = useAuth()

  if (!authState.isAuthenticated) {
    return <AuthenticationFlow />
  }
  
  if(!authState.user?.isAdmin) {
    return (    <Routes>
      <Route path="/" element={<Clients />} />
      <Route path="/clients" element={<Clients />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes> )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute adminOnly>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/clients" element={<Clients />} />

      <Route
        path="/payments"
        element={
          <ProtectedRoute adminOnly>
            <Payments />
          </ProtectedRoute>
        }
      />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
