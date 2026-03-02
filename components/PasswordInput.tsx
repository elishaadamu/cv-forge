"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function PasswordInput({ label, className, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <div className="w-full space-y-2">
      {label && <label className="text-sm font-semibold text-foreground/80">{label}</label>}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-brand-action transition-colors">
          <Lock size={18} />
        </div>
        <input
          {...props}
          type={isVisible ? "text" : "password"}
          className={`w-full h-14 pl-12 pr-12 bg-white/5 border border-border-custom rounded-2xl focus:ring-2 focus:ring-brand-action/20 focus:border-brand-action outline-none transition-all placeholder:text-foreground/30 ${className}`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-brand-action transition-colors outline-none"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}
