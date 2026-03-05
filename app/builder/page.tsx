"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import countriesData from "@/lib/countries-data.json"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Save, 
  Download, 
  Settings, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderGit2, 
  Layout, 
  Eye,
  ChevronRight, 
  Wand2,
  Plus,
  Sparkles,
  Loader2,
  Camera,
  Image as ImageIcon,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  Search,
  GripVertical,
  Languages,
  Heart,
  Edit3
} from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"

import { ModernProfessional, CVData } from "@/components/templates/ModernProfessional"
import { ClassicTable } from "@/components/templates/ClassicTable"
import { ExecutiveTwoColumn } from "@/components/templates/ExecutiveTwoColumn"
import { MinimalATS } from "@/components/templates/MinimalATS"
import { CreativePortfolio } from "@/components/templates/CreativePortfolio"
import { StartupTech } from "@/components/templates/StartupTech"
import { ExecutiveBoard } from "@/components/templates/ExecutiveBoard"
import { MidnightElegance } from "@/components/templates/MidnightElegance"
import { BoldImpact } from "@/components/templates/BoldImpact"
import { CorporateClean } from "@/components/templates/CorporateClean"
import { FreshMinimal } from "@/components/templates/FreshMinimal"
import { RefinedClassic } from "@/components/templates/RefinedClassic"
import { ATSAuditPanel } from "@/components/ATSAuditPanel"
import { refineTextWithAI, saveCV } from "@/lib/actions"

const sections = [
  { id: "personal", title: "Personal Info", icon: User },
  { id: "experience", title: "Experience", icon: Briefcase },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "skills", title: "Skills", icon: Code },
  { id: "projects", title: "Projects", icon: FolderGit2 },
  { id: "languages", title: "Languages", icon: Languages },
  { id: "volunteering", title: "Volunteering", icon: Heart },
]


const INITIAL_DATA: CVData = {
  personalInfo: {
    fullName: "Alex Sterling",
    jobTitle: "Senior Product Designer",
    email: "alex.sterling@cvmyjob.online",
    phoneCode: "+1",
    phone: "87 123 4567",
    country: "United States",
    county: "New York",
    location: "",
    website: "alexsterling.design",
    linkedin: "linkedin.com/in/alexsterling",
    github: "github.com/asterling",
    facebook: "",
    summary: "Strategic Product Designer with 8+ years of experience in building high-scale digital ecosystems. Expert in bridging the gap between complex engineering requirements and intuitive user experiences. Proven track record of leading design teams to deliver award-winning platforms that serve millions of active users.",
    profileImage: "",
  },
  experience: [
    {
      id: "1",
      role: "Lead UI/UX Architect",
      company: "Quantum Systems",
      duration: "2021 - Present",
      description: [
        "Orchestrated the complete redesign of the core dashboard, increasing user retention by 35% within the first quarter.",
        "Implemented a comprehensive design system adopted by 15+ cross-functional teams, reducing development time by 20%.",
        "Pioneered AI-driven personalization features that improved conversion rates for enterprise clients by 12%."
      ],
    },
    {
      id: "2",
      role: "Senior Digital Designer",
      company: "Aura Creative",
      duration: "2018 - 2021",
      description: [
        "Led the visual identity refresh for 3 Fortune 500 clients, resulting in a cohesive brand presence across all digital touchpoints.",
        "Collaborated closely with engineering to ensure pixel-perfect implementation of complex interactive components.",
        "Mentored junior designers and established a new peer-review workflow that improved design consistency by 50%."
      ],
    }
  ],
  education: [
    {
      id: "1",
      degree: "M.A. in Interaction Design",
      school: "National College of Art & Design",
      duration: "2016 - 2018",
    },
    {
      id: "2",
      degree: "B.A. in Visual Communications",
      school: "Dublin Institute of Technology",
      duration: "2012 - 2016",
    }
  ],
  skills: [
    { category: "Design Tools", items: ["Figma", "Adobe Creative Suite", "Framer", "Principle"] },
    { category: "Technical skills", items: ["React", "HTML5/CSS3", "Design Systems", "Web Accessibility (WCAG)"] },
    { category: "Leadership", items: ["Team Management", "Agile Methodology", "Strategic Planning", "User Research"] },
  ],
  projects: [
    {
      id: "1",
      name: "cvmyjob Component Library",
      description: "A state-of-the-art React component library focused on high-performance animations and modern aesthetics.",
      link: "github.com/cvmyjob/ui"
    },
    {
      id: "2",
      name: "EcoTrack Mobile App",
      description: "An AI-powered application that helps users track and reduce their carbon footprint through real-time behavioral analysis.",
      link: "ecotrack.app"
    }
  ]
}

function BuilderContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const templateParam = searchParams.get("template")
  const [activeSection, setActiveSection] = useState("personal")
  const [isPreview, setIsPreview] = useState(false)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
  const [cvData, setCvData] = useState<CVData>({
    ...INITIAL_DATA,
    personalInfo: {
      ...INITIAL_DATA.personalInfo,
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
    }
  })
  const [currentTemplate, setCurrentTemplate] = useState<"modern" | "classic" | "executive" | "minimal" | "creative" | "startup" | "executive-board" | "midnight" | "bold-impact" | "corporate" | "fresh" | "refined">("modern")
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false)
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [phoneSearch, setPhoneSearch] = useState("")
  const [stateSearch, setStateSearch] = useState("")
  const countries = countriesData
  const [isSaving, setIsSaving] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [skillInput, setSkillInput] = useState("")
  const [draggedSkillIndex, setDraggedSkillIndex] = useState<number | null>(null)
  const [dragOverSkillIndex, setDragOverSkillIndex] = useState<number | null>(null)
  const [pageCount, setPageCount] = useState(1)
  const [lastSavedData, setLastSavedData] = useState("")
  const previewRef = useRef<HTMLDivElement>(null)
  const templateDropdownRef = useRef<HTMLDivElement>(null)
  const phoneDropdownRef = useRef<HTMLDivElement>(null)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const stateDropdownRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  useEffect(() => {
    if (templateParam) {
      const validTemplates = ["modern", "classic", "executive", "minimal", "creative", "startup", "executive-board", "midnight", "bold-impact", "corporate", "fresh", "refined"]
      if (validTemplates.includes(templateParam)) {
        setCurrentTemplate(templateParam as any)
      }
    }
  }, [templateParam])

  useEffect(() => {
    const updatePageCount = () => {
      if (previewRef.current) {
        const height = previewRef.current.offsetHeight
        // 1122.5px is roughly 297mm at 96dpi
        const pages = Math.ceil(height / 1122)
        setPageCount(pages || 1)
      }
    }
    updatePageCount()
    const observer = new ResizeObserver(updatePageCount)
    if (previewRef.current) observer.observe(previewRef.current)
    return () => observer.disconnect()
  }, [cvData, currentTemplate])

  useEffect(() => {
    if (isPreview) {
      document.body.classList.add("builder-fullscreen")
    } else {
      document.body.classList.remove("builder-fullscreen")
    }
    return () => document.body.classList.remove("builder-fullscreen") // Cleanup on unmount
  }, [isPreview])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target as Node)) {
        setIsTemplateDropdownOpen(false)
      }
      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(event.target as Node)) {
        setIsPhoneDropdownOpen(false)
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false)
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Scroll to active item when dropdowns open
  useEffect(() => {
    if ((isPhoneDropdownOpen || isCountryDropdownOpen || isStateDropdownOpen) && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [isPhoneDropdownOpen, isCountryDropdownOpen, isStateDropdownOpen])

  const handleSave = async (shouldRedirect = false) => {
    if (!session?.user?.id) return
    setIsSaving(true)
    const res = await saveCV(session.user.id, { ...cvData, templateId: currentTemplate })
    if (res.success && res.id) {
      if (shouldRedirect) {
        router.push(`/builder/${res.id}/success`)
      } else {
        router.push(`/builder/${res.id}`)
      }
    }
    setIsSaving(false)
  }

  const handleRefine = async (type: "summary" | "experience" | "project", id?: string) => {
    if (type === "summary") {
      if (!cvData.personalInfo.summary) return
      setIsRefining(true)
      const res = await refineTextWithAI(cvData.personalInfo.summary, "summary")
      if (res.success && res.refinedText) {
        updatePersonalInfo("summary", res.refinedText)
      }
      setIsRefining(false)
    } else if (type === "experience" && id) {
      const exp = cvData.experience.find(e => e.id === id)
      if (!exp || exp.description.length === 0) return
      setIsRefining(true)
      const res = await refineTextWithAI(exp.description.join("\n"), "experience")
      if (res.success && res.refinedText) {
        const bullets = res.refinedText.split("\n")
          .map(line => line.replace(/^[-•*]\s*/, "")) // Remove common bullet point chars
          .filter(line => line.trim())
        updateExperience(id, "description", bullets)
      }
      setIsRefining(false)
    } else if (type === "project" && id) {
      const proj = cvData.projects.find(p => p.id === id)
      if (!proj || !proj.description) return
      setIsRefining(true)
      const res = await refineTextWithAI(proj.description, "summary") // Use summary prompt for project description
      if (res.success && res.refinedText) {
        updateProject(id, "description", res.refinedText)
      }
      setIsRefining(false)
    }
  }

  const updatePersonalInfo = (field: keyof CVData["personalInfo"], value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateExperience = (id: string, field: keyof CVData["experience"][0], value: any) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }))
  }

  const addExperience = () => {
    const newId = Math.random().toString(36).substring(7)
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: newId, role: "", company: "", duration: "", description: [] }]
    }))
  }

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  const updateEducation = (id: string, field: keyof CVData["education"][0], value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }))
  }

  const addEducation = () => {
    const newId = Math.random().toString(36).substring(7)
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, { id: newId, degree: "", school: "", duration: "" }]
    }))
  }

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (!trimmed) return
    setCvData(prev => {
      // Add to first group, or create a new group
      const newSkills = prev.skills.length > 0 ? [...prev.skills] : [{ category: "Skills", items: [] }]
      const alreadyExists = newSkills[0].items.some(s => s.toLowerCase() === trimmed.toLowerCase())
      if (alreadyExists) return prev
      newSkills[0] = { ...newSkills[0], items: [...newSkills[0].items, trimmed] }
      return { ...prev, skills: newSkills }
    })
  }

  const removeSkill = (skillToRemove: string) => {
    setCvData(prev => {
      const newSkills = prev.skills.map(group => ({
        ...group,
        items: group.items.filter(s => s !== skillToRemove)
      })).filter(group => group.items.length > 0)
      return { ...prev, skills: newSkills }
    })
  }

  const reorderSkill = (sourceIndex: number, destinationIndex: number) => {
    setCvData(prev => {
      const allSkills = prev.skills.flatMap(g => g.items)
      const [movedItem] = allSkills.splice(sourceIndex, 1)
      allSkills.splice(destinationIndex, 0, movedItem)
      return { ...prev, skills: [{ category: "Skills", items: allSkills }] }
    })
  }

  const updateProject = (id: string, field: keyof CVData["projects"][0], value: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }))
  }

  const addProject = () => {
    const newId = Math.random().toString(36).substring(7)
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: newId, name: "", description: "", link: "" }]
    }))
  }

  const removeProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }))
  }

  // Languages helpers
  const addLanguage = () => {
    setCvData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), { name: "", proficiency: "Beginner" }]
    }))
  }

  const updateLanguage = (index: number, field: "name" | "proficiency", value: string) => {
    setCvData(prev => {
      const langs = [...(prev.languages || [])]
      langs[index] = { ...langs[index], [field]: value }
      return { ...prev, languages: langs }
    })
  }

  const removeLanguage = (index: number) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== index)
    }))
  }

  // Volunteering helpers
  const addVolunteering = () => {
    const newId = Math.random().toString(36).substring(7)
    setCvData(prev => ({
      ...prev,
      volunteering: [...(prev.volunteering || []), { id: newId, role: "", organization: "", duration: "", location: "", description: "" }]
    }))
  }

  const updateVolunteering = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      volunteering: (prev.volunteering || []).map(v => v.id === id ? { ...v, [field]: value } : v)
    }))
  }

  const removeVolunteering = (id: string) => {
    setCvData(prev => ({
      ...prev,
      volunteering: (prev.volunteering || []).filter(v => v.id !== id)
    }))
  }

  // Path-based update for WYSIWYG
  const handleUpdate = (path: string, value: any) => {
    const keys = path.split(".")
    
    // Special handling for array actions
    if (path.endsWith(".add")) {
      const section = keys[0]
      if (section === "experience") addExperience()
      else if (section === "education") addEducation()
      else if (section === "projects") addProject()
      else if (section === "languages") addLanguage()
      else if (section === "volunteering") addVolunteering()
      return
    }

    if (path.endsWith(".remove")) {
      const section = keys[0]
      if (section === "experience") removeExperience(value)
      else if (section === "education") removeEducation(value)
      else if (section === "projects") removeProject(value)
      else if (section === "languages") removeLanguage(value)
      else if (section === "volunteering") removeVolunteering(value)
      return
    }

    // Normal attribute updates
    if (keys[0] === "personalInfo") {
      updatePersonalInfo(keys[1] as any, value)
    } else if (keys[0] === "experience") {
      updateExperience(keys[1], keys[2] as any, value)
    } else if (keys[0] === "education") {
      updateEducation(keys[1], keys[2] as any, value)
    } else if (keys[0] === "skills") {
      // Direct skill update for simple tag editing
      setCvData(prev => ({ ...prev, skills: [{ category: "Skills", items: value }] }))
    } else if (keys[0] === "projects") {
      updateProject(keys[1], keys[2] as any, value)
    } else if (keys[0] === "languages") {
      updateLanguage(parseInt(keys[1]), keys[2] as any, value)
    } else if (keys[0] === "volunteering") {
      updateVolunteering(keys[1], keys[2] as any, value)
    }
  }

  const handleDownload = async () => {
    if (!previewRef.current) return
    setIsSaving(true)
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const pdf = new jsPDF("p", "mm", "a4")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Calculate how many pages we need
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = imgWidth / pdfWidth
      const imgHeightInPdf = imgHeight / ratio
      
      let heightLeft = imgHeightInPdf
      let position = 0
      
      // Page 1
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeightInPdf)
      heightLeft -= pdfHeight
      
      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeightInPdf
        pdf.addPage()
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeightInPdf)
        heightLeft -= pdfHeight
      }
      
      pdf.save(`${cvData.personalInfo.fullName || "CV"}-Forge.pdf`)
    } catch (err) {
      console.error("PDF Export error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save logic
  useEffect(() => {
    const currentDataStr = JSON.stringify(cvData)
    if (currentDataStr === lastSavedData) return

    const timer = setTimeout(async () => {
      if (session?.user?.id && !isSaving && !isRefining) {
        setIsAutoSaving(true)
        const res = await saveCV(session.user.id, { ...cvData, templateId: currentTemplate })
        if (res.success) {
          setLastSavedData(currentDataStr)
          // Update URL if it's the first save
          if (!window.location.pathname.includes(res.id!)) {
            window.history.replaceState(null, "", `/builder/${res.id}`)
          }
        }
        setIsAutoSaving(false)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [cvData, session, currentTemplate, lastSavedData])

  const renderTemplate = () => {
    switch (currentTemplate) {
      case "classic":
        return <ClassicTable data={cvData} />
      case "executive":
        return <ExecutiveTwoColumn data={cvData} />
      case "minimal":
        return <MinimalATS data={cvData} />
      case "creative":
        return <CreativePortfolio data={cvData} />
      case "startup":
        return <StartupTech data={cvData} />
      case "executive-board":
        return <ExecutiveBoard data={cvData} />
      case "midnight":
        return <MidnightElegance data={cvData} isEditable={true} onUpdate={handleUpdate} />
      case "bold-impact":
        return <BoldImpact data={cvData} />
      case "corporate":
        return <CorporateClean data={cvData} />
      case "fresh":
        return <FreshMinimal data={cvData} />
      case "refined":
        return <RefinedClassic data={cvData} />
      default:
        return <ModernProfessional data={cvData} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pt-20 overflow-hidden h-[calc(100vh-80px)] bg-[#070707] relative">
        <div className="h-full flex flex-col relative z-10">
          
          {/* Top Selection & Status Toolbar */}
          <div className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 bg-black/40 backdrop-blur-3xl z-40">
              <div className="flex items-center space-x-3 sm:space-x-5">
                {/* Template Navigator */}
                <div className="relative" ref={templateDropdownRef}>
                  <button 
                    onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                    className="flex items-center space-x-3 px-4 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all active:scale-95 group"
                  >
                    <div className="w-8 h-5 rounded-md overflow-hidden border border-white/10 hidden xs:block bg-brand-action/20 flex items-center justify-center">
                       <Layout size={10} className="text-brand-action" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground/80">
                      Style: <span className="text-brand-action ml-1 uppercase">{currentTemplate}</span>
                    </span>
                    <ChevronDown size={14} className={`text-foreground/40 transition-transform duration-300 ${isTemplateDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isTemplateDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-3 w-[560px] bg-[#0c0c0c]/98 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] p-4 z-[100]"
                      >
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "modern", name: "Modern Elite" },
                            { id: "classic", name: "Classic Grid" },
                            { id: "executive", name: "Corporate Duo" },
                            { id: "minimal", name: "ATS Optimized" },
                            { id: "creative", name: "Creative Edge" },
                            { id: "startup", name: "Startup Vibe" },
                            { id: "midnight", name: "Midnight Elegance" },
                            { id: "bold-impact", name: "Bold Impact" },
                            { id: "corporate", name: "Corporate Clean" },
                            { id: "fresh", name: "Fresh Minimal" },
                            { id: "refined", name: "Refined Classic" }
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => {
                                setCurrentTemplate(t.id as any);
                                setIsTemplateDropdownOpen(false);
                              }}
                              className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all group ${currentTemplate === t.id ? 'bg-brand-action/10 border border-brand-action/30' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                              <div className={`w-full h-20 rounded-xl overflow-hidden border transition-all ${currentTemplate === t.id ? 'border-brand-action/50' : 'border-white/5 group-hover:border-white/10'} bg-white/5`} />
                              <span className={`text-[10px] font-black uppercase tracking-tight text-center ${currentTemplate === t.id ? 'text-brand-action' : 'text-foreground/40'}`}>{t.name}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cloud Sync Status */}
                <div className="hidden lg:flex items-center space-x-6 border-l border-white/5 ml-2 pl-6">
                  <div className={`flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border transition-all duration-500 ${isAutoSaving ? 'bg-brand-action/10 border-brand-action/40 shadow-[0_0_20px_rgba(var(--brand-action-rgb),0.1)]' : 'bg-brand-success/5 border-brand-success/20'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isAutoSaving ? 'bg-brand-action animate-spin ring-4 ring-brand-action/20' : 'bg-brand-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)] ring-4 ring-brand-success/10'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${isAutoSaving ? 'text-brand-action' : 'text-brand-success/80'}`}>
                      {isAutoSaving ? 'Cloud Synced...' : 'Changes Persisted'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-brand-action/10 px-3.5 py-1.5 rounded-full border border-brand-action/20">
                     <Edit3 size={10} className="text-brand-action" />
                     <span className="text-[9px] font-black text-brand-action uppercase">WYSIWYG Mode</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                 <button 
                  onClick={() => setIsAuditOpen(true)}
                  className="flex items-center space-x-2 px-5 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/5 hover:bg-brand-action/10 hover:border-brand-action/30 border border-white/10 text-brand-action transition-all active:scale-95 group"
                >
                   <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                   <span className="hidden lg:inline">ATS Compliance</span>
                </button>

                 <button 
                  onClick={handleDownload}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-5 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/5 hover:bg-brand-action/10 hover:border-brand-action/30 border border-white/10 text-white/60 hover:text-brand-action transition-all active:scale-95 group disabled:opacity-50"
                >
                   {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                   <span className="hidden lg:inline">Download</span>
                </button>

                <button 
                  onClick={() => setIsPreview(!isPreview)}
                  className={`flex items-center space-x-2 px-6 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${isPreview ? "bg-white text-black" : "bg-brand-action text-white shadow-xl shadow-brand-action/20"}`}
                >
                   {isPreview ? <ArrowUpRight size={16} className="rotate-180" /> : <Eye size={16} />}
                   <span>{isPreview ? "Resume Draft" : "Review & Export"}</span>
                </button>
              </div>
          </div>

          {/* Interactive Workspace (CV Canvas) */}
          <div className={`flex-1 overflow-y-auto custom-scrollbar p-10 sm:p-24 transition-all duration-700 bg-[#050505] relative ${isPreview ? "bg-background" : ""}`}>
             {/* The CV Document */}
             <div 
               className={`mx-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isPreview ? "scale-95" : "scale-105 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]"}`}
               style={{ width: "210mm" }}
             >
                <div 
                  ref={previewRef} 
                  className="relative bg-white min-h-[297mm] ring-1 ring-black/5"
                >
                  {renderTemplate()}
                  
                  {/* Visual Page Margin Guides (Only in Editor) */}
                  {!isPreview && (
                    <>
                      <div className="absolute top-0 bottom-0 left-[-40px] w-px bg-white/5 border-l border-dashed border-white/10" />
                      <div className="absolute top-0 bottom-0 right-[-40px] w-px bg-white/5 border-r border-dashed border-white/10" />
                    </>
                  )}
                </div>
             </div>

             {/* Background Decoration */}
             {!isPreview && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                   <div className="absolute top-[20%] left-[15%] w-[600px] h-[600px] bg-brand-action/5 rounded-full blur-[160px] animate-pulse" />
                   <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
             )}
          </div>
        </div>

        {/* ATS Audit Logic */}
        <ATSAuditPanel 
          isOpen={isAuditOpen} 
          onClose={() => setIsAuditOpen(false)} 
          cvData={{...cvData, templateId: currentTemplate}} 
        />
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-action" size={48} />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  )
}
