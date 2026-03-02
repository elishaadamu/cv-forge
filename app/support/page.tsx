"use client"

import { Navbar } from "@/components/Navbar"
import { motion } from "framer-motion"
import { 
  MessageCircle, 
  Mail, 
  HelpCircle, 
  ChevronRight, 
  Send, 
  ArrowRight,
  ShieldQuestion,
  LifeBuoy
} from "lucide-react"

const FAQs = [
  { q: "Is cvmyjob truly free?", a: "We offer a powerful free tier for everyone. A premium plan is available for advanced AI features and unlimited cloud storage." },
  { q: "Can I download my CV as PDF?", a: "Absolutely. Our export engine ensures your PDF looks pixel-perfect and remains ATS-readable." },
  { q: "How does the AI refinement work?", a: "We use Google's Gemini 1.5 Pro to analyze your text and craft professional bullet points based on industry standards." },
  { q: "Is my data secure?", a: "Your privacy is our priority. All data is encrypted and stored securely on our infrastructure." },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="text-center space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-brand-action/20 border-2 border-brand-action/30 rounded-3xl flex items-center justify-center text-brand-action mx-auto mb-6 shadow-lg shadow-brand-action/20"
          >
            <LifeBuoy size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            How can we <span className="text-brand-action">Help?</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-foreground/50 max-w-2xl mx-auto font-medium"
          >
            The cvmyjob support team is here to help you navigate your career journey. Find answers or reach out directly.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-border-custom rounded-[40px] p-10 space-y-8"
          >
             <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tight">Send a Message</h3>
                <p className="text-foreground/40 font-medium">Expected response time: Under 4 hours.</p>
             </div>

             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block ml-4">Full Name</label>
                      <input className="w-full h-14 px-6 bg-white/5 border border-border-custom rounded-2xl outline-none focus:border-brand-action transition-all font-bold" placeholder="John Doe" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block ml-4">Email Address</label>
                      <input className="w-full h-14 px-6 bg-white/5 border border-border-custom rounded-2xl outline-none focus:border-brand-action transition-all font-bold" placeholder="john@example.com" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block ml-4">Subject</label>
                   <select className="w-full h-14 px-6 bg-white/5 border border-border-custom rounded-2xl outline-none focus:border-brand-action transition-all font-bold appearance-none">
                      <option className="bg-brand-primary text-white">Technical Issue</option>
                      <option className="bg-brand-primary text-white">Account Support</option>
                      <option className="bg-brand-primary text-white">Billing Inquiry</option>
                      <option className="bg-brand-primary text-white">Feature Request</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 block ml-4">Message</label>
                   <textarea className="w-full h-40 p-6 bg-white/5 border border-border-custom rounded-2xl outline-none focus:border-brand-action transition-all font-medium resize-none" placeholder="Describe your issue in detail..." />
                </div>
                <button className="w-full h-16 bg-brand-action text-white rounded-2xl font-black text-lg flex items-center justify-center space-x-3 hover:scale-[1.02] transition-transform active:scale-95 shadow-xl">
                   <Send size={20} />
                   <span>Send Message</span>
                </button>
             </form>
          </motion.div>

          {/* FAQs & Instant Support */}
          <div className="space-y-12">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               className="space-y-6"
             >
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-xl">
                      <ShieldQuestion size={24} />
                   </div>
                   <h3 className="text-3xl font-black tracking-tight">Quick Answers</h3>
                </div>
                
                <div className="space-y-4">
                   {FAQs.map((faq, i) => (
                      <div key={i} className="group p-6 bg-white/5 border border-border-custom rounded-3xl hover:border-white/20 transition-all cursor-pointer">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold group-hover:text-brand-action transition-colors">{faq.q}</span>
                            <ChevronRight size={18} className="text-foreground/20 group-hover:text-brand-action group-hover:translate-x-1 transition-all" />
                         </div>
                         <p className="text-sm text-foreground/40 font-medium leading-relaxed max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500">
                            {faq.a}
                         </p>
                      </div>
                   ))}
                </div>
             </motion.div>

             {/* Live Chat / Direct */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="p-10 bg-brand-secondary rounded-[40px] text-white flex items-center justify-between shadow-2xl shadow-brand-secondary/30 group"
             >
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-white/60 mb-1">
                      <MessageCircle size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Connect Live</span>
                   </div>
                   <h4 className="text-3xl font-black tracking-tighter leading-none mb-2">Talk to an Expert</h4>
                   <p className="text-white/80 text-sm font-medium">Join our community Discord or start a live chat.</p>
                </div>
                <div className="w-14 h-14 bg-white text-brand-secondary rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform shadow-xl">
                   <ArrowRight size={24} />
                </div>
             </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
