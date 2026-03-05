// @ts-nocheck
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
import { refineTextWithAI, saveCV, getCV } from "@/lib/actions"

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
    fullName: "",
    jobTitle: "",
    email: "",
    phoneCode: "",
    phone: "",
    country: "",
    county: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    facebook: "",
    summary: "",
    profileImage: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: []
}

function BuilderContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const templateParam = searchParams.get("template")
  const cvIdParam = searchParams.get("cvId")
  const [activeSection, setActiveSection] = useState("personal")
  const [isPreview, setIsPreview] = useState(false)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
  const [isInlineEdit, setIsInlineEdit] = useState(false) // Toggle between sidebar and inline edit
  const [cvData, setCvData] = useState<CVData>(INITIAL_DATA)
  const [currentTemplate, setCurrentTemplate] = useState<"modern" | "classic" | "executive" | "minimal" | "creative" | "startup" | "executive-board" | "midnight" | "bold-impact" | "corporate" | "fresh" | "refined">("modern")
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false)
  const [refiningId, setRefiningId] = useState<string | null>(null)
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
  // Track the ID of the CV being edited so saves always update the same record
  const [currentCvId, setCurrentCvId] = useState<string | null>(cvIdParam)
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

  // Load existing CV when cvId param is present (e.g. coming from dashboard)
  useEffect(() => {
    if (cvIdParam && session?.user?.id) {
      const loadCV = async () => {
        const res = await getCV(cvIdParam, session.user.id)
        if (res.success && res.data) {
          setCvData(res.data)
          if (res.data.templateId) setCurrentTemplate(res.data.templateId as any)
          setCurrentCvId(cvIdParam)  // ensure save target is set
        }
      }
      loadCV()
    }
  }, [cvIdParam, session])

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
    // Pass currentCvId so we always update the same record, never create a duplicate
    const res = await saveCV(session.user.id, { ...cvData, templateId: currentTemplate }, currentCvId || undefined)
    if (res.success && res.id) {
      setCurrentCvId(res.id)  // pin the ID for all future saves
      if (shouldRedirect) {
        router.push(`/builder/${res.id}/success`)
      } else {
        // Stay on the WYSIWYG canvas — silently update the URL
        window.history.replaceState(null, "", `/builder?template=${currentTemplate}&cvId=${res.id}`)
      }
    }
    setIsSaving(false)
  }

  const handleRefine = async (type: "summary" | "experience" | "project" | "volunteering", id?: string) => {
    if (type === "summary") {
      if (!cvData.personalInfo.summary || refiningId === "summary") return
      setRefiningId("summary")
      try {
        const res = await refineTextWithAI(cvData.personalInfo.summary, "summary", cvData)
        if (res.success && res.refinedText) {
          updatePersonalInfo("summary", res.refinedText)
        } else if (res.error) {
          alert(res.error)
        }
      } catch {
        alert("Failed to refine text. Please try again.")
      } finally {
        setRefiningId(null)
      }
    } else if (type === "experience" && id) {
      const exp = cvData.experience.find(e => e.id === id)
      if (!exp || refiningId === id) return
      const textToRefine = exp.workDescription || exp.description.join("\n")
      if (!textToRefine) return
      setRefiningId(id)
      try {
        const res = await refineTextWithAI(textToRefine, "experience", cvData)
        if (res.success && res.refinedText) {
          if (exp.workDescription) {
            updateExperience(id, "workDescription", res.refinedText)
          } else {
            const bullets = res.refinedText.split("\n")
              .map(line => line.replace(/^[-•*\d.]+\s*/, "").trim())
              .filter(line => line.length > 0)
            updateExperience(id, "description", bullets)
          }
        } else if (res.error) {
          alert(res.error)
        }
      } catch {
        alert("Failed to refine text. Please try again.")
      } finally {
        setRefiningId(null)
      }
    } else if (type === "project" && id) {
      const proj = cvData.projects.find(p => p.id === id)
      if (!proj || !proj.description || refiningId === `project-${id}`) return
      setRefiningId(`project-${id}`)
      try {
        const res = await refineTextWithAI(proj.description, "summary", cvData)
        if (res.success && res.refinedText) {
          updateProject(id, "description", res.refinedText)
        } else if (res.error) {
          alert(res.error)
        }
      } catch {
        alert("Failed to refine text. Please try again.")
      } finally {
        setRefiningId(null)
      }
    } else if (type === "volunteering" && id) {
      const vol = cvData.volunteering?.find(v => v.id === id)
      if (!vol || !vol.description || refiningId === id) return
      setRefiningId(id)
      try {
        const res = await refineTextWithAI(vol.description, "experience", cvData)
        if (res.success && res.refinedText) {
          updateVolunteering(id, "description", res.refinedText)
        } else if (res.error) {
          alert(res.error)
        }
      } catch {
        alert("Failed to refine text. Please try again.")
      } finally {
        setRefiningId(null)
      }
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


  // Auto-save logic
  useEffect(() => {
    const currentDataStr = JSON.stringify(cvData)
    if (currentDataStr === lastSavedData) return

    const timer = setTimeout(async () => {
      if (session?.user?.id && !isSaving && !refiningId) {
        setIsAutoSaving(true)
        // Always pass currentCvId so we update the existing record, not create a new one
        const res = await saveCV(session.user.id, { ...cvData, templateId: currentTemplate }, currentCvId || undefined)
        if (res.success && res.id) {
          setLastSavedData(currentDataStr)
          setCurrentCvId(res.id)  // pin the ID after first save
          // Silently update the URL to reflect the saved CV id
          const urlCvId = new URLSearchParams(window.location.search).get("cvId")
          if (urlCvId !== res.id) {
            window.history.replaceState(null, "", `/builder?template=${currentTemplate}&cvId=${res.id}`)
          }
        }
        setIsAutoSaving(false)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [cvData, session, currentTemplate, lastSavedData, currentCvId])

  const renderTemplate = () => {
    switch (currentTemplate) {
      case "classic":
        return <ClassicTable data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "executive":
        return <ExecutiveTwoColumn data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "minimal":
        return <MinimalATS data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "creative":
        return <CreativePortfolio data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "startup":
        return <StartupTech data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "executive-board":
        return <ExecutiveBoard data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "midnight":
        return <MidnightElegance data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "bold-impact":
        return <BoldImpact data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "corporate":
        return <CorporateClean data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "fresh":
        return <FreshMinimal data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      case "refined":
        return <RefinedClassic data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
      default:
        return <ModernProfessional data={cvData} isEditable={isInlineEdit} onUpdate={handleUpdate} onRefine={handleRefine} refiningId={refiningId} />
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
                       <img 
                         src={`/${currentTemplate === 'minimal' ? 'ats' : currentTemplate === 'executive-board' ? 'board' : currentTemplate === 'bold-impact' ? 'bold' : currentTemplate}.png`} 
                         className="w-full h-full object-cover" 
                         onError={(e) => (e.currentTarget.src = "/modern.png")}
                         alt=""
                       />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/100">
                      Style: <span className="text-brand-action ml-1 uppercase">{currentTemplate}</span>
                    </span>
                    <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${isTemplateDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isTemplateDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-3 w-[560px] bg-[#0c0c0c]/98 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] p-4 z-[100]"
                      >
                        <div className="grid grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                          {[
                            { id: "modern", name: "Modern Elite" },
                            { id: "classic", name: "Classic Grid" },
                            { id: "executive", name: "Corporate Duo" },
                            { id: "minimal", name: "ATS Optimized" },
                            { id: "creative", name: "Creative Edge" },
                            { id: "startup", name: "Startup Vibe" },
                            { id: "executive-board", name: "Executive Board" },
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
                                // Update URL immediately
                                const params = new URLSearchParams(window.location.search);
                                params.set("template", t.id);
                                window.history.replaceState(null, "", `/builder?${params.toString()}`);
                              }}
                              className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all group ${currentTemplate === t.id ? 'bg-brand-action/10 border border-brand-action/30' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                              <div className={`w-full h-24 rounded-xl overflow-hidden border transition-all ${currentTemplate === t.id ? 'border-brand-action/50' : 'border-white/5 group-hover:border-white/10'} bg-white/5`}>
                                <img 
                                  src={`/${t.id === 'minimal' ? 'ats' : t.id === 'executive-board' ? 'board' : t.id === 'bold-impact' ? 'bold' : t.id}.png`} 
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                  onError={(e) => (e.currentTarget.src = "/modern.png")}
                                  alt={t.name}
                                />
                              </div>
                              <span className={`text-[10px] text-white/90 font-black uppercase tracking-tight text-center ${currentTemplate === t.id ? 'text-brand-action' : 'text-foreground/40'}`}>{t.name}</span>
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
                
                {/* Inline Edit Toggle */}
                <button
                  onClick={() => setIsInlineEdit(!isInlineEdit)}
                  className={`flex items-center space-x-2 px-5 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
                    isInlineEdit 
                      ? 'bg-brand-action text-white border-brand-action' 
                      : 'bg-white/5 hover:bg-white/10 border-border-custom text-foreground/70'
                  }`}
                  title={isInlineEdit ? "Using Inline Edit - Click on CV to edit" : "Using Sidebar Editor"}
                >
                   {isInlineEdit ? (
                     <>
                       <Sparkles size={16} className="text-white" />
                       <span className="hidden lg:inline">Inline Edit</span>
                     </>
                   ) : (
                     <>
                       <Settings size={16} className="text-foreground/70" />
                       <span className="hidden lg:inline">Sidebar Edit</span>
                     </>
                   )}
                </button>

                 <button 
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-5 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-brand-action text-white shadow-lg shadow-brand-action/20 border border-brand-action/30 transition-all active:scale-95 group disabled:opacity-50"
                >
                   {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                   <span className="hidden lg:inline">Download Varieties</span>
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
