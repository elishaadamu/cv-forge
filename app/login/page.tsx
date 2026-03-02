"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { PasswordInput } from "@/components/PasswordInput"
import { motion } from "framer-motion"
import { Sparkles, Mail, ArrowRight, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Alert } from "antd"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid credentials or unverified account.")
        setIsPending(false)
      } else {
        router.push(callbackUrl)
        router.refresh() // Force refresh to sync session
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-brand-action selection:text-white">
      <Navbar />
      
      <main className="flex-1 grid place-items-center p-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 glass p-8 md:p-10 rounded-[40px] shadow-2xl border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-action/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />

          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-action/10 rounded-[28px] text-brand-action mb-4 border border-brand-action/5 shadow-inner">
              <Sparkles size={36} className="animate-pulse" />
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-none">Welcome Back</h1>
            <p className="text-foreground/40 font-medium text-lg">Enter the vault to access your forged blueprints.</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full h-15 bg-white dark:bg-white/5 border border-border-custom rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm group"
              type="button"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-[13px] uppercase tracking-widest">Continue with Google</span>
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-custom"></div>
              </div>
              <div className="relative flex justify-center text-xs font-black uppercase tracking-[0.3em] text-foreground/20">
                <span className="bg-background px-6">Direct Key</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  className="rounded-2xl font-bold border-red-500/20 bg-red-500/5 shadow-sm"
                />
              )}

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Forge Identifier (Email)</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-brand-action transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      name="email"
                      type="email"
                      placeholder="master@forge.com"
                      className="w-full h-14 pl-14 bg-white/5 border border-border-custom rounded-2xl focus:ring-4 focus:ring-brand-action/10 focus:border-brand-action outline-none transition-all font-medium"
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Security Pattern</label>
                    <Link href="/forgot-password" title="Recover access" className="text-[10px] font-black text-brand-action hover:underline underline-offset-4 uppercase tracking-widest">Forgot?</Link>
                  </div>
                  <PasswordInput 
                    name="password"
                    placeholder="••••••••" 
                    required 
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 px-1">
                 <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-border-custom text-brand-action focus:ring-brand-action/20 transition-all cursor-pointer" />
                 <label htmlFor="remember" className="text-xs font-bold text-foreground/40 cursor-pointer hover:text-foreground/60 transition-colors uppercase tracking-widest">Keep identity persistent</label>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full h-16 bg-brand-action text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-action/30 hover:shadow-brand-action/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:pointer-events-none group"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Enter the Forge</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-foreground/40 font-medium text-sm">
            New to the Forge?{" "}
            <Link href="/signup" className="text-brand-action font-black hover:underline underline-offset-8 decoration-2">Create Master Identity</Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}

