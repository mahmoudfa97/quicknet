"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type { AuthState } from "@/types"
import { supabase } from "@/lib/supabase"

export const AuthContext = createContext<{
  authState: AuthState
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}>({
  authState: { isAuthenticated: false, user: null },
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Hydrate auth state from Supabase on mount
  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("id, username, is_admin")
          .eq("id", session.user.id)
          .single()

        if (userData) {
          setAuthState({
            isAuthenticated: true,
            user: {
              id: userData.id,
              username: userData.username,
              isAdmin: userData.is_admin,
            },
          })
        }
      }

      setIsLoading(false)
    }

    initAuth()

    // ✅ Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from("users")
          .select("id, username, is_admin")
          .eq("id", session.user.id)
          .single()
          .then(({ data: userData }) => {
            if (userData) {
              setAuthState({
                isAuthenticated: true,
                user: {
                  id: userData.id,
                  username: userData.username,
                  isAdmin: userData.is_admin,
                },
              })
            }
          })
      } else {
        setAuthState({ isAuthenticated: false, user: null })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}`, // 👈 fake email format
      password,
    })

    if (error || !data.user) return false

    const { data: userData } = await supabase
      .from("users")
      .select("id, username, is_admin")
      .eq("id", data.user.id)
      .single()

    if (!userData) return false

    setAuthState({
      isAuthenticated: true,
      user: {
        id: userData.id,
        username: userData.username,
        isAdmin: userData.is_admin,
      },
    })
    return true
  }

  const register = async (username: string, password: string): Promise<boolean> => {
    // Check if username exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle()

    if (existingUser) return false

    // Create auth account with fake email
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `${username}`,
      password,
    })

    if (authError || !authData.user) return false

    // Count users to set first user as admin
    const { count } = await supabase.from("users").select("*", { count: "exact", head: true })

    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      username,
      is_admin: count === 0,
    })

    if (profileError) return false

    return true
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setAuthState({ user: null, isAuthenticated: false })
  }

  return { authState, isLoading, login, register, logout }
}
