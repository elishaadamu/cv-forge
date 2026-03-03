import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
  const isOnBuilder = nextUrl.pathname.startsWith('/builder')

  if ((isOnDashboard || isOnBuilder) && !isLoggedIn) {
    const callbackUrl = nextUrl.pathname + nextUrl.search
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', callbackUrl)
    return Response.redirect(loginUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
