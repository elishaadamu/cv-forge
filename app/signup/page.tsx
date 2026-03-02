"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { PasswordInput } from "@/components/PasswordInput"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Mail, User, ShieldCheck, ArrowRight, KeyRound, CheckCircle2, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { registerUser, verifySignupOTP } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { Alert, Input, message } from "antd"

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [verifySuccess, setVerifySuccess] = useState(false)
  const [isVTransition, startVTransition] = useTransition()
  const router = useRouter()

  const [signupData, setSignupData] = useState({ name: "", email: "" })

  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    setSignupData({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    })
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setVerifyError("Please enter a valid 6-digit code.")
      return
    }

    setVerifyError(null)
    setIsVerifying(true)
    
    startVTransition(async () => {
      try {
        const res = await verifySignupOTP(signupData.email, otp)
        if (res.success) {
          setVerifySuccess(true)
          message.success("Account verified successfully! Welcome to the Forge.")
          setTimeout(() => router.push("/login"), 2000)
        } else {
          setVerifyError(res.error || "Verification failed.")
        }
      } catch (err) {
        setVerifyError("A system error occurred. Please try again.")
      } finally {
        setIsVerifying(false)
      }
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-brand-action selection:text-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg glass p-8 md:p-12 rounded-[48px] relative overflow-hidden shadow-2xl border border-white/5"
        >
          {/* Aesthetic Background Detail */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-action/10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {!state?.success ? (
              <motion.div 
                key="signup-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-action/10 rounded-[28px] text-brand-action shadow-inner mb-2 border border-brand-action/5">
                    <Sparkles size={36} className="animate-pulse" />
                  </div>
                  <h1 className="text-4xl font-black tracking-tight leading-tight">Forge Your Future</h1>
                  <p className="text-foreground/40 font-medium text-lg">Join the world's most powerful free CV builder.</p>
                </div>

                <div className="space-y-6">
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full h-14 bg-white dark:bg-white/5 border border-border-custom rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm group"
                    type="button"
                  >
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-[13px] uppercase tracking-widest">Join with Google</span>
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border-custom"></div>
                    </div>
                    <div className="relative flex justify-center text-xs font-black uppercase tracking-[0.3em] text-foreground/20">
                      <span className="bg-background px-6">Direct Access</span>
                    </div>
                  </div>

                  <form action={formAction} onSubmit={handleSignupSubmit} className="space-y-6">
                    {state?.error && (
                      <Alert message={state.error} type="error" showIcon className="rounded-2xl font-bold border-red-500/20 bg-red-500/5 shadow-sm" />
                    )}

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Full Identity</label>
                        <div className="relative group">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-brand-action transition-colors">
                            <User size={18} />
                          </div>
                          <input
                            name="name"
                            type="text"
                            placeholder="Forge Master"
                            className="w-full h-14 pl-14 bg-white/5 border border-border-custom rounded-2xl focus:ring-4 focus:ring-brand-action/10 focus:border-brand-action outline-none transition-all font-medium text-foreground placeholder:text-foreground/20"
                            required
                            disabled={isPending}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Secure Channel (Email)</label>
                        <div className="relative group">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-brand-action transition-colors">
                            <Mail size={18} />
                          </div>
                          <input
                            name="email"
                            type="email"
                            placeholder="master@forge.com"
                            className="w-full h-14 pl-14 bg-white/5 border border-border-custom rounded-2xl focus:ring-4 focus:ring-brand-action/10 focus:border-brand-action outline-none transition-all font-medium text-foreground placeholder:text-foreground/20"
                            required
                            disabled={isPending}
                          />
                        </div>
                      </div>

                      <PasswordInput 
                        name="password"
                        label="Forge Security (Password)" 
                        placeholder="••••••••" 
                        required 
                        disabled={isPending}
                      />
                    </div>

                    <div className="p-4 bg-brand-success/5 rounded-2xl border border-brand-success/10 flex items-start space-x-3">
                      <ShieldCheck className="text-brand-success shrink-0 mt-0.5" size={18} />
                      <p className="text-[11px] text-foreground/50 font-medium leading-relaxed">
                        By forging an account, you agree to our terms. Your data is encrypted and encrypted at rest.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-16 bg-brand-action text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-action/30 hover:shadow-brand-action/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:pointer-events-none group"
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <span>Initiate Forge</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <p className="text-center text-foreground/40 font-medium text-sm">
                  Already a member?{" "}
                  <Link href="/login" className="text-brand-action font-black hover:underline underline-offset-8 decoration-2">Enter the Vault</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="verify-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10 py-4"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-action/10 rounded-[32px] text-brand-action shadow-inner mb-2 border border-brand-action/5 relative">
                    <KeyRound size={40} className="animate-bounce" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-success rounded-full flex items-center justify-center text-white scale-110 shadow-lg">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight leading-none">Protect Your Forge</h1>
                  <div className="space-y-1">
                    <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">Verification Code Dispatched</p>
                    <p className="text-foreground/60 font-medium italic text-lg">{signupData.email}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Input.OTP 
                        length={6} 
                        onChange={(val) => setOtp(val)} 
                        size="large"
                        formatter={(str) => str.toUpperCase()}
                        className="h-20 text-3xl font-black"
                        style={{ height: '80px', fontSize: '24px' }}
                      />
                    </div>
                    <p className="text-center text-xs font-bold text-foreground/30 uppercase tracking-[0.2em]">Enter the 6-digit blueprint key</p>
                  </div>

                  {verifyError && (
                    <Alert message={verifyError} type="error" showIcon className="rounded-2xl font-bold" />
                  )}
                  {verifySuccess && (
                    <Alert message="Security Cleared. Welcome to the Forge." type="success" showIcon className="rounded-2xl font-bold" />
                  )}

                  <div className="space-y-4">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={isVerifying || verifySuccess || otp.length !== 6}
                      className="w-full h-16 bg-linear-to-r from-brand-action to-orange-400 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:shadow-brand-action/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-30 disabled:pointer-events-none group"
                    >
                      {isVerifying || isVTransition ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <span>Verify Identity</span>
                          <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => window.location.reload()}
                      className="w-full py-2 text-foreground/30 hover:text-foreground/60 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
                    >
                      Change Email / Mistake?
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Decorative Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-10">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-brand-action rounded-full blur-[200px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-brand-success rounded-full blur-[200px]" />
      </div>
    </div>
  )
}
