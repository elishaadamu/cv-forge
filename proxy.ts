import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const isApiRoute = nextUrl.pathname.startsWith('/api')
  const isAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
  const isOnBuilder = nextUrl.pathname.startsWith('/builder')
  const isOnTemplates = nextUrl.pathname.startsWith('/templates')
  const isOnSettings = nextUrl.pathname.startsWith('/settings')

  // Don't interfere with Auth.js internal routes
  if (isAuthRoute) return

  if (!isLoggedIn) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Unauthorized. Session expired." }, 
        { status: 401 }
      )
    }

    if (isOnDashboard || isOnBuilder || isOnTemplates || isOnSettings) {
      // Exclude builder success page from auto-login redirect if needed, 
      // but usually, it's safer to just redirect all protected areas.
      const callbackUrl = nextUrl.pathname + nextUrl.search
      const loginUrl = new URL('/login', nextUrl)
      loginUrl.searchParams.set('callbackUrl', callbackUrl)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
