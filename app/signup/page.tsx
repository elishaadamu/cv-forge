"use client"

import { useActionState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { PasswordInput } from "@/components/PasswordInput"
import { motion } from "framer-motion"
import { Sparkles, Mail, User, ShieldCheck, ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import { registerUser } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { Alert } from "antd"

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push("/login")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state?.success, router])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 pt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg glass p-12 rounded-[48px]  relative overflow-hidden"
        >
          {/* Subtle Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-action opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
          
          <div className="text-center space-y-2 mb-10">
            <h1 className="text-4xl font-black tracking-tight tracking-tighter">Forge Your Future</h1>
            <p className="text-foreground/50 font-medium">Join CVForge and start building for free.</p>
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
              <span>Join with Google</span>
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
              {state?.error && (
                <Alert
                  message={state.error}
                  type="error"
                  showIcon
                  className="rounded-xl font-bold"
                />
              )}
              {state?.success && (
                <Alert
                  message="Account created! Redirecting to login..."
                  type="success"
                  showIcon
                  className="rounded-xl font-bold"
                />
              )}

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-brand-action transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className="w-full h-14 pl-12 bg-white/5 border border-border-custom rounded-2xl focus:ring-2 focus:ring-brand-action/20 focus:border-brand-action outline-none transition-all"
                      required
                      disabled={isPending || state?.success}
                    />
                  </div>
                </div>

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
                      disabled={isPending || state?.success}
                    />
                  </div>
                </div>

                <PasswordInput 
                  name="password"
                  label="Choose Password" 
                  placeholder="Make it strong..." 
                  required 
                  disabled={isPending || state?.success}
                />
              </div>

              <div className="p-4 bg-brand-success/10 rounded-2xl border border-brand-success/20 flex items-start space-x-3">
                <ShieldCheck className="text-brand-success shrink-0 mt-0.5" size={18} />
                <p className="text-[12px] text-brand-success font-bold font-mono">Your data is encrypted and remains private. We never sell your information to third parties.</p>
              </div>

              <button
                type="submit"
                disabled={isPending || state?.success}
                className="w-full h-14 bg-brand-action text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-action/30 hover:shadow-brand-action/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                <span>{isPending ? "Creating..." : "Get Started"}</span>
                {!isPending && <ArrowRight size={20} />}
              </button>
            </form>
          </div>

          <p className="text-center text-foreground/50 font-medium mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-action font-black hover:underline underline-offset-4">Log in here</Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
