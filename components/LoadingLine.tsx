"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

export function LoadingLine() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Whenever pathname or searchParams change, we do a quick flash/progress
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 600) // This is a "fake" progress bar effect
    
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 pointer-events-none">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1, originX: 0 }}
            animate={{ 
              scaleX: [0, 0.3, 0.7, 0.9], 
              opacity: 1 
            }}
            exit={{ 
              scaleX: 1, 
              opacity: 0,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="h-1 bg-linear-to-r from-brand-action via-blue-400 to-brand-action shadow-[0_0_15px_rgba(37,99,235,0.6)]"
            transition={{ 
              duration: 3, 
              ease: [0.16, 1, 0.3, 1] 
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
