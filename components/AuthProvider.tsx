"use client"

import { SessionProvider } from "next-auth/react"
import { SessionGuard } from "./SessionGuard"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={30} 
      refetchOnWindowFocus={true}
    >
      <SessionGuard>
        {children}
      </SessionGuard>
    </SessionProvider>
  )
}
