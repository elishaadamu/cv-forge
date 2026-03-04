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
  GripVertical
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
import { refineTextWithAI, saveCV } from "@/lib/actions"

const sections = [
  { id: "personal", title: "Personal Info", icon: User },
  { id: "experience", title: "Experience", icon: Briefcase },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "skills", title: "Skills", icon: Code },
  { id: "projects", title: "Projects", icon: FolderGit2 },
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
  const [skillInput, setSkillInput] = useState("")
  const [draggedSkillIndex, setDraggedSkillIndex] = useState<number | null>(null)
  const [dragOverSkillIndex, setDragOverSkillIndex] = useState<number | null>(null)
  const [pageCount, setPageCount] = useState(1)
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
        return <MidnightElegance data={cvData} />
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
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[calc(100vh-140px)]">
          
          {/* Sidebar Editor */}
          {!isPreview && (
            <motion.aside 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-[450px] flex flex-col gap-6 h-full overflow-y-auto pr-2 scrollbar-hide"
            >
              <header className="space-y-2">
                <div className="flex items-center space-x-2 text-brand-action font-black uppercase tracking-widest text-[10px]">
                   <Wand2 size={14} />
                   <span>cvmyjob Real-time Editor</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight">Build Your <span className="text-brand-action">CV</span></h1>
              </header>

              <nav className="grid grid-cols-5 gap-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    title={section.title}
                    className={`p-4 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                      activeSection === section.id 
                      ? "bg-brand-action text-white border-brand-action shadow-lg shadow-brand-action/20" 
                      : "bg-white/5 border-transparent text-foreground/40 hover:bg-white/10"
                    }`}
                  >
                     <section.icon size={20} />
                  </button>
                ))}
              </nav>

              <div className="flex-1 bg-white/5 border border-border-custom rounded-3xl p-6 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  {activeSection === "personal" && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-black mb-4">Personal Details</h3>
                      
                      {/* Photo Section */}
                      <div className="flex items-center space-x-6 p-6 bg-white/5 border border-border-custom rounded-3xl mb-4">
                        <div className="relative w-24 h-24 rounded-2xl bg-white/5 border-2 border-dashed border-border-custom overflow-hidden group flex items-center justify-center">
                          {cvData.personalInfo.profileImage ? (
                            <img 
                              src={cvData.personalInfo.profileImage} 
                              alt="Profile" 
                              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                            />
                          ) : (
                            <div className="text-foreground/20 group-hover:text-brand-action transition-colors flex flex-col items-center">
                               <Camera size={24} />
                               <span className="text-[10px] font-black mt-1">Photo</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-brand-action/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                              <ImageIcon size={20} className="text-white" />
                          </div>
                        </div>

                        <div className="space-y-3 flex-1">
                          <h4 className="text-sm font-black">Profile Portrait</h4>
                          <p className="text-[11px] text-foreground/40 font-medium leading-relaxed">
                            Upload a professional headshot. Clear, high-resolution photos make a better impression.
                          </p>
                          <CldUploadWidget 
                            uploadPreset="cvforge_uploads"
                            onSuccess={(result: any) => {
                               if (result?.info?.secure_url) {
                                 updatePersonalInfo("profileImage", result.info.secure_url)
                               }
                            }}
                          >
                            {({ open }) => (
                              <button 
                                onClick={() => open()}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                              >
                                {cvData.personalInfo.profileImage ? "Update Photo" : "Upload Image"}
                              </button>
                            )}
                          </CldUploadWidget>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Full Name</label>
                          <input 
                            value={cvData.personalInfo.fullName}
                            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                            className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Title</label>
                          <input 
                            value={cvData.personalInfo.jobTitle}
                            onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
                            placeholder="e.g. Designer"
                            className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Email</label>
                          <input 
                             value={cvData.personalInfo.email}
                             onChange={(e) => updatePersonalInfo("email", e.target.value)}
                             className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                          />
                        </div>
                          <div className="space-y-1.5 overflow-visible">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Phone Number</label>
                            <div className="flex space-x-2 min-w-0">
                              <div className="relative" ref={phoneDropdownRef}>
                                <div 
                                  onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                                  className="w-[90px] shrink-0 h-11 px-2 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus:border-brand-action"
                                >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="truncate">{cvData.personalInfo.phoneCode || "+000"}</span>
                                  </div>
                                  <ChevronDown size={14} className={`shrink-0 transition-transform ${isPhoneDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                <AnimatePresence>
                                  {isPhoneDropdownOpen && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute z-150 left-0 mt-2 w-[220px] bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-brand-action/10"
                                    >
                                      <div className="p-2 border-b border-white/5 flex items-center gap-2 px-3">
                                        <Search size={14} className="text-muted-foreground" />
                                        <input 
                                          autoFocus
                                          placeholder="Search code..."
                                          value={phoneSearch}
                                          onChange={(e) => setPhoneSearch(e.target.value)}
                                          className="w-full bg-transparent border-none outline-none text-[11px] font-bold h-8"
                                        />
                                      </div>
                                      <div className="max-h-[250px] overflow-y-auto overflow-x-hidden p-0">
                                        {countries
                                          .filter(c => 
                                            c.name.toLowerCase().includes(phoneSearch.toLowerCase()) || 
                                            (c.phonecode || "").includes(phoneSearch)
                                          )
                                          .map(c => (
                                          <div 
                                            key={`${c.isoCode}-${c.phonecode}`}
                                            ref={`+${c.phonecode}` === cvData.personalInfo.phoneCode ? activeItemRef : null}
                                            onClick={() => {
                                              updatePersonalInfo("phoneCode", `+${c.phonecode}`);
                                              setIsPhoneDropdownOpen(false);
                                              setPhoneSearch("");
                                            }}
                                            className={`flex items-center gap-2 p-2 px-3 hover:bg-brand-action/10 cursor-pointer transition-colors group ${`+${c.phonecode}` === cvData.personalInfo.phoneCode ? 'bg-brand-action text-white' : ''}`}
                                          >
                                            <span className={`text-[11px] font-bold ${`+${c.phonecode}` === cvData.personalInfo.phoneCode ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>+{c.phonecode}</span>
                                            <span className={`text-[10px] truncate ${`+${c.phonecode}` === cvData.personalInfo.phoneCode ? 'text-white/80' : 'text-muted-foreground group-hover:text-foreground/60'}`}>{c.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <input 
                                type="tel"
                                inputMode="numeric"
                                maxLength={11}
                                value={cvData.personalInfo.phone}
                                onChange={(e) => updatePersonalInfo("phone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                                placeholder="08012345678"
                                className="flex-1 min-w-0 h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5 relative" ref={countryDropdownRef}>
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Country</label>
                            <div 
                              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                              className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                            >
                              <div className="flex items-center gap-2">
                                <span>{cvData.personalInfo.country || "Select Country"}</span>
                              </div>
                              <ChevronDown size={14} className={`transition-transform duration-300 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                            
                            <AnimatePresence>
                              {isCountryDropdownOpen && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  className="absolute z-100 left-0 right-0 mt-2 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[300px] flex flex-col shadow-brand-action/10"
                                >
                                  <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/5">
                                    <Search size={16} className="text-muted-foreground" />
                                    <input 
                                      autoFocus
                                      placeholder="Search countries..."
                                      value={countrySearch}
                                      className="w-full bg-transparent outline-none text-sm font-bold h-8"
                                      onChange={(e) => setCountrySearch(e.target.value)}
                                    />
                                  </div>
                                  <div className="overflow-y-auto p-0 overflow-x-hidden">
                                    {countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map(c => (
                                      <div 
                                        key={c.isoCode}
                                        ref={c.name === cvData.personalInfo.country ? activeItemRef : null}
                                        onClick={() => {
                                          updatePersonalInfo("country", c.name);
                                          // Reset state when country changes
                                          updatePersonalInfo("county", "");
                                          setIsCountryDropdownOpen(false);
                                          setCountrySearch("");
                                        }}
                                        className={`flex items-center gap-3 px-4 py-2 hover:bg-brand-action/10 cursor-pointer transition-colors group ${c.name === cvData.personalInfo.country ? 'bg-brand-action text-white' : ''}`}
                                      >
                                        <span className={`text-sm font-bold ${c.name === cvData.personalInfo.country ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>{c.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="space-y-1.5 relative" ref={stateDropdownRef}>
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">County / State</label>
                            <div 
                              onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                              className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                            >
                              <span>{cvData.personalInfo.county || "Select State"}</span>
                              <ChevronDown size={14} className={`transition-transform duration-300 ${isStateDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                            
                            <AnimatePresence>
                              {isStateDropdownOpen && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  className="absolute z-100 left-0 right-0 mt-2 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[300px] flex flex-col shadow-brand-action/10"
                                >
                                  <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/5">
                                    <Search size={16} className="text-muted-foreground" />
                                    <input 
                                      autoFocus
                                      placeholder="Search states..."
                                      value={stateSearch}
                                      className="w-full bg-transparent outline-none text-sm font-bold h-8"
                                      onChange={(e) => setStateSearch(e.target.value)}
                                    />
                                  </div>
                                  <div className="overflow-y-auto p-1 overflow-x-hidden">
                                    {countries
                                      .find(c => c.name === cvData.personalInfo.country)
                                      ?.states
                                      .filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()))
                                      .map(s => (
                                      <div 
                                        key={s.code}
                                        ref={s.name === cvData.personalInfo.county ? activeItemRef : null}
                                        onClick={() => {
                                          updatePersonalInfo("county", s.name);
                                          setIsStateDropdownOpen(false);
                                          setStateSearch("");
                                        }}
                                        className={`flex items-center gap-3 px-4 py-2 hover:bg-brand-action/10 cursor-pointer transition-colors group ${s.name === cvData.personalInfo.county ? 'bg-brand-action text-white' : ''}`}
                                      >
                                        <span className={`text-sm font-bold ${s.name === cvData.personalInfo.county ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>{s.name}</span>
                                      </div>
                                    ))}
                                    {(!cvData.personalInfo.country || (countries.find(c => c.name === cvData.personalInfo.country)?.states.length === 0)) && (
                                      <div className="p-4 text-center text-xs text-muted-foreground italic">
                                        No states available for selected country
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                         <div className="space-y-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Zip / Postal Code</label>
                           <input 
                             value={cvData.personalInfo.location}
                             onChange={(e) => updatePersonalInfo("location", e.target.value)}
                             placeholder="e.g. 10001"
                             className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                           />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Portfolio Website</label>
                           <input 
                             value={cvData.personalInfo.website}
                             onChange={(e) => updatePersonalInfo("website", e.target.value)}
                             placeholder="URL"
                             className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                           />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">GitHub URL</label>
                           <input 
                             value={cvData.personalInfo.github}
                             onChange={(e) => updatePersonalInfo("github", e.target.value)}
                             placeholder="URL"
                             className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                           />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Facebook URL</label>
                           <input 
                             value={cvData.personalInfo.facebook}
                             onChange={(e) => updatePersonalInfo("facebook", e.target.value)}
                             placeholder="URL"
                             className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                           />
                         </div>
                       </div>
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Summary</label>
                          <button 
                            onClick={() => handleRefine("summary")}
                            disabled={isRefining || !cvData.personalInfo.summary}
                            className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-brand-action hover:text-brand-action/80 transition-colors disabled:opacity-50"
                          >
                             {isRefining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                             <span>Refine with AI</span>
                          </button>
                        </div>
                        <textarea 
                          value={cvData.personalInfo.summary}
                          onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                          placeholder="Briefly describe your professional journey..."
                          className="w-full h-32 p-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-medium resize-none placeholder:text-foreground/10" 
                        />
                    </motion.div>
                  )}
                  {activeSection === "experience" && (
                    <motion.div
                      key="experience"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-xl font-black">Work Experience</h3>
                         <button 
                            onClick={addExperience}
                            className="flex items-center space-x-2 px-4 py-2 bg-brand-action text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-brand-action/20 transition-all active:scale-95"
                         >
                            <Plus size={14} />
                            <span>Add Role</span>
                         </button>
                      </div>

                      <div className="space-y-6">
                         {cvData.experience.map((exp, idx) => (
                           <div key={exp.id} className="p-6 bg-white/5 border border-border-custom rounded-3xl space-y-4 relative group">
                              <button 
                                onClick={() => removeExperience(exp.id)}
                                className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                 <Plus size={18} className="rotate-45" />
                              </button>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Role</label>
                                  <input 
                                    value={exp.role}
                                    onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                                    placeholder="e.g. Lead Developer"
                                    className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Company</label>
                                  <input 
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                    placeholder="e.g. Acme Inc"
                                    className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                  />
                                </div>
                                <div className="space-y-1.5 col-span-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Duration</label>
                                  <input 
                                    value={exp.duration}
                                    onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                                    placeholder="e.g. Jan 2020 - Present"
                                    className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Responsibilities (One per line)</label>
                                  <button 
                                    onClick={() => handleRefine("experience", exp.id)}
                                    disabled={isRefining || exp.description.length === 0}
                                    className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-brand-action hover:text-brand-action/80 transition-colors disabled:opacity-50"
                                  >
                                     {isRefining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                     <span>Refine with AI</span>
                                  </button>
                                </div>
                                <textarea 
                                  value={exp.description.join("\n")}
                                  onChange={(e) => updateExperience(exp.id, "description", e.target.value.split("\n"))}
                                  placeholder="List your key achievements..."
                                  className="w-full h-32 p-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-medium resize-none placeholder:text-foreground/10" 
                                />
                              </div>
                           </div>
                         ))}
                      </div>
                    </motion.div>
                  )}
                  {activeSection === "education" && (
                    <motion.div
                      key="education"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-xl font-black">Education</h3>
                         <button 
                            onClick={addEducation}
                            className="flex items-center space-x-2 px-4 py-2 bg-brand-action text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-brand-action/20 transition-all active:scale-95"
                         >
                            <Plus size={14} />
                            <span>Add Degree</span>
                         </button>
                      </div>
                      <div className="space-y-6">
                        {cvData.education.map((edu) => (
                          <div key={edu.id} className="p-6 bg-white/5 border border-border-custom rounded-3xl space-y-4 relative group">
                            <button 
                              onClick={() => removeEducation(edu.id)}
                              className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                               <Plus size={18} className="rotate-45" />
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Degree</label>
                                 <input 
                                   value={edu.degree}
                                   onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                   placeholder="e.g. B.Sc. Computer Science"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">School</label>
                                 <input 
                                   value={edu.school}
                                   onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                                   placeholder="e.g. Harvard University"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                               <div className="space-y-1.5 col-span-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Duration</label>
                                 <input 
                                   value={edu.duration}
                                   onChange={(e) => updateEducation(edu.id, "duration", e.target.value)}
                                   placeholder="e.g. 2018 - 2022"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "skills" && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-black">Skills & Expertise</h3>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Add a Skill</label>
                        <div className="flex space-x-2">
                          <input 
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addSkill(skillInput)
                                setSkillInput("")
                              }
                            }}
                            placeholder="Type a skill and press Enter"
                            className="flex-1 h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                          />
                          <button 
                            onClick={() => { addSkill(skillInput); setSkillInput("") }}
                            disabled={!skillInput.trim()}
                            className="h-11 px-4 bg-brand-action  text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-brand-action/20 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 min-h-[44px] p-4 bg-white/5 border border-border-custom rounded-2xl">
                        {cvData.skills.flatMap(group => group.items).length === 0 && (
                          <span className="text-xs text-foreground/20 italic">No skills added yet. Type above and press Enter.</span>
                        )}
                        {cvData.skills.flatMap(group => group.items).map((skill, i) => (
                          <span 
                            key={i}
                            draggable
                            onDragStart={(e) => {
                              setDraggedSkillIndex(i);
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = "move";
                              if (draggedSkillIndex !== null && draggedSkillIndex !== i) {
                                setDragOverSkillIndex(i);
                              }
                            }}
                            onDragLeave={() => setDragOverSkillIndex(null)}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (draggedSkillIndex !== null && draggedSkillIndex !== i) {
                                reorderSkill(draggedSkillIndex, i);
                              }
                              setDraggedSkillIndex(null);
                              setDragOverSkillIndex(null);
                            }}
                            onDragEnd={() => {
                              setDraggedSkillIndex(null);
                              setDragOverSkillIndex(null);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-action/10 border text-brand-action rounded-lg text-xs font-bold group hover:bg-brand-action/20 transition-all cursor-move ${draggedSkillIndex === i ? 'opacity-50' : ''} ${dragOverSkillIndex === i ? 'border-brand-action ring-1 ring-brand-action' : 'border-brand-action/20'}`}
                          >
                            <GripVertical size={14} className="opacity-40 cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity" />
                            <span className="dark:text-white/80">{skill}</span>
                            <button 
                              onClick={() => removeSkill(skill)}
                              className="ml-0.5 text-brand-action/50 cursor-pointer hover:text-brand-action transition-colors"
                            >
                              <Plus size={16} className="rotate-45" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "projects" && (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-xl font-black">Key Projects</h3>
                         <button 
                            onClick={addProject}
                            className="flex items-center space-x-2 px-4 py-2 bg-brand-action text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-brand-action/20 transition-all active:scale-95"
                         >
                            <Plus size={14} />
                            <span>Add Project</span>
                         </button>
                      </div>
                      <div className="space-y-6">
                        {cvData.projects.map((project) => (
                          <div key={project.id} className="p-6 bg-white/5 border border-border-custom rounded-3xl space-y-4 relative group">
                            <button 
                              onClick={() => removeProject(project.id)}
                              className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                               <Plus size={18} className="rotate-45" />
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Project Name</label>
                                 <input 
                                   value={project.name}
                                   onChange={(e) => updateProject(project.id, "name", e.target.value)}
                                   placeholder="e.g. E-Commerce Platform"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Repo/Link</label>
                                 <input 
                                   value={project.link} 
                                   onChange={(e) => updateProject(project.id, "link", e.target.value)}
                                   placeholder="e.g. github.com/user/repo"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                               <div className="space-y-1.5 col-span-2">
                                 <div className="flex items-center justify-between">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Description</label>
                                   <button 
                                     onClick={() => handleRefine("project", project.id)}
                                     disabled={isRefining || !project.description}
                                     className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-brand-action hover:text-brand-action/80 transition-colors disabled:opacity-50"
                                   >
                                      {isRefining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                      <span>Refine with AI</span>
                                   </button>
                                 </div>
                                 <textarea 
                                   value={project.description}
                                   onChange={(e) => updateProject(project.id, "description", e.target.value)}
                                   placeholder="What did you build?"
                                   className="w-full h-24 p-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-medium resize-none placeholder:text-foreground/10" 
                                 />
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-4 border-t border-border-custom space-y-3">
                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => handleSave(false)}
                      disabled={isSaving}
                      className="w-full h-12 bg-white/5 border border-border-custom hover:border-brand-action hover:bg-brand-action/5 rounded-2xl font-black text-sm transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>Save as Draft</span>
                    </button>
                    <button 
                      onClick={() => handleSave(true)}
                      disabled={isSaving}
                      className="w-full h-14 bg-brand-action text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-action/20 hover:shadow-brand-action/40 hover:-translate-y-1 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <ArrowUpRight size={20} />}
                        <span>Save & Finish</span>
                    </button>
                 </div>
              </div>
            </motion.aside>
          )}

          {/* Main Preview Area */}
          <motion.div 
             layout
             className={`flex-1 bg-white/5 border border-border-custom rounded-[40px] overflow-hidden flex shadow-2xl relative transition-all duration-500 ${
               isPreview 
               ? "fixed inset-0 z-100 rounded-none m-0 flex-col bg-background" 
               : "flex-col"
             }`}
          >
             {/* Toolbar - Responsive adjustment */}
              <div className={`border-border-custom flex items-center justify-between px-4 sm:px-8 bg-background/80 backdrop-blur-2xl z-40 transition-all duration-300 ${
                isPreview 
                ? "h-20 border-b" 
                : "h-20 border-b"
              }`}>
                  <div className="flex items-center space-x-3 sm:space-x-5">
                    <div 
                      className="relative"
                      ref={templateDropdownRef}
                    >
                      <button 
                        onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                        className="flex items-center space-x-3 px-4 h-11 bg-white/5 hover:bg-white/10 border border-border-custom rounded-2xl transition-all active:scale-95 group"
                      >
                        <div className="w-8 h-5 rounded-md overflow-hidden border border-white/10 hidden xs:block">
                          <img 
                            src={
                              [
                                { id: "modern", img: "/modern.png" },
                                { id: "classic", img: "/classic.png" },
                                { id: "executive", img: "/executive.png" },
                                { id: "minimal", img: "/modern.png" },
                                { id: "creative", img: "/modern.png" },
                                { id: "startup", img: "/modern.png" },
                                { id: "executive-board", img: "/modern.png" },
                                { id: "midnight", img: "/modern.png" },
                                { id: "bold-impact", img: "/modern.png" },
                                { id: "corporate", img: "/modern.png" },
                                { id: "fresh", img: "/modern.png" },
                                { id: "refined", img: "/modern.png" }
                              ].find(t => t.id === currentTemplate)?.img || "/modern.png"
                            } 
                            className="w-full h-full object-cover" 
                            alt="Current Template" 
                          />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground/80">
                          Template: <span className="text-brand-action ml-1">
                            {
                              [
                                { id: "modern", name: "Modern" },
                                { id: "classic", name: "Classic" },
                                { id: "executive", name: "Executive" },
                                { id: "minimal", name: "ATS" },
                                { id: "creative", name: "Creative" },
                                { id: "startup", name: "Startup" },
                                { id: "executive-board", name: "Board" },
                                { id: "midnight", name: "Midnight" },
                                { id: "bold-impact", name: "Bold" },
                                { id: "corporate", name: "Corporate" },
                                { id: "fresh", name: "Fresh" },
                                { id: "refined", name: "Refined" }
                              ].find(t => t.id === currentTemplate)?.name
                            }
                          </span>
                        </span>
                        <ChevronDown size={14} className={`text-foreground/40 transition-transform duration-300 ${isTemplateDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isTemplateDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-[500px] bg-[#0a0a0a] border border-white/15 rounded-[28px] shadow-2xl p-3 z-100"
                          >
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: "modern", name: "Modern Professional", img: "/modern.png" },
                                { id: "classic", name: "Classic Table", img: "/classic.png" },
                                { id: "executive", name: "Executive Two-Column", img: "/executive.png" },
                                { id: "minimal", name: "Minimal ATS", img: "/modern.png" },
                                { id: "creative", name: "Creative Portfolio", img: "/modern.png" },
                                { id: "startup", name: "Startup Tech", img: "/modern.png" },
                                { id: "executive-board", name: "Executive Board", img: "/modern.png" },
                                { id: "midnight", name: "Midnight Elegance", img: "/modern.png" },
                                { id: "bold-impact", name: "Bold Impact", img: "/modern.png" },
                                { id: "corporate", name: "Corporate Clean", img: "/modern.png" },
                                { id: "fresh", name: "Fresh Minimal", img: "/modern.png" },
                                { id: "refined", name: "Refined Classic", img: "/modern.png" }
                              ].map((t) => (
                                <button
                                  key={t.id}
                                  onClick={() => {
                                    setCurrentTemplate(t.id as any)
                                    setIsTemplateDropdownOpen(false)
                                  }}
                                  className={`flex items-center space-x-3 w-full p-2.5 rounded-2xl transition-all group ${currentTemplate === t.id ? 'bg-brand-action/15 text-brand-action border border-brand-action/20' : 'hover:bg-white/5 text-foreground/60 hover:text-foreground'}`}
                                >
                                  <div className={`w-12 h-7 rounded-lg overflow-hidden border transition-all ${currentTemplate === t.id ? 'border-brand-action/40' : 'border-white/10 group-hover:border-white/20'} shrink-0`}>
                                    <img src={t.img} className="w-full h-full object-cover" alt={t.name} />
                                  </div>
                                  <span className="text-[9px] font-black uppercase tracking-tight leading-none text-left">{t.name}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                     <button 
                        onClick={() => setIsAuditOpen(true)}
                        className="flex items-center space-x-2.5 px-6 h-11 bg-brand-action/10 hover:bg-brand-action/20 border border-brand-action/30 rounded-2xl transition-all active:scale-95 group"
                      >
                         <ShieldCheck size={18} className="text-brand-action group-hover:scale-110 transition-transform" />
                         <span className="text-[11px] font-black uppercase tracking-widest text-brand-action">Audit CV</span>
                      </button>

                      <div className="hidden lg:flex items-center space-x-4 border-l border-border-custom ml-2 pl-6">
                      <div className="flex items-center space-x-2.5 bg-brand-success/5 px-3 py-1.5 rounded-full border border-brand-success/10">
                        <div className="w-1.5 h-1.5 bg-brand-success rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-success/80 leading-none">Synced</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{pageCount} A4 {pageCount > 1 ? 'Pages' : 'Page'}</span>
                    </div>
                  </div>

                 <div className="flex items-center space-x-2 sm:space-x-4">
                    <button 
                      onClick={() => setIsAuditOpen(true)}
                      className="flex items-center space-x-2 px-3 sm:px-4 h-9 sm:h-11 rounded-xl font-bold text-xs sm:text-sm bg-white/5 hover:bg-white/10 text-brand-action transition-all active:scale-95"
                      title="ATS Audit"
                    >
                       <ShieldCheck size={18} />
                       <span className="hidden lg:inline">Audit</span>
                    </button>
                    <button 
                      onClick={() => setIsPreview(!isPreview)}
                      className={`flex items-center space-x-2 px-3 sm:px-6 h-9 sm:h-11 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 ${isPreview ? "bg-white text-black shadow-lg" : "bg-white/5 hover:bg-white/10"}`}
                    >
                       <Eye size={16} />
                       <span className="hidden xs:inline">{isPreview ? "Exit" : "Preview"}</span>
                    </button>
                 </div>
             </div>

              {/* Preview Container - Responsive scaling */}
             <div className={`flex-1 w-full overflow-auto bg-[#050505] custom-scrollbar relative z-10 flex justify-center py-10 px-4 ${isPreview ? "pb-24" : ""}`}>
                <div 
                  className={`origin-top transition-transform duration-500 scale-[0.4] xs:scale-[0.5] sm:scale-75 md:scale-[0.85] lg:scale-[0.75] xl:scale-95 ${isPreview ? "scale-[0.4] xs:scale-[0.55] sm:scale-100 mt-4 mb-20 shadow-2xl" : "scale-90"}`}
                  style={{ width: "210mm" }}
                >
                   <div ref={previewRef} className="relative bg-white shadow-2xl">
                     {renderTemplate()}
                     
                     {/* Page Jump Overlay (Visual only) */}
                     {Array.from({ length: pageCount }).map((_, i) => (
                       <div 
                         key={i}
                         className="absolute right-[-60px] flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-foreground/40"
                         style={{ top: `${i * 297}mm` }}
                       >
                         {i + 1}
                       </div>
                     ))}
                   </div>
                </div>
             </div>

             {/* Background Decoration */}
             <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
                <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-brand-action rounded-full blur-[160px]" />
                <div className="absolute bottom-1/4 -left-20 w-[600px] h-[600px] bg-white rounded-full blur-[160px]" />
             </div>
          </motion.div>

        </div>
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
