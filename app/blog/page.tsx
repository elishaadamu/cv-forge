"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { motion } from "framer-motion"
import { 
  Search, 
  Calendar, 
  ArrowRight, 
  TrendingUp,
  Clock,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"

export default function BlogIndex() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/blogs')
        const data = await response.json()
        if (data.success) {
          setBlogs(data.blogs)
        }
      } catch (error) {
        console.error("Fetch blogs error:", error)
      }
      setIsLoading(false)
    }
    fetchBlogs()
  }, [])

  const categories = Array.from(new Set(blogs.map(b => b.category)))

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === "All" || blog.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const featuredBlog = filteredBlogs[0]
  const otherBlogs = filteredBlogs.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <div className="space-y-4 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-action/10 border border-brand-action/20 text-brand-action text-[10px] font-black uppercase tracking-widest"
            >
              <Sparkles size={12} />
              <span>Career Intelligence</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Insights for the <br />
              <span className="bg-linear-to-r from-brand-action via-brand-secondary to-brand-action bg-clip-text text-transparent">Modern Professional</span>
            </h1>
            <p className="text-xl text-foreground/80 font-medium">
              Strategies, templates, and stories to help you win your next big opportunity.
            </p>
          </div>

          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-brand-action transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search insights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search blog posts"
              className="w-full bg-white/5 border border-border-custom rounded-2xl py-4 pl-12 pr-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-action/20 focus:border-brand-action transition-all"
            />
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-8 mb-12 custom-scrollbar px-2">
          <button 
            onClick={() => setActiveCategory("All")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeCategory === "All" ? "bg-brand-action text-white shadow-lg" : "bg-white/5 hover:bg-white/10 text-foreground/60"}`}
          >
            All Insights
          </button>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeCategory === cat ? "bg-brand-action text-white shadow-lg" : "bg-white/5 hover:bg-white/10 text-foreground/60"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-4/3 bg-white/5 rounded-[36px] animate-pulse" />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-[40px] border border-dashed border-white/10">
            <Search size={48} className="mx-auto text-foreground/20 mb-6" />
            <h3 className="text-2xl font-black mb-2">No insights found</h3>
            <p className="text-foreground/40 font-medium">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="space-y-16 pb-20 px-2">
            {/* Featured Post */}
            {activeCategory === "All" && !search && featuredBlog && (
              <Link href={`/blog/${featuredBlog.slug}`}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    y: -10,
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    borderColor: "rgba(255, 255, 255, 0.2)"
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="group relative pb-10 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white/5 border border-white/10 rounded-[40px] p-8 overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-video lg:aspect-square rounded-[32px] overflow-hidden shadow-2xl">
                    <motion.div
                      className="w-full h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <Image 
                        src={featuredBlog.image} 
                        alt={featuredBlog.title} 
                        fill 
                        className="object-cover" 
                      />
                    </motion.div>
                  </div>
                  
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-foreground/60">
                      <span className="text-brand-action">{featuredBlog.category}</span>
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{featuredBlog.createdAt ? format(new Date(featuredBlog.createdAt), 'MMM dd, yyyy') : ''}</span>
                    </div>
                    
                    <motion.h2 
                      className="text-4xl md:text-5xl font-black tracking-tighter"
                      whileHover={{ color: "#2563EB" }}
                      transition={{ duration: 0.3 }}
                    >
                      {featuredBlog.title}
                    </motion.h2>
                    
                    <p className="text-lg text-foreground/50 font-medium leading-relaxed line-clamp-3">
                      {featuredBlog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-action/20 flex items-center justify-center text-brand-action font-black">
                         {(featuredBlog.author?.name || "A").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black">{featuredBlog.author?.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Author</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-brand-action font-black uppercase tracking-widest text-xs">
                        <span>Read Insight</span>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Grid of regular posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeCategory === "All" && !search ? otherBlogs : filteredBlogs).map((blog, i) => (
                <Link key={blog.slug} href={`/blog/${blog.slug}`}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ 
                        y: -8,
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderColor: "rgba(255, 255, 255, 0.2)"
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: i * 0.1 
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
                        <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-foreground/60">
                          <Calendar size={12} aria-hidden="true" />
                          <span>{blog.createdAt ? format(new Date(blog.createdAt), 'MMM dd, yyyy') : ''}</span>
                          <div className="w-1 h-1 bg-white/10 rounded-full" />
                          <Clock size={12} aria-hidden="true" />
                          <span>5 min read</span>
                        </div>
  
                        <motion.h3 
                          className="text-2xl font-black tracking-tight line-clamp-2 leading-tight"
                          whileHover={{ color: "#2563EB" }}
                          transition={{ duration: 0.3 }}
                        >
                          {blog.title}
                        </motion.h3>

                      <p className="text-sm text-foreground/40 font-medium line-clamp-2 flex-1">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                        <div className="flex items-center space-x-2">
                           <span className="text-xs font-bold text-foreground/60">{blog.author?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-foreground/30">
                           <TrendingUp size={14} />
                           <span className="text-[10px] font-black">Trending</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
