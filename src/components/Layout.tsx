"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { LogOut, Users, BarChart3, Receipt } from "lucide-react"
import { Link } from "react-router-dom"

interface LayoutProps {
  children: ReactNode
  title: string
}

export const Layout = ({ children, title }: LayoutProps) => {
  const { authState, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" />
                </div>
                <h1 className="text-xl font-bold text-foreground">QuickNet</h1>
              </div>

              <nav className="hidden md:flex items-center space-x-1">
                {authState.user?.isAdmin && (
                  <Link to="/">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}

                <Link to="/clients">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Clients
                  </Button>
                </Link>

                {authState.user?.isAdmin && (
                  <Link to="/payments">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Receipt className="w-4 h-4" />
                      Payments
                    </Button>
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {authState.user?.username}
                {authState.user?.isAdmin && (
                  <span className="ml-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded">Admin</span>
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>
        {children}
      </main>
    </div>
  )
}
