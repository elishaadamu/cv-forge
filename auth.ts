import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any) as any,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("AUTH: Missing credentials")
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) {
          console.log("AUTH: User not found:", credentials.email)
          return null
        }

        if (!user.password) {
          console.log("AUTH: User has no password (likely OAuth user):", credentials.email)
          return null
        }
        
        // Prevent login if not verified (manual signups only)
        if (!user.emailVerified) {
          console.log("AUTH: User email not verified:", credentials.email)
          return null
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password)

        if (!isValid) {
          console.log("AUTH: Invalid password for:", credentials.email)
          return null
        }

        console.log("AUTH: Login successful for:", credentials.email)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Automatically verify email for Google sign-ups
        if (user.email && !(user as any).emailVerified) {
          try {
            await prisma.user.update({
              where: { email: user.email },
              data: { emailVerified: new Date() }
            });
          } catch (error) {
            console.error("Error updating emailVerified for Google user:", error);
          }
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.sub = user.id
        token.name = user.name
        token.picture = user.image
        token.role = (user as any).role
      }
      
      // Handle session updates (e.g. from update() on client)
      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name
        if (session.user.image) token.picture = session.user.image
        if (session.user.role) token.role = session.user.role
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub as string
        session.user.name = token.name
        session.user.image = token.picture as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
})
