"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Mail, ArrowLeft, RefreshCcw, Loader2, Eye, EyeOff, ShieldAlert, Sparkles, Plus, KeyRound } from "lucide-react"
import Link from "next/link"
import { sendSecurityOTP, verifyOTPAndUpdatePassword } from "@/lib/actions"
import { message } from "antd"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"identify" | "captcha" | "otp" | "success">("identify")
  const [email, setEmail] = useState("")
  const [captcha, setCaptcha] = useState({ q: "", a: 0 })
  const [captchaInput, setCaptchaInput] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    setCaptcha({ q: `${a} + ${b} = ?`, a: a + b })
    setCaptchaInput("")
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      message.error("Please enter your email forge identity.")
      return
    }
    setStep("captcha")
    generateCaptcha()
  }

  const handleVerifyCaptcha = async (e: React.FormEvent) => {
    e.preventDefault()
    if (parseInt(captchaInput) === captcha.a) {
      handleSendOTP()
    } else {
      message.error("Incorrect verification. Access denied.")
      generateCaptcha()
    }
  }

  const handleSendOTP = async () => {
    setIsSubmitting(true)
    const res = await sendSecurityOTP(email)
    if (res.success) {
      message.success(res.message)
      setStep("otp")
    } else {
      message.error(res.error)
      setStep("identify")
    }
    setIsSubmitting(false)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus()
    }
  }

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match")
      return
    }
    if (otp.join("").length < 6) {
      message.error("Enter full verification code")
      return
    }

    setIsSubmitting(true)
    const res = await verifyOTPAndUpdatePassword(email, otp.join(""), newPassword)
    if (res.success) {
      message.success(res.message)
      setStep("success")
    } else {
      message.error(res.error)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden selection:bg-brand-action selection:text-white">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-action rounded-full blur-[250px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-primary rounded-full blur-[250px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white/5 border border-border-custom rounded-[48px] p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <Link 
            href="/login"
            className="absolute top-8 left-8 p-3 bg-white/5 border border-border-custom rounded-2xl text-foreground/40 hover:text-brand-action transition-all"
          >
            <ArrowLeft size={20} />
          </Link>

          <AnimatePresence mode="wait">
            {step === "identify" && (
              <motion.div 
                key="id"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                   <div className="w-24 h-24 bg-brand-action/10 rounded-[32px] flex items-center justify-center text-brand-action mx-auto">
                      <KeyRound size={48} />
                   </div>
                   <div className="space-y-1">
                      <h1 className="text-4xl font-black tracking-tight">Recover <span className="text-brand-action">Forge</span></h1>
                      <p className="text-foreground/40 font-medium">Identify your email to begin the recovery quest.</p>
                   </div>
                </div>

                <form onSubmit={handleIdentify} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Forge Email</label>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-16 px-6 bg-white/5 border border-border-custom rounded-3xl outline-none focus:border-brand-action focus:ring-4 focus:ring-brand-action/5 transition-all text-xl font-bold"
                        placeholder="your@email.com"
                        required
                      />
                   </div>
                   <button 
                     type="submit"
                     className="w-full h-18 bg-brand-action text-white rounded-[32px] font-black text-xl shadow-xl shadow-brand-action/20 hover:shadow-brand-action/40 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 active:scale-95"
                   >
                     <span>Initiate Recovery</span>
                     <ArrowRightIcon size={24} />
                   </button>
                </form>
              </motion.div>
            )}

            {step === "captcha" && (
              <motion.div 
                key="captcha"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                   <div className="w-24 h-24 bg-brand-action/10 rounded-[32px] flex items-center justify-center text-brand-action mx-auto">
                      <ShieldAlert size={48} />
                   </div>
                   <div className="space-y-1">
                      <h1 className="text-4xl font-black tracking-tight">Are you <span className="text-brand-action">Human?</span></h1>
                      <p className="text-foreground/40 font-medium">Complete this forge challenge to dispatch the code.</p>
                   </div>
                </div>

                <form onSubmit={handleVerifyCaptcha} className="space-y-8">
                   <div className="p-8 bg-white/5 border border-border-custom rounded-[40px] flex flex-col items-center space-y-6">
                      <span className="text-5xl font-black tracking-[0.5em] text-foreground/20 italic">{captcha.q.split(' ')[0]} {captcha.q.split(' ')[1]} {captcha.q.split(' ')[2]}</span>
                      <input 
                        type="number"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className="w-full h-20 bg-white/10 border-2 border-brand-action/20 focus:border-brand-action rounded-3xl text-center text-4xl font-black outline-none transition-all"
                        placeholder="?"
                        autoFocus
                        required
                      />
                   </div>
                   <button 
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full h-18 bg-brand-action text-white rounded-[32px] font-black text-xl shadow-xl shadow-brand-action/20 hover:shadow-brand-action/40 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
                   >
                     {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Mail size={24} />}
                     <span>Send Verification Code</span>
                   </button>
                </form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div 
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                 <div className="text-center space-y-4">
                   <div className="w-24 h-24 bg-brand-action/10 rounded-[32px] flex items-center justify-center text-brand-action mx-auto">
                      <ShieldCheck size={48} />
                   </div>
                   <div className="space-y-1">
                      <h1 className="text-4xl font-black tracking-tight">Shield <span className="text-brand-action">Check</span></h1>
                      <p className="text-foreground/40 font-medium">Verify the code dispatched to <span className="text-foreground font-bold">{email}</span></p>
                   </div>
                </div>

                <form onSubmit={handleSubmitPassword} className="space-y-8">
                   <div className="flex justify-between gap-3">
                      {otp.map((digit, idx) => (
                        <input 
                          key={idx}
                          ref={otpRefs[idx]}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-full h-18 bg-white/5 border border-border-custom rounded-2xl text-center text-3xl font-black text-brand-action outline-none focus:border-brand-action focus:ring-4 focus:ring-brand-action/5 transition-all"
                          maxLength={1}
                        />
                      ))}
                   </div>

                   <div className="space-y-4">
                      <div className="relative">
                         <input 
                           type={showNewPassword ? "text" : "password"}
                           value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}
                           className="w-full h-16 px-6 bg-white/5 border border-border-custom rounded-3xl outline-none focus:border-brand-action transition-all text-xl font-bold pr-14"
                           placeholder="New Password"
                           required
                         />
                         <button
                           type="button"
                           onClick={() => setShowNewPassword(!showNewPassword)}
                           className="absolute right-5 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-brand-action transition-colors"
                         >
                           {showNewPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                         </button>
                      </div>
                      <div className="relative">
                         <input 
                           type={showConfirmPassword ? "text" : "password"}
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           className="w-full h-16 px-6 bg-white/5 border border-border-custom rounded-3xl outline-none focus:border-brand-action transition-all text-xl font-bold pr-14"
                           placeholder="Confirm New Password"
                           required
                         />
                         <button
                           type="button"
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                           className="absolute right-5 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-brand-action transition-colors"
                         >
                           {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                         </button>
                      </div>
                   </div>

                   <button 
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full h-18 bg-brand-action text-white rounded-[32px] font-black text-xl shadow-xl shadow-brand-action/20 hover:shadow-brand-action/40 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
                   >
                     {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
                     <span>Seal New Password</span>
                   </button>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10"
              >
                  <div className="w-32 h-32 bg-brand-success/10 rounded-[48px] flex items-center justify-center text-brand-success mx-auto">
                    <motion.div
                      initial={{ rotate: -45, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                       <ShieldCheck size={64} />
                    </motion.div>
                  </div>
                  <div className="space-y-4">
                     <h1 className="text-5xl font-black tracking-tight leading-none">Access <span className="text-brand-success">Restored</span></h1>
                     <p className="text-foreground/40 font-medium text-lg">Your forge security has been successfully updated. Your new password is now seals.</p>
                  </div>
                  <Link 
                    href="/login"
                    className="inline-flex px-12 py-6 bg-white text-black rounded-[32px] font-black text-xl shadow-xl hover:-translate-y-1 transition-all active:scale-95 group"
                  >
                    <span>Return to Login</span>
                    <ArrowRightIcon size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="absolute -inset-20 bg-brand-success/5 blur-[100px] -z-10 rounded-full animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Aesthetic footer */}
          <div className="mt-12 pt-8 border-t border-border-custom flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/10">
             <Sparkles size={12} />
             <span>Powered by cvmyjob Security</span>
             <Sparkles size={12} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ArrowRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}
