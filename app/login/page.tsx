"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { PasswordInput } from "@/components/PasswordInput"
import { motion } from "framer-motion"
import { Sparkles, Mail, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import { loginUser } from "@/lib/actions"
import { useSearchParams } from "next/navigation"
import { Alert } from "antd"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, null)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 grid place-items-center p-4 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-action/10 rounded-3xl text-brand-action mb-4">
              <Sparkles size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tight">Welcome Back</h1>
            <p className="text-foreground/50 font-medium">Continue forging your professional future.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full h-14 bg-white dark:bg-white/5 border border-border-custom rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-custom"></div>
              </div>
              <div className="relative flex justify-center text-sm font-bold uppercase tracking-widest text-foreground/30">
                <span className="bg-background px-4">OR</span>
              </div>
            </div>

            <form action={formAction} className="space-y-6">
              <input type="hidden" name="redirectTo" value={callbackUrl} />
              {state?.error && (
                <Alert
                  message={state.error}
                  type="error"
                  showIcon
                  className="rounded-xl font-bold"
                />
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-brand-action transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full h-14 pl-12 bg-white/5 border border-border-custom rounded-2xl focus:ring-2 focus:ring-brand-action/20 focus:border-brand-action outline-none transition-all"
                    required
                    disabled={isPending}
                  />
                </div>
              </div>

              <PasswordInput 
                name="password"
                label="Password" 
                placeholder="••••••••" 
                required 
                disabled={isPending}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-border-custom text-brand-action focus:ring-brand-action/20 transition-all" />
                  <span className="text-foreground/60 group-hover:text-foreground transition-colors">Remember me</span>
                </label>
                <Link href="#" className="font-bold text-brand-action hover:underline underline-offset-4">Forgot password?</Link>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-brand-action text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-action/30 hover:shadow-brand-action/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                <span>{isPending ? "Signing In..." : "Sign In"}</span>
                {!isPending && <ArrowRight size={20} />}
              </button>
            </form>
          </div>

          <p className="text-center text-foreground/50 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-action font-black hover:underline underline-offset-4">Create one for free</Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}

