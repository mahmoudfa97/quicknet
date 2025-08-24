"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { authState } = useAuth()

  if (adminOnly && !authState.user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
