"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"

export function RecentBlogs() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs')
        const data = await response.json()
        if (data.success) {
          setBlogs(data.blogs.slice(0, 3))
        }
      } catch (error) {
        console.error("Fetch blogs error:", error)
      }
      setIsLoading(false)
    }
    fetchBlogs()
  }, [])

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              Career <span className="text-brand-action">Intelligence</span>
            </h2>
            <p className="text-xl text-foreground/50 font-medium max-w-2xl">
              Stay ahead with the latest strategies on ATS, AI, and modern recruitment.
            </p>
          </div>
          
          <Link 
            href="/blog"
            className="group flex items-center space-x-3 text-brand-action font-black uppercase tracking-widest text-sm"
          >
            <span>View All Insights</span>
            <div className="w-10 h-10 rounded-full border border-brand-action/30 flex items-center justify-center group-hover:bg-brand-action group-hover:text-white transition-all">
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
             [1, 2, 3].map(i => (
                <div key={i} className="aspect-4/3 bg-white/5 rounded-[36px] animate-pulse" />
             ))
          ) : (
            blogs.map((blog, i) => (
                <Link key={blog.slug} href={`/blog/${blog.slug}`}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ 
                        y: -8,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderColor: "rgba(255, 255, 255, 0.2)"
                      }}
                      viewport={{ once: true }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      className="group flex flex-col h-full bg-white/5 border border-white/5 rounded-[36px] overflow-hidden cursor-pointer"
                    >
                      <div className="relative aspect-4/3 overflow-hidden">
                        <motion.div
                          className="w-full h-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                          <Image 
                            src={blog.image} 
                            alt={blog.title} 
                            fill 
                            className="object-cover" 
                          />
                        </motion.div>
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white">
                          {blog.category}
                        </div>
                      </div>
    
                    <div className="p-8 flex flex-col flex-1 space-y-4">
                      <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-foreground/30">
                        <Calendar size={12} />
                        <span>{blog.createdAt ? format(new Date(blog.createdAt), 'MMM dd, yyyy') : ''}</span>
                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                        <Clock size={12} />
                        <span>5 min read</span>
                      </div>
    
                      <h3 className="text-2xl font-black tracking-tight group-hover:text-brand-action transition-colors duration-500 line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>
    
                      <p className="text-sm text-foreground/40 font-medium line-clamp-2 flex-1">
                        {blog.excerpt}
                      </p>
    
                      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                        <div className="flex items-center space-x-2">
                           <span className="text-xs font-bold text-foreground/60">By {blog.author?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-brand-action">
                           <TrendingUp size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Trending</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
          )}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-action/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  )
}
