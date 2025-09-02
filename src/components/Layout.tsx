"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { LogOut, Users, BarChart3, Receipt } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "./ui/sidebar"

interface LayoutProps {
  children: ReactNode
  title: string
}

export const Layout = ({ children, title }: LayoutProps) => {
  const { authState, logout } = useAuth()
  const location = useLocation()

  return (
    <SidebarProvider>
      {/* The actual sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-2 py-4">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-foreground">QuickNet</h1>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {authState.user?.isAdmin && (
              <SidebarMenuItem>
                <Link to="/">
                  <SidebarMenuButton
                    isActive={location.pathname === "/"}
                    tooltip="Dashboard"
                  >
                    <BarChart3 /> <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <Link to="/clients">
                <SidebarMenuButton
                  isActive={location.pathname.startsWith("/clients")}
                  tooltip="Clients"
                >
                  <Users /> <span>Clients</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            {authState.user?.isAdmin && (
              <SidebarMenuItem>
                <Link to="/payments">
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith("/payments")}
                    tooltip="Payments"
                  >
                    <Receipt /> <span>Payments</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-sm text-muted-foreground">
              {authState.user?.username}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Page content area */}
      <SidebarInset>
        <header className="flex items-center h-16 px-4 border-b border-border bg-card">
          <SidebarTrigger />
          <h2 className="ml-4 text-xl font-bold text-foreground">{title}</h2>
        </header>

        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
