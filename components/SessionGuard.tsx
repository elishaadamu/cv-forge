"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 1. Monitor NextAuth status
    if (status === "unauthenticated") {
      const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/builder') || pathname.startsWith('/templates')
      if (isProtectedRoute) {
        console.warn("Session expired. Redirecting to login...")
        signOut({ redirect: true, callbackUrl: `/login?callbackUrl=${pathname}` })
      }
    }

    // 2. Global 401 Interceptor for manual fetch calls
    const originalFetch = window.fetch
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init)
      if (response.status === 401 && !input.toString().includes('/api/auth/session')) {
        console.error("401 Unauthorized detected in fetch. Logging out...")
        signOut({ redirect: true, callbackUrl: `/login?callbackUrl=${pathname}` })
      }
      return response
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [status, pathname])

  return <>{children}</>
}
