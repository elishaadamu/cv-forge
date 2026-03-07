"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles, ExternalLink, Smartphone } from "lucide-react"
import { chatWithAI } from "@/lib/chat-actions"
import Link from "next/link"

type Message = {
    role: "user" | "model"
    text: string
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", text: "Hi! I'm BuildBuddy, your AI carrier assistant. How can I help you today? \n\nYou can ask about CVs, ATS scores, job searches, or even professional cover letters." }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", text: userMsg }])
        setIsLoading(true)

        try {
            const history = messages.map(m => ({ 
                role: m.role, 
                parts: [{ text: m.text }] 
            }))
            history.push({ role: "user", parts: [{ text: userMsg }] })

            const res = await chatWithAI(history as any)
            
            if (res.success && res.text) {
                setMessages(prev => [...prev, { role: "model", text: res.text || "" }])
            } else {
                setMessages(prev => [...prev, { role: "model", text: "I'm sorry, I'm having trouble connecting right now. Please try again or contact support." }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: "model", text: "Oops! Something went wrong. Let's try that again." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-300 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[380px] sm:w-[420px] max-h-[600px] h-[70vh] bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 bg-linear-to-r from-brand-action to-blue-600 text-white flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-widest">BuildBuddy AI</h3>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Online & Ready</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Link 
                                    href="https://wa.me/2347067206984" 
                                    target="_blank"
                                    className="p-2 bg-green-500 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-900/20 group"
                                    title="Live Support on WhatsApp"
                                >
                                    <Smartphone size={18} className="group-hover:scale-110 transition-transform" />
                                </Link>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>


                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex items-end space-x-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                            msg.role === "user" ? "bg-brand-action text-white" : "bg-white/5 border border-white/5 text-brand-action"
                                        }`}>
                                            {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-[13px] leading-relaxed font-medium ${
                                            msg.role === "user" 
                                                ? "bg-brand-action text-white rounded-tr-none shadow-lg shadow-brand-action/10" 
                                                : "bg-white/5 border border-white/5 text-foreground/80 rounded-tl-none"
                                        }`}>
                                           <div className="whitespace-pre-wrap break-words prose prose-sm prose-invert dark:prose-p:text-white/80 prose-a:text-brand-action">
                                                {/* Note: I'm not using react-markdown here for speed, but I'll handle links manually if needed or just simple text */}
                                                {msg.text.split(/(\[.*?\]\(.*?\))/g).map((part, index) => {
                                                    const match = part.match(/\[(.*?)\]\((.*?)\)/)
                                                    if (match) {
                                                        return (
                                                            <Link key={index} href={match[2]} className="text-brand-action hover:underline font-bold" target={match[2].startsWith('http') ? '_blank' : undefined}>
                                                                {match[1]}
                                                            </Link>
                                                        )
                                                    }
                                                    return part
                                                })}
                                           </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-center space-x-2 bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                                        <Loader2 size={16} className="animate-spin text-brand-action" />
                                        <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest font-mono">BuildBuddy is thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-5 border-t border-white/5">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative"
                            >
                                <input 
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-5 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-action/20 focus:border-brand-action/40 transition-all placeholder:text-foreground/30"
                                />
                                <button 
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-2 w-10 h-10 bg-brand-action text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-action/20"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <p className="mt-3 text-[10px] text-center text-foreground/30 font-bold uppercase tracking-widest">
                                Powered by CVMYJOB Engineering
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB Button */}
            <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center transition-all duration-300 relative group overflow-hidden ${
                    isOpen ? "bg-white text-brand-action" : "bg-brand-action text-white"
                }`}
            >
                <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent pointer-events-none" />
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X size={28} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            className="relative"
                        >
                            <MessageCircle size={28} />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-brand-action rounded-full" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}
