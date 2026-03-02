import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnBuilder = req.nextUrl.pathname.startsWith('/builder')

  if ((isOnDashboard || isOnBuilder) && !isLoggedIn) {
    const callbackUrl = req.nextUrl.pathname + req.nextUrl.search
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', callbackUrl)
    return Response.redirect(loginUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
