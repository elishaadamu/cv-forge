"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2, Send, FileText, Globe, Zap, AlertCircle } from "lucide-react"
import { generateBlogAIContent } from "@/lib/actions"
import { message } from "antd"

export default function BlogGeneratorPage() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      message.warning("Neural link requires a topic to synchronize.")
      return
    }

    setIsGenerating(true)
    setResult(null)
    try {
      const res = await generateBlogAIContent(topic)
      if (res.success) {
        setResult(res)
        message.success("CV my job AI has synthesized the insights.")
      } else {
        message.error(res.error || "Neural Grid Connection Failed")
      }
    } catch (err) {
      message.error("The service is offline. Please retry.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-action/10 border border-brand-action/20 text-brand-action text-[10px] font-black uppercase tracking-widest"
          >
            <Zap size={12} className="text-brand-action animate-pulse" />
            <span>CV my job AI Hub</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">
            Career <span className="text-brand-action">Generator</span>
          </h1>
          <p className="text-foreground/40 font-medium max-w-lg">
            Harness the power of CV my job AI to generate professional resume insights, career guides, and job strategies.
          </p>
        </header>

        <section className="bg-white/5 border border-border-custom rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 ml-2">Define Your Topic</label>
              <div className="relative group">
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Modern strategies for remote engineering interviews"
                  className="w-full h-18 px-8 bg-black/20 border border-border-custom rounded-3xl outline-none focus:border-brand-action focus:ring-4 focus:ring-brand-action/5 transition-all text-lg font-bold placeholder:text-foreground/10"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-12 px-8 bg-brand-action text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand-action/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
                  <span>{isGenerating ? "Syncing..." : "Synthesize"}</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10 pt-10 border-t border-white/10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-brand-action">
                        <FileText size={20} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Post Metadata</h3>
                      </div>
                      <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-foreground/30 px-1">Draft Title</label>
                          <p className="text-2xl font-black italic text-brand-action">{result.title}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-foreground/30 px-1">Strategic Excerpt</label>
                          <p className="text-sm font-medium text-foreground/60 leading-relaxed italic">{result.excerpt}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-brand-secondary">
                        <Globe size={20} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Neural Insights</h3>
                      </div>
                      <div className="p-6 bg-brand-action/5 rounded-[32px] border border-brand-action/10 h-full flex flex-col justify-center text-center space-y-2">
                        <p className="text-sm font-bold text-brand-action uppercase tracking-widest">Optimized for Growth</p>
                        <p className="text-[10px] text-foreground/40 font-medium">This content has been parsed using CV my job AI's professional career strategy dataset.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-foreground/60">
                          <Send size={20} />
                          <h3 className="text-xs font-black uppercase tracking-widest">Draft Content (Markdown)</h3>
                        </div>
                        <button 
                           onClick={() => {
                             navigator.clipboard.writeText(result.content)
                             message.success("Copied to Neural Clipboard")
                           }}
                           className="text-[10px] font-black uppercase tracking-widest text-brand-action hover:underline"
                        >
                           Copy Raw Content
                        </button>
                     </div>
                     <div className="p-8 bg-black/40 rounded-[40px] border border-white/10 max-h-[500px] overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-foreground/80">
                        <pre className="whitespace-pre-wrap">{result.content}</pre>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!result && !isGenerating && (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                <div className="w-24 h-24 rounded-[32px] border-4 border-dashed border-white/20 flex items-center justify-center">
                  <Sparkles size={48} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black italic">Neural Grid Idle</h3>
                  <p className="text-sm font-medium uppercase tracking-widest">Awaiting topic synchronization</p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-action/10 blur-[150px] pointer-events-none rounded-full" />
        </section>
      </main>
    </div>
  )
}
