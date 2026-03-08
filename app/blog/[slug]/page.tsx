"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { motion } from "framer-motion"
import { 
  Calendar, 
  ArrowLeft, 
  Tag as TagIcon, 
  Clock,
  Twitter,
  Linkedin,
  Link2,
  Loader2,
  Quote,
  TrendingUp,
  Bookmark,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { message } from "antd"
import { useSession } from "next-auth/react"
import { addComment, getComments, deleteComment, refineTextWithAI } from "@/lib/actions"
import { User, MessageSquare, Send, Trash2 } from "lucide-react"

export default function BlogPost() {
  const { slug } = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchingComments, setIsFetchingComments] = useState(true)
  const [isRefining, setIsRefining] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/blogs/${slug}`)
            const data = await response.json()
            
            if (data.success) {
                setBlog(data.blog)
                setRelated(data.related || [])
            } else {
                message.error(data.error || "Blog not found")
                router.push("/blog")
            }
        } catch (error) {
            console.error("Fetch blog error:", error)
        }
        setIsLoading(false)
    }
    fetchBlog()
  }, [slug])

  useEffect(() => {
    const fetchComments = async () => {
      if (!slug) return
      setIsFetchingComments(true)
      const res = await getComments(slug as string)
      if (res.success) {
        setComments(res.comments || [])
      }
      setIsFetchingComments(false)
    }
    fetchComments()
  }, [slug])

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id || !newComment.trim()) return

    setIsSubmitting(true)
    const res = await addComment(slug as string, newComment.trim())
    if (res.success) {
      setComments([res.comment, ...comments])
      setNewComment("")
      message.success("Comment posted successfully!")
    } else {
      message.error(res.error || "Failed to post comment")
    }
    setIsSubmitting(false)
  }
  const handleRefineComment = async () => {
    if (!newComment.trim()) return
    setIsRefining(true)
    const res = await refineTextWithAI(newComment, "comment")
    if (res.success && res.refinedText) {
      setNewComment(res.refinedText)
      message.success("Comment refined by AI")
    } else {
      message.error(res.error || "Failed to refine comment")
    }
    setIsRefining(false)
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user?.id) return

    const res = await deleteComment(commentId)
    if (res.success) {
      setComments(comments.filter(c => c.id !== commentId))
      message.success("Comment deleted")
    } else {
      message.error(res.error || "Failed to delete comment")
    }
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out this insight on cvmyjob: ${blog.title}`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        message.success("Link copied to clipboard!")
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="animate-spin text-brand-action" size={40} />
          <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">Accessing intelligence…</p>
        </div>
      </div>
    )
  }

  if (!blog) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 overflow-x-hidden">
        <Link 
          href="/blog" 
          className="inline-flex items-center space-x-2 text-foreground/60 hover:text-brand-action font-black uppercase tracking-widest text-[10px] mb-12 transition-colors group"
          aria-label="Back to Inventory of Insights"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          <span>Inventory of Insights</span>
        </Link>

        <div className="flex flex-col gap-20">
          <article className="w-full min-w-0 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                 <span className="px-4 py-1.5 bg-brand-action/10 text-brand-action text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-action/20">
                    {blog.category}
                 </span>
                 <div className="flex items-center space-x-2 text-foreground/60 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={12} aria-hidden="true" />
                    <span>8 min read</span>
                 </div>
              </div>

              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight max-w-5xl">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-white/5">
                <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 rounded-2xl bg-brand-action/20 border border-brand-action/10 flex items-center justify-center text-brand-action font-black text-xl overflow-hidden shadow-2xl">
                     {blog.author.image ? (
                        <Image src={blog.author.image} alt={blog.author.name} width={48} height={48} />
                     ) : (blog.author.name || "A").charAt(0)}
                   </div>
                   <div>
                      <p className="font-black text-lg leading-tight">{blog.author.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Career Strategist • {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</p>
                   </div>
                </div>

                <div className="flex items-center space-x-3">
                   <button onClick={() => handleShare('twitter')} aria-label="Share on Twitter" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/60 hover:text-brand-action transition-all border border-white/5">
                      <Twitter size={18} aria-hidden="true" />
                   </button>
                   <button onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/60 hover:text-brand-action transition-all border border-white/5">
                      <Linkedin size={18} aria-hidden="true" />
                   </button>
                   <button onClick={() => handleShare('copy')} aria-label="Copy Link" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-foreground/60 hover:text-brand-action transition-all border border-white/5">
                      <Link2 size={18} aria-hidden="true" />
                   </button>
                </div>
              </div>
            </div>

            <motion.div 
              className="relative aspect-21/9 rounded-[40px] overflow-hidden shadow-2xl mb-12 group/hero-image cursor-pointer border border-white/5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover="hover"
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
               <motion.div
                 className="w-full h-full"
                 variants={{
                   hover: { scale: 1.04 }
                 }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
               >
                 <Image 
                   src={blog.image} 
                   alt={blog.title} 
                   fill 
                   className="object-cover" 
                   priority
                 />
               </motion.div>
               <motion.div 
                 className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" 
                 variants={{
                   hover: { opacity: 0.6 }
                 }}
                 initial={{ opacity: 0 }}
                 transition={{ duration: 0.8 }}
               />
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="prose prose-invert prose-2xl prose-premium max-w-none 
                [&>p:first-of-type]:first-letter:text-7xl 
                [&>p:first-of-type]:first-letter:font-black 
                [&>p:first-of-type]:first-letter:mr-3 
                [&>p:first-of-type]:first-letter:float-left 
                [&>p:first-of-type]:first-letter:text-brand-action
                [&>p:first-of-type]:first-letter:leading-[0.8]">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h2: ({node, onAnimationStart, onAnimationEnd, onAnimationIteration, onDrag, onDragStart, onDragEnd, ...props}) => (
                      <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black tracking-tighter mt-16 mb-8 text-foreground" 
                        {...props} 
                      />
                    ),
                    h3: ({node, onAnimationStart, onAnimationEnd, onAnimationIteration, onDrag, onDragStart, onDragEnd, ...props}) => (
                      <motion.h3 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-black tracking-tight mt-12 mb-6 text-foreground/90" 
                        {...props} 
                      />
                    ),
                    p: ({node, onAnimationStart, onAnimationEnd, onAnimationIteration, onDrag, onDragStart, onDragEnd, ...props}) => (
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8 font-medium" 
                        {...props} 
                      />
                    ),
                    blockquote: ({node, onAnimationStart, onAnimationEnd, onAnimationIteration, onDrag, onDragStart, onDragEnd, ...props}) => (
                      <motion.blockquote 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative my-12 p-8 md:p-12 bg-white/5 border-l-4 border-brand-action rounded-2xl md:rounded-3xl"
                        {...props}
                      >
                        <Quote className="absolute -top-6 -left-6 w-12 h-12 text-brand-action/20 rotate-180" />
                        <div className="relative z-10 italic text-2xl md:text-3xl font-black text-foreground tracking-tight">
                          {props.children}
                        </div>
                      </motion.blockquote>
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="space-y-4 my-8 list-none pl-0" {...props} />
                    ),
                    li: ({node, onAnimationStart, onAnimationEnd, onAnimationIteration, onDrag, onDragStart, onDragEnd, ...props}) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-start space-x-4 text-lg md:text-xl text-foreground/70 font-medium"
                        {...props}
                      >
                        <div className="mt-2.5 w-2 h-2 rounded-full bg-brand-action shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                        <span>{props.children}</span>
                      </motion.li>
                    ),
                    code: ({node, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '')
                      return !match ? (
                        <code className="bg-brand-action/10 text-brand-action px-2 py-0.5 rounded-md font-bold text-sm" {...props}>
                          {children}
                        </code>
                      ) : (
                        <div className="relative group my-8">
                          <div className="absolute -inset-2 bg-linear-to-r from-brand-action/20 to-brand-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <pre className="relative overflow-x-auto p-6 bg-[#0B0F1A] border border-white/10 rounded-[24px] font-mono text-sm leading-relaxed custom-scrollbar shadow-2xl">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      )
                    }
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-12">
               {blog.tags?.map((tag: any) => (
                 <span key={tag} className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-foreground/60 hover:border-brand-action/20 hover:text-brand-action transition-all pointer-events-none">
                    <TagIcon size={12} aria-hidden="true" />
                    <span>{tag}</span>
                 </span>
               ))}
            </div>
          </article>

          <footer className="pt-10 border-t border-white/5 space-y-24">
            <div className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {related.map((post: any) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`}>
                      <motion.div 
                        whileHover={{ 
                          y: -8,
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          borderColor: "rgba(255, 255, 255, 0.2)"
                        }}
                        transition={{ 
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                        className="group flex flex-col h-full bg-white/5 border border-white/5 rounded-[36px] overflow-hidden cursor-pointer"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <motion.div
                            className="w-full h-full"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          >
                            <Image 
                              src={post.image} 
                              alt={post.title} 
                              fill 
                              className="object-cover" 
                            />
                          </motion.div>
                        </div>
                        <div className="space-y-3 flex-1 p-6">
                           <p className="text-[10px] font-black uppercase tracking-widest text-brand-action">{post.category}</p>
                           <motion.h3 
                             className="text-2xl font-black tracking-tight line-clamp-2 leading-tight"
                             whileHover={{ color: "#2563EB" }}
                             transition={{ duration: 0.3 }}
                           >
                              {post.title}
                           </motion.h3>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-foreground/60 border-t border-white/5 p-6">
                           <Calendar size={12} aria-hidden="true" />
                           <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
               </div>
               {related.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-16 px-8 bg-white/5 border border-dashed border-white/10 rounded-[40px] text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-brand-action/10 flex items-center justify-center text-brand-action">
                      <Sparkles size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black tracking-tight">Intelligence Horizon Clear</h4>
                      <p className="text-foreground/60 font-medium max-w-sm">No parallel insights discovered in this sector yet. Check back soon for new strategic updates.</p>
                    </div>
                 </div>
               )}
            </div>

            {/* Comments Section */}
            <div className="pt-24 border-t border-white/5 space-y-12">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-action/10 flex items-center justify-center text-brand-action">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter">Community <span className="text-brand-action">Insights</span></h3>
                    <p className="text-foreground/40 font-medium">{comments.length} comments shared</p>
                  </div>
               </div>

               {session ? (
                 <form onSubmit={handlePostComment} className="space-y-4">
                   <div className="relative group">
                     <textarea
                       value={newComment}
                       onChange={(e) => setNewComment(e.target.value)}
                       placeholder="Share your strategic perspective..."
                       className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[32px] p-6 min-h-[140px] font-medium text-lg focus:outline-none focus:ring-2 focus:ring-brand-action/20 focus:border-brand-action transition-all resize-none"
                       disabled={isSubmitting || isRefining}
                     />
                     <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                       <button
                         type="button"
                         onClick={handleRefineComment}
                         disabled={isSubmitting || isRefining || !newComment.trim()}
                         className="p-4 rounded-2xl bg-brand-action/10 text-brand-action hover:bg-brand-action hover:text-white disabled:opacity-50 transition-all flex items-center justify-center"
                         title="Refine with AI"
                       >
                         {isRefining ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                       </button>
                       <button
                         type="submit"
                         disabled={isSubmitting || isRefining || !newComment.trim()}
                         className="p-4 rounded-2xl bg-brand-action text-white shadow-lg shadow-brand-action/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center"
                       >
                         {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                       </button>
                     </div>
                   </div>
                 </form>
               ) : (
                  <div className="bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 rounded-[32px] p-10 text-center space-y-6">
                   <p className="text-foreground/60 font-medium">Join the professional conversation by unlocking your account.</p>
                   <Link 
                     href={`/login?redirectTo=/blog/${slug}`} 
                     className="inline-flex items-center space-x-3 px-8 py-4 bg-brand-action text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all"
                   >
                     <span>Sign In to Post</span>
                   </Link>
                 </div>
               )}

               <div className="space-y-8">
                 {isFetchingComments ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin text-brand-action/20" size={32} />
                    </div>
                 ) : comments.length > 0 ? (
                   comments.map((comment) => (
                     <motion.div 
                       key={comment.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="flex gap-6 group"
                     >
                       <div className="shrink-0">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground/40 font-black overflow-hidden">
                           {comment.user.image ? (
                             <Image src={comment.user.image} alt={comment.user.name || "A"} width={48} height={48} />
                           ) : (comment.user.name || "A").charAt(0)}
                         </div>
                       </div>
                       <div className="flex-1 space-y-2">
                         <div className="flex items-center justify-between">
                           <div>
                             <span className="font-black text-lg">{comment.user.name}</span>
                             <span className="mx-2 text-foreground/20 italic">•</span>
                             <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
                               {format(new Date(comment.createdAt), 'MMM dd, HH:mm')}
                             </span>
                           </div>
                           {session?.user?.id === comment.userId && (
                             <button 
                               onClick={() => handleDeleteComment(comment.id)}
                               className="p-2 text-foreground/20 hover:text-brand-error transition-colors opacity-0 group-hover:opacity-100"
                             >
                               <Trash2 size={16} />
                             </button>
                           )}
                         </div>
                         <p className="text-foreground/70 leading-relaxed font-medium">
                           {comment.content}
                         </p>
                       </div>
                     </motion.div>
                   ))
                 ) : (
                   <p className="text-center py-12 text-foreground/20 font-black uppercase tracking-widest text-xs">Be the first to share an insight.</p>
                 )}
               </div>
            </div>

            {/* Premium Flex Banner CTA */}
            <div className="bg-linear-to-r from-brand-action via-indigo-600 to-brand-action rounded-[50px] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl border border-white/10">
               <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left max-w-4xl">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl rounded-[28px] flex items-center justify-center border border-white/20 shrink-0 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <Quote size={40} className="text-white drop-shadow-lg" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-4xl md:text-5xl font-black leading-[0.9] tracking-tighter">
                        Your next level <br className="hidden md:block" /> is one CV away.
                      </h3>
                      <p className="text-xl font-medium text-white/70 max-w-xl">
                        Transform your professional story into a high-impact career asset.
                      </p>
                    </div>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    className="group/btn relative inline-flex items-center space-x-4 bg-white text-brand-action px-12 py-6 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap overflow-hidden"
                  >
                     <span className="relative z-10">Launch Editor</span>
                     <TrendingUp size={24} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                     <div className="absolute inset-0 bg-brand-action/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                  </Link>
               </div>
               
               {/* Abstract decorative elements */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48 transition-opacity group-hover:opacity-80" aria-hidden="true" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[120px] -ml-48 -mb-48" aria-hidden="true" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" aria-hidden="true" />
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
