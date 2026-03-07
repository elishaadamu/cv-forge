"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { User, Lock, Save, Camera, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck, Mail, ArrowRight, ShieldAlert, Sparkles } from "lucide-react"
import { updateProfile, getUserProfile, sendSecurityOTP, verifyOTPAndUpdatePassword } from "@/lib/actions"
import { message } from "antd"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileData, setProfileData] = useState({ name: "", image: "" })
  
  // Password states
  const [step, setStep] = useState<"captcha" | "otp" | "newPassword">("captcha")
  const [captcha, setCaptcha] = useState({ q: "", a: 0 })
  const [captchaInput, setCaptchaInput] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    setCaptcha({ q: `${a} + ${b} = ?`, a: a + b })
    setCaptchaInput("")
  }

  const fetchProfile = async () => {
    if (!session?.user?.id) return
    setIsLoading(true)
    const res = await getUserProfile()
    if (res.success && res.user) {
      setProfileData({
        name: res.user.name || "",
        image: res.user.image || ""
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProfile()
    generateCaptcha()
  }, [session])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return
    setIsSubmitting(true)
    const res = await updateProfile(profileData)
    if (res.success) {
      await update({
        user: {
          name: profileData.name,
          image: profileData.image
        }
      })
      message.success("Profile updated successfully")
    } else {
      message.error(res.error || "Failed to update profile")
    }
    setIsSubmitting(false)
  }

  const handleVerifyCaptcha = (e: React.FormEvent) => {
    e.preventDefault()
    if (parseInt(captchaInput) === captcha.a) {
      handleSendOTP()
    } else {
      message.error("Incorrect verification. Are you human?")
      generateCaptcha()
    }
  }

  const handleSendOTP = async () => {
    if (!session?.user?.id) return
    setIsSubmitting(true)
    const res = await sendSecurityOTP(session.user.id)
    if (res.success) {
      message.success(res.message)
      setStep("otp")
    } else {
      message.error(res.error)
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
    if (session?.user?.id) {
       const res = await verifyOTPAndUpdatePassword(session.user.id, otp.join(""), newPassword)
       if (res.success) {
         message.success(res.message)
         setStep("captcha")
         setOtp(["", "", "", "", "", ""])
         setNewPassword("")
         setConfirmPassword("")
         generateCaptcha()
       } else {
         message.error(res.error)
       }
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="mb-12">
           <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <h1 className="text-4xl font-black tracking-tight">Account <span className="text-brand-action">Settings</span></h1>
            <p className="text-foreground/50 font-medium">Manage your professional profile and security.</p>
          </motion.div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
           <aside className="w-full md:w-64 space-y-2">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "password", label: "Security", icon: Lock },
                { id: "generator", label: "AI Generator", icon: Sparkles }
              ].map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.id === "generator" ? "/dashboard/generator" : "#"}
                  onClick={(e) => {
                    if (tab.id !== "generator") {
                      e.preventDefault();
                      setActiveTab(tab.id as any);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                    activeTab === tab.id 
                    ? "bg-brand-action text-white shadow-lg shadow-brand-action/20" 
                    : "text-foreground/40 hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </Link>
              ))}
           </aside>

           <section className="flex-1 bg-white/5 border border-border-custom rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                 {isLoading ? (
                   <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex flex-col items-center justify-center py-20 space-y-4"
                   >
                     <Loader2 className="animate-spin text-brand-action" size={40} />
                     <p className="text-sm font-black uppercase tracking-widest text-foreground/20">Syncing settings...</p>
                   </motion.div>
                 ) : activeTab === "profile" ? (
                   <motion.div
                     key="profile"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-10"
                   >
                       <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="relative group">
                             <div className="w-32 h-32 rounded-[32px] bg-white/5 border-2 border-dashed border-border-custom flex items-center justify-center overflow-hidden transition-all group-hover:border-brand-action shadow-inner">
                                {profileData.image ? (
                                  <Image 
                                     src={profileData.image} 
                                     alt="Profile" 
                                     width={128} 
                                     height={128} 
                                     className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                  />
                                ) : (
                                  <User size={48} className="text-foreground/10 group-hover:text-brand-action transition-colors" />
                                )}
                                <div className="absolute inset-0 bg-brand-action/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                                   <Camera size={32} className="text-white scale-75 group-hover:scale-100 transition-transform" />
                                </div>
                             </div>
                             <CldUploadWidget 
                               uploadPreset="cvforge_uploads"
                               onSuccess={(result: any) => {
                                  if (result?.info?.secure_url) {
                                    setProfileData(prev => ({ ...prev, image: result.info.secure_url }))
                                  }
                               }}
                             >
                               {({ open }) => (
                                 <button 
                                   onClick={() => open()}
                                   className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-action text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                                 >
                                   <PlusIcon size={20} />
                                 </button>
                               )}
                             </CldUploadWidget>
                          </div>
                          <div className="flex-1 space-y-2 text-center md:text-left">
                             <h3 className="text-2xl font-black">Profile Portrait</h3>
                             <p className="text-foreground/40 font-medium">This is how other members will see you. Designed for success.</p>
                             <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                                <span className="px-3 py-1 bg-brand-action/10 text-brand-action text-[10px] font-black uppercase tracking-wider rounded-full border border-brand-action/20">Pro Member</span>
                                <span className="px-3 py-1 bg-white/5 text-foreground/40 text-[10px] font-black uppercase tracking-wider rounded-full border border-border-custom">Free Tier</span>
                             </div>
                          </div>
                       </div>

                       <form onSubmit={handleUpdateProfile} className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Full Identity</label>
                                <input 
                                  type="text"
                                  value={profileData.name}
                                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full h-14 px-6 bg-white/5 border border-border-custom rounded-2xl outline-none focus:border-brand-action focus:ring-4 focus:ring-brand-action/5 transition-all text-base font-bold"
                                  placeholder="e.g. Sterling Archer"
                                  required
                                />
                             </div>
                             <div className="space-y-2 opacity-50">
                                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1 cursor-not-allowed">Email Address (Fixed)</label>
                                <div className="w-full h-14 px-6 bg-white/5 border border-border-custom rounded-2xl flex items-center text-foreground/40 font-bold select-none">
                                   {session?.user?.email}
                                </div>
                             </div>
                          </div>

                          <button 
                             type="submit"
                             disabled={isSubmitting}
                             className="px-10 py-5 bg-brand-action text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-action/20 hover:shadow-brand-action/40 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
                          >
                             {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                             <span>Update Profile</span>
                          </button>
                       </form>
                   </motion.div>
                 ) : (
                   <motion.div
                     key="password"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-10"
                   >
                      <div className="space-y-2">
                         <h3 className="text-2xl font-black flex items-center">
                            <ShieldCheck size={28} className="text-brand-action mr-3" />
                            Security Shield
                         </h3>
                         <p className="text-foreground/40 font-medium">Verify your identity to update your password. Robust and secure.</p>
                      </div>

                      <AnimatePresence mode="wait">
                         {step === "captcha" && (
                           <motion.div 
                             key="captcha"
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -10 }}
                             className="space-y-6"
                           >
                              <div className="p-8 bg-brand-action/5 border border-brand-action/20 rounded-[32px] flex flex-col items-center space-y-6">
                                 <ShieldAlert className="text-brand-action" size={40} />
                                 <div className="text-center">
                                    <h4 className="text-lg font-black uppercase tracking-widest text-foreground">Human Proof</h4>
                                    <p className="text-sm font-medium text-foreground/40">Complete this challenge to request an OTP.</p>
                                 </div>
                                 <form onSubmit={handleVerifyCaptcha} className="w-full max-w-xs space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-border-custom">
                                       <span className="text-xl font-black tracking-widest">{captcha.q}</span>
                                       <input 
                                         type="number"
                                         value={captchaInput}
                                         onChange={(e) => setCaptchaInput(e.target.value)}
                                         className="w-20 h-12 bg-white/10 border border-brand-action/20 rounded-xl text-center font-black outline-none focus:border-brand-action transition-all"
                                         required
                                       />
                                    </div>
                                    <button 
                                      type="submit"
                                      disabled={isSubmitting}
                                      className="w-full py-4 bg-brand-action text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-brand-action/90 transition-all active:scale-95"
                                    >
                                       {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
                                       <span>Send OTP Code</span>
                                    </button>
                                 </form>
                              </div>
                           </motion.div>
                         )}

                         {step === "otp" && (
                           <motion.div 
                             key="otp"
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: -20 }}
                             className="space-y-8"
                           >
                              <div className="p-6 bg-brand-success/5 border border-brand-success/20 rounded-3xl flex items-start space-x-4">
                                 <Mail className="text-brand-success shrink-0" size={24} />
                                 <p className="text-sm font-medium text-brand-success/80">
                                   We've dispatched a 6-digit code to your email. Check your inbox and enter it below to proceed.
                                 </p>
                              </div>

                              <div className="space-y-4">
                                 <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-2">Verification Code</label>
                                 <div className="flex justify-between gap-2">
                                    {otp.map((digit, idx) => (
                                      <input 
                                        key={idx}
                                        ref={otpRefs[idx]}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                        className="w-full h-16 bg-white/5 border border-border-custom rounded-2xl text-center text-2xl font-black text-brand-action outline-none focus:border-brand-action focus:ring-4 focus:ring-brand-action/5 transition-all"
                                        maxLength={1}
                                      />
                                    ))}
                                 </div>
                              </div>

                              <div className="space-y-6">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">New Password</label>
                                       <div className="relative">
                                          <input 
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full h-14 px-6 bg-white/5 border border-border-custom rounded-2xl outline-none focus:border-brand-action focus:ring-4 focus:ring-brand-action/5 transition-all text-base font-bold pr-14"
                                            placeholder="••••••••"
                                            required
                                          />
                                          <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-foreground/20 hover:text-brand-action"
                                          >
                                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                          </button>
                                       </div>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Confirm New Password</label>
                                       <div className="relative">
                                          <input 
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full h-14 px-6 bg-white/5 border border-border-custom rounded-2xl outline-none focus:border-brand-action focus:ring-4 focus:ring-brand-action/5 transition-all text-base font-bold pr-14"
                                            placeholder="••••••••"
                                            required
                                          />
                                          <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-foreground/20 hover:text-brand-action"
                                          >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                          </button>
                                       </div>
                                    </div>
                                 </div>

                                 <button 
                                    onClick={handleSubmitPassword}
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-brand-action text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-action/20 hover:shadow-brand-action/40 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50"
                                 >
                                    {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
                                    <span>Update Password</span>
                                 </button>
                                 
                                 <button 
                                   onClick={() => setStep("captcha")}
                                   className="w-full text-xs font-black uppercase tracking-[0.2em] text-foreground/20 hover:text-brand-action transition-colors"
                                 >
                                   Resend Verification / Re-verify
                                 </button>
                              </div>
                           </motion.div>
                         )}
                      </AnimatePresence>
                   </motion.div>
                 )}
              </AnimatePresence>

              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-action/10 blur-[100px] pointer-events-none rounded-full" />
           </section>
        </div>
      </main>
    </div>
  )
}

function PlusIcon(props: any) {
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
      <path d="M12 5v14" />
    </svg>
  )
}
