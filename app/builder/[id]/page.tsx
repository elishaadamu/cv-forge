// @ts-nocheck
"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import countriesData from "@/lib/countries-data.json"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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
  Check
} from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { pdf } from '@react-pdf/renderer'
import { CVDocument } from '@/lib/cv-pdf-document'

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
import { message, Popconfirm, DatePicker, ConfigProvider, theme } from "antd"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

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
  const { id } = useParams()
  const searchParams = useSearchParams()
  const templateParam = searchParams.get("template")
  const { data: session } = useSession()
  const [activeSection, setActiveSection] = useState("personal")
  const [isPreview, setIsPreview] = useState(false)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
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
  const [openVolCountryId, setOpenVolCountryId] = useState<string | null>(null)
  const [openVolStateId, setOpenVolStateId] = useState<string | null>(null)
  const [openVolLocationId, setOpenVolLocationId] = useState<string | null>(null)
  const [openExpCountryId, setOpenExpCountryId] = useState<string | null>(null)
  const [openExpStateId, setOpenExpStateId] = useState<string | null>(null)
  const [openEduCountryId, setOpenEduCountryId] = useState<string | null>(null)
  const [openEduStateId, setOpenEduStateId] = useState<string | null>(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isSavingFinish, setIsSavingFinish] = useState(false)
  const [skillInput, setSkillInput] = useState("")
  const [draggedSkillIndex, setDraggedSkillIndex] = useState<number | null>(null)
  const [dragOverSkillIndex, setDragOverSkillIndex] = useState<number | null>(null)
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false)
  const [skillSearch, setSkillSearch] = useState("")
  
  // Predefined skills list
  const predefinedSkills = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Svelte",
    "Node.js", "Express", "Python", "Django", "Flask", "FastAPI",
    "Java", "Spring Boot", "C#", ".NET", "ASP.NET",
    "Go", "Rust", "PHP", "Laravel", "Ruby", "Rails",
    "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "Material UI",
    "GraphQL", "REST API", "gRPC",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "DevOps", "CI/CD",
    "Git", "GitHub", "GitLab", "Bitbucket",
    "Agile", "Scrum", "Kanban", "Project Management",
    "UI/UX Design", "Figma", "Adobe XD", "Sketch",
    "Testing", "Jest", "Cypress", "Playwright", "TDD",
    "Machine Learning", "Data Science", "TensorFlow", "PyTorch",
    "Mobile Development", "React Native", "Flutter", "iOS", "Android",
    "Microservices", "Serverless", "System Design",
    "Communication", "Leadership", "Team Management", "Mentoring"
  ]
  const [pageCount, setPageCount] = useState(1)
  const countries = countriesData
  const previewRef = useRef<HTMLDivElement>(null)
  const templateDropdownRef = useRef<HTMLDivElement>(null)
  const phoneDropdownRef = useRef<HTMLDivElement>(null)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const stateDropdownRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLDivElement>(null)
  const skillsDropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const updatePageCount = () => {
      if (previewRef.current) {
        const height = previewRef.current.offsetHeight
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
    return () => document.body.classList.remove("builder-fullscreen")
  }, [isPreview])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // If the click was inside an Ant Design date picker dropdown, do nothing
      if (target.closest('.ant-picker-dropdown')) {
        return
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
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target as Node)) {
        setIsSkillsDropdownOpen(false)
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

  useEffect(() => {
    if (templateParam) {
      const validTemplates = ["modern", "classic", "executive", "minimal", "creative", "startup", "executive-board", "midnight", "bold-impact", "corporate", "fresh", "refined"]
      if (validTemplates.includes(templateParam)) {
        setCurrentTemplate(templateParam as any)
      }
    }
  }, [templateParam])

  useEffect(() => {
    if (id && id !== "edit-id" && session?.user?.id) {
      const loadCV = async () => {
        const res = await getCV(id as string, session.user.id)
        if (res.success && res.data) {
          setCvData(res.data)
          if (res.data.templateId) setCurrentTemplate(res.data.templateId as any)
        }
      }
      loadCV()
    }
  }, [id, session?.user?.id])

  const handleSave = async (shouldRedirect = false) => {
    if (!session?.user?.id) return

    if (shouldRedirect) {
      setIsSavingFinish(true)
    } else {
      setIsSavingDraft(true)
    }

    try {
      const status = shouldRedirect ? "COMPLETED" : "DRAFT"
      const res = await saveCV(session.user.id, { ...cvData, templateId: currentTemplate, status }, id as string)
      if (res.success && res.id) {
        message.success(shouldRedirect ? "CV Finished!" : "Draft Saved Successfully")
        if (shouldRedirect) {
          router.push(`/builder/${res.id}/success`)
        } else if (!id || id === "edit-id") {
          router.push(`/builder/${res.id}`)
        }
      } else {
        message.error(res.error || "Failed to save CV")
      }
    } catch (error) {
      message.error("An error occurred while saving")
    } finally {
      setIsSavingFinish(false)
      setIsSavingDraft(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!cvData) {
      message.error("No CV data to download")
      return
    }

    setIsSavingFinish(true)
    try {
      // First save the CV
      if (session?.user?.id) {
        await saveCV(session.user.id, { ...cvData, templateId: currentTemplate, status: "DOWNLOADED" }, id as string)
      }

      // Generate PDF using server-side Puppeteer for full CSS support
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData, templateId: currentTemplate }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || "Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${cvData.personalInfo.fullName.replace(/\s+/g, "_") || "CV"}_CV.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      message.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("Download error:", error)
      message.error("Failed to download PDF. Please try again.")
    } finally {
      setIsSavingFinish(false)
    }
  }

  const handleRefine = async (type: "summary" | "experience" | "project" | "volunteering", itemId?: string) => {
    if (type === "summary") {
      if (!cvData.personalInfo.summary || refiningId === "summary") return
      setRefiningId("summary")
      try {
        const res = await refineTextWithAI(cvData.personalInfo.summary, "summary", cvData)
        if (res.success && res.refinedText) {
          updatePersonalInfo("summary", res.refinedText)
        } else if (res.error) {
          message.error(res.error)
        }
      } catch {
        message.error("Failed to refine text. Please try again.")
      } finally {
        setRefiningId(null)
      }
    } else if (type === "experience" && itemId) {
      const exp = cvData.experience.find(e => e.id === itemId)
      if (!exp || refiningId === itemId) return
      
      const textToRefine = exp.workDescription || exp.description.join("\n")
      if (!textToRefine) return

      setRefiningId(itemId)
      try {
        const res = await refineTextWithAI(textToRefine, "experience", cvData)
        if (res.success && res.refinedText) {
          if (exp.workDescription) {
            updateExperience(itemId, "workDescription", res.refinedText)
          } else {
            const bullets = res.refinedText
              .split("\n")
              .map(line => line.replace(/^[-•*\d.]+\s*/, "").trim())
              .filter(line => line.length > 0)
            updateExperience(itemId, "description", bullets)
          }
        } else if (res.error) {
          message.error(res.error)
        }
      } catch {
        message.error("Failed to refine text. Please try again.")
      } finally {
        setRefiningId(null)
      }
    } else if (type === "project" && itemId) {
      const proj = cvData.projects.find(p => p.id === itemId)
      if (!proj || !proj.description || refiningId === itemId) return
      setRefiningId(`project-${itemId}`)
      try {
        const res = await refineTextWithAI(proj.description, "summary", cvData)
        if (res.success && res.refinedText) {
          updateProject(itemId, "description", res.refinedText)
        } else if (res.error) {
          message.error(res.error)
        }
      } catch {
        message.error("Failed to refine text. Please try again.")
      } finally {
        setRefiningId(null)
      }
    } else if (type === "volunteering" && itemId) {
      const vol = cvData.volunteering?.find(v => v.id === itemId)
      if (!vol || !vol.description || refiningId === itemId) return
      setRefiningId(itemId)
      try {
        const res = await refineTextWithAI(vol.description, "experience", cvData)
        if (res.success && res.refinedText) {
          updateVolunteering(itemId, "description", res.refinedText)
        } else if (res.error) {
          message.error(res.error)
        }
      } catch {
        message.error("Failed to refine text. Please try again.")
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
      volunteering: [...(prev.volunteering || []), { id: newId, role: "", organization: "", duration: "", location: "", country: "", county: "", description: "" }]
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

  const renderTemplate = () => {
    const templateProps = {
      data: cvData,
      isEditable: !isPreview,
      onUpdate: (field: string, value: any) => {
        const parts = field.split('.')
        if (parts[0] === 'personalInfo') {
          updatePersonalInfo(parts[1], value)
        } else if (parts[0] === 'experience') {
          updateExperience(parts[1], parts[2] as any, value)
        } else if (parts[0] === 'education') {
          updateEducation(parts[1], parts[2] as any, value)
        } else if (parts[0] === 'projects') {
          updateProject(parts[1], parts[2] as any, value)
        } else if (parts[0] === 'volunteering') {
          updateVolunteering(parts[1], parts[2] as any, value)
        } else if (parts[0] === 'skills') {
          // Flattened skills update if passed from template
          setCvData(prev => ({ ...prev, skills: [{ category: 'Core', items: value }] }))
        }
      },
      onRefine: handleRefine,
      refiningId
    }

    switch (currentTemplate) {
      case "classic":
        return <ClassicTable {...templateProps} />
      case "executive":
        return <ExecutiveTwoColumn {...templateProps} />
      case "minimal":
        return <MinimalATS {...templateProps} />
      case "creative":
        return <CreativePortfolio {...templateProps} />
      case "startup":
        return <StartupTech {...templateProps} />
      case "executive-board":
        return <ExecutiveBoard {...templateProps} />
      case "midnight":
        return <MidnightElegance {...templateProps} />
      case "bold-impact":
        return <BoldImpact {...templateProps} />
      case "corporate":
        return <CorporateClean {...templateProps} />
      case "fresh":
        return <FreshMinimal {...templateProps} />
      case "refined":
        return <RefinedClassic {...templateProps} />
      default:
        return <ModernProfessional {...templateProps} />
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
                   <span>Creation Real-time Editor</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight">
                  Create Your <span className="text-brand-action">CV</span>
                  {id && <span className="text-xs font-black text-foreground/20 ml-2 uppercase tracking-widest">({id})</span>}
                </h1>
              </header>

              <nav className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    title={section.title}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                      activeSection === section.id 
                      ? "bg-brand-action text-white border-brand-action shadow-lg shadow-brand-action/20" 
                      : "bg-white/5 border-transparent text-foreground/40 hover:bg-white/10"
                    }`}
                  >
                     <section.icon size={18} />
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
                                  <div className="overflow-y-auto p-0 overflow-x-hidden">
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
                           <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Professional Summary</label>
                           <button 
                             onClick={() => handleRefine("summary")}
                             disabled={refiningId === "summary" || !cvData.personalInfo.summary}
                             className="flex items-center space-x-1.5 px-4 py-1.5 bg-brand-action/10 hover:bg-brand-action/20 border border-brand-action/30 rounded-xl transition-all active:scale-95 group disabled:opacity-50"
                           >
                              {refiningId === "summary" ? <Loader2 size={12} className="animate-spin text-brand-action" /> : <Sparkles size={12} className="text-brand-action group-hover:scale-110 transition-transform" />}
                              <span className="text-[10px] font-black uppercase tracking-widest text-brand-action">Refine Bio</span>
                           </button>
                         </div>
                        <textarea 
                          value={cvData.personalInfo.summary}
                          onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                          placeholder="Briefly describe your professional journey..."
                          className="w-full h-32 p-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-medium resize-none placeholder:text-foreground/10" 
                        />

                         {/* Additional Personal Details */}
                         <div className="pt-4 border-t border-border-custom">
                           <h4 className="text-sm font-black mb-4 text-foreground/60">Additional Details <span className="text-[10px] font-medium text-foreground/30">(Optional)</span></h4>
                           <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                               <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Date of Birth</label>
                               <input 
                                 type="date"
                                 value={cvData.personalInfo.dateOfBirth || ""}
                                 onChange={(e) => updatePersonalInfo("dateOfBirth", e.target.value)}
                                 className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                               />
                             </div>
                             <div className="space-y-1.5">
                               <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Place of Birth</label>
                               <input 
                                 value={cvData.personalInfo.placeOfBirth || ""}
                                 onChange={(e) => updatePersonalInfo("placeOfBirth", e.target.value)}
                                 placeholder="e.g. Lagos, Nigeria"
                                 className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                               />
                             </div>
                             <div className="space-y-1.5">
                               <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Nationality</label>
                               <input 
                                 value={cvData.personalInfo.nationality || ""}
                                 onChange={(e) => updatePersonalInfo("nationality", e.target.value)}
                                 placeholder="e.g. Nigerian"
                                 className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                               />
                             </div>
                             <div className="space-y-1.5">
                               <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Gender</label>
                               <select
                                 value={cvData.personalInfo.gender || ""}
                                 onChange={(e) => updatePersonalInfo("gender", e.target.value)}
                                 className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold"
                               >
                                 <option value="">Select</option>
                                 <option value="Male">Male</option>
                                 <option value="Female">Female</option>
                               </select>
                             </div>
                             <div className="space-y-1.5">
                               <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Passport</label>
                               <input 
                                 value={cvData.personalInfo.passport || ""}
                                 onChange={(e) => updatePersonalInfo("passport", e.target.value)}
                                 placeholder="e.g. Available"
                                 className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                               />
                             </div>
                             <div className="space-y-1.5">
                               <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Work Permit</label>
                               <input 
                                 value={cvData.personalInfo.workPermit || ""}
                                 onChange={(e) => updatePersonalInfo("workPermit", e.target.value)}
                                 placeholder="e.g. Nigerian (Nigeria)"
                                 className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                               />
                             </div>
                           </div>
                         </div>
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
                              <Popconfirm
                                title="Remove Experience"
                                description="Are you sure you want to remove this role?"
                                onConfirm={() => removeExperience(exp.id)}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{ danger: true }}
                              >
                                <button 
                                  className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                   <Plus size={18} className="rotate-45" />
                                </button>
                              </Popconfirm>

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
                                 <DurationPicker 
                                  value={exp.duration} 
                                  onChange={(val) => updateExperience(exp.id, "duration", val)} 
                                />
                               <div className="space-y-1.5 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Country</label>
                                <div 
                                  onClick={() => setOpenExpCountryId(openExpCountryId === exp.id ? null : exp.id)}
                                  className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                                >
                                  <span>{exp.country || "Select Country"}</span>
                                  <ChevronDown size={14} className={`transition-transform duration-300 ${openExpCountryId === exp.id ? 'rotate-180' : ''}`} />
                                </div>
                                
                                <AnimatePresence>
                                  {openExpCountryId === exp.id && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute z-100 left-0 right-0 mt-2 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[250px] flex flex-col shadow-brand-action/10"
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
                                            onClick={() => {
                                              updateExperience(exp.id, "country", c.name);
                                              updateExperience(exp.id, "county", "");
                                              setOpenExpCountryId(null);
                                              setCountrySearch("");
                                            }}
                                            className={`flex items-center gap-3 px-4 py-2 hover:bg-brand-action/10 cursor-pointer transition-colors group ${c.name === exp.country ? 'bg-brand-action text-white' : ''}`}
                                          >
                                            <span className={`text-sm font-bold ${c.name === exp.country ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>{c.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div className="space-y-1.5 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">County / State</label>
                                <div 
                                  onClick={() => setOpenExpStateId(openExpStateId === exp.id ? null : exp.id)}
                                  className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                                >
                                  <span>{exp.county || "Select State"}</span>
                                  <ChevronDown size={14} className={`transition-transform duration-300 ${openExpStateId === exp.id ? 'rotate-180' : ''}`} />
                                </div>
                                
                                <AnimatePresence>
                                  {openExpStateId === exp.id && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute z-100 left-0 right-0 mt-2 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[250px] flex flex-col shadow-brand-action/10"
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
                                      <div className="overflow-y-auto p-0 overflow-x-hidden">
                                        {countries
                                          .find(c => c.name === exp.country)
                                          ?.states
                                          .filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()))
                                          .map(s => (
                                          <div 
                                            key={s.code}
                                            onClick={() => {
                                              updateExperience(exp.id, "county", s.name);
                                              setOpenExpStateId(null);
                                              setStateSearch("");
                                            }}
                                            className={`flex items-center gap-3 px-4 py-2 hover:bg-brand-action/10 cursor-pointer transition-colors group ${s.name === exp.county ? 'bg-brand-action text-white' : ''}`}
                                          >
                                            <span className={`text-sm font-bold ${s.name === exp.county ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>{s.name}</span>
                                          </div>
                                        ))}
                                        {(!exp.country || (countries.find(c => c.name === exp.country)?.states.length === 0)) && (
                                          <div className="p-4 text-center text-xs text-muted-foreground italic">
                                            No states available for selected country
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                               <div className="space-y-1.5 col-span-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Location / Zip</label>
                                  <input 
                                    value={exp.location || ""}
                                    onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                                    placeholder="e.g. Lagos, Nigeria"
                                    className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                  />
                                </div>
                               <div className="space-y-1.5 col-span-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Work Description (Paragraph)</label>
                                  <textarea 
                                    value={exp.workDescription || ""}
                                    onChange={(e) => updateExperience(exp.id, "workDescription", e.target.value)}
                                    placeholder="Briefly describe your role and key responsibilities..."
                                    className="w-full h-24 p-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-medium resize-none placeholder:text-foreground/10" 
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Responsibilities (One per line)</label>
                                  <button 
                                    onClick={() => handleRefine("experience", exp.id)}
                                    disabled={refiningId === exp.id || (exp.description.length === 0 && !exp.workDescription)}
                                    className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-brand-action hover:text-brand-action/80 transition-colors disabled:opacity-50"
                                  >
                                     {refiningId === exp.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                     <span>{refiningId === exp.id ? "Refining..." : "Refine with AI"}</span>
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
                            <Popconfirm
                              title="Remove Education"
                              description="Are you sure you want to remove this entry?"
                              onConfirm={() => removeEducation(edu.id)}
                              okText="Yes"
                              cancelText="No"
                              okButtonProps={{ danger: true }}
                            >
                              <button 
                                className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                 <Plus size={18} className="rotate-45" />
                              </button>
                            </Popconfirm>
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
                                <DurationPicker 
                                  value={edu.duration} 
                                  onChange={(val) => updateEducation(edu.id, "duration", val)} 
                                />
                               <div className="space-y-1.5 relative">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Country</label>
                                 <div 
                                   onClick={() => setOpenEduCountryId(openEduCountryId === edu.id ? null : edu.id)}
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                                 >
                                   <span>{edu.country || "Select Country"}</span>
                                   <ChevronDown size={14} className={`transition-transform duration-300 ${openEduCountryId === edu.id ? 'rotate-180' : ''}`} />
                                 </div>
                                 
                                 <AnimatePresence>
                                   {openEduCountryId === edu.id && (
                                     <motion.div 
                                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                       animate={{ opacity: 1, y: 0, scale: 1 }}
                                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                       className="absolute z-100 left-0 right-0 mt-2 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[250px] flex flex-col shadow-brand-action/10"
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
                                             onClick={() => {
                                               updateEducation(edu.id, "country", c.name);
                                               updateEducation(edu.id, "county", "");
                                               setOpenEduCountryId(null);
                                               setCountrySearch("");
                                             }}
                                             className={`flex items-center gap-3 px-4 py-2 hover:bg-brand-action/10 cursor-pointer transition-colors group ${c.name === edu.country ? 'bg-brand-action text-white' : ''}`}
                                           >
                                             <span className={`text-sm font-bold ${c.name === edu.country ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>{c.name}</span>
                                           </div>
                                         ))}
                                       </div>
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                               </div>

                               <div className="space-y-1.5 relative">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">County / State</label>
                                 <div 
                                   onClick={() => setOpenEduStateId(openEduStateId === edu.id ? null : edu.id)}
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                                 >
                                   <span>{edu.county || "Select State"}</span>
                                   <ChevronDown size={14} className={`transition-transform duration-300 ${openEduStateId === edu.id ? 'rotate-180' : ''}`} />
                                 </div>
                                 
                                 <AnimatePresence>
                                   {openEduStateId === edu.id && (
                                     <motion.div 
                                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                       animate={{ opacity: 1, y: 0, scale: 1 }}
                                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                       className="absolute z-100 left-0 right-0 mt-2 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[250px] flex flex-col shadow-brand-action/10"
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
                                       <div className="overflow-y-auto p-0 overflow-x-hidden">
                                         {countries
                                           .find(c => c.name === edu.country)
                                           ?.states
                                           .filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()))
                                           .map(s => (
                                           <div 
                                             key={s.code}
                                             onClick={() => {
                                               updateEducation(edu.id, "county", s.name);
                                               setOpenEduStateId(null);
                                               setStateSearch("");
                                             }}
                                             className={`flex items-center gap-3 px-4 py-2 hover:bg-brand-action/10 cursor-pointer transition-colors group ${s.name === edu.county ? 'bg-brand-action text-white' : ''}`}
                                           >
                                             <span className={`text-sm font-bold ${s.name === edu.county ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>{s.name}</span>
                                           </div>
                                         ))}
                                         {(!edu.country || (countries.find(c => c.name === edu.country)?.states.length === 0)) && (
                                           <div className="p-4 text-center text-xs text-muted-foreground italic">
                                             No states available for selected country
                                           </div>
                                         )}
                                       </div>
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                               </div>

                               <div className="space-y-1.5 col-span-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Location / Zip</label>
                                 <input 
                                   value={edu.location || ""}
                                   onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                                   placeholder="e.g. Maiduguri, Nigeria"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Field of Study</label>
                                 <input 
                                   value={edu.fieldOfStudy || ""}
                                   onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                                   placeholder="e.g. Electrical Engineering"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Final Grade</label>
                                 <input 
                                   value={edu.grade || ""}
                                   onChange={(e) => updateEducation(edu.id, "grade", e.target.value)}
                                   placeholder="e.g. Second Class Upper"
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

                      {/* Searchable Skills Dropdown */}
                      <div className="space-y-1.5 relative" ref={skillsDropdownRef}>
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Add a Skill</label>
                        <div
                          onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
                          className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                        >
                          <span className="text-foreground/60">{skillInput || "Select or type a skill..."}</span>
                          <ChevronDown size={14} className={`transition-transform duration-300 ${isSkillsDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                          {isSkillsDropdownOpen && (
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
                                  placeholder="Search skills..."
                                  value={skillSearch}
                                  className="w-full bg-transparent outline-none text-sm font-bold h-8"
                                  onChange={(e) => setSkillSearch(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="overflow-y-auto p-0 overflow-x-hidden custom-scrollbar">
                                {predefinedSkills
                                  .filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()))
                                  .map((skill) => {
                                    const alreadyAdded = cvData.skills.flatMap(g => g.items).includes(skill)
                                    return (
                                      <div
                                        key={skill}
                                        onClick={() => {
                                          if (!alreadyAdded) {
                                            addSkill(skill)
                                          }
                                          setSkillSearch("")
                                          setIsSkillsDropdownOpen(false)
                                        }}
                                        className={`flex items-center gap-3 px-4 py-2.5 hover:bg-brand-action/10 cursor-pointer transition-colors group ${
                                          alreadyAdded ? 'opacity-40 cursor-not-allowed' : ''
                                        }`}
                                      >
                                        {alreadyAdded && (
                                          <Check size={14} className="text-brand-success" />
                                        )}
                                        <span className={`text-sm font-bold ${
                                          alreadyAdded ? 'text-foreground/40 line-through' : 'text-foreground/80 group-hover:text-foreground'
                                        }`}>
                                          {skill}
                                        </span>
                                      </div>
                                    )
                                  })}
                                {predefinedSkills.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).length === 0 && (
                                  <div className="px-4 py-8 text-center">
                                    <p className="text-sm text-foreground/40">No skills found</p>
                                    <button
                                      onClick={() => {
                                        if (skillSearch.trim()) {
                                          addSkill(skillSearch)
                                          setSkillSearch("")
                                          setIsSkillsDropdownOpen(false)
                                        }
                                      }}
                                      className="mt-2 text-xs text-brand-action hover:text-brand-action/80 font-bold"
                                    >
                                      Add "{skillSearch}" as custom skill
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex flex-wrap gap-2 min-h-[44px] p-4 bg-white/5 border border-border-custom rounded-2xl">
                        {cvData.skills.flatMap(group => group.items).length === 0 && (
                          <span className="text-xs text-foreground/20 italic">No skills added yet. Select from the dropdown above.</span>
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
                              className="ml-0.5 text-brand-action/50 hover:text-red-500 transition-colors"
                            >
                              <Plus size={12} className="rotate-45" />
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
                            <Popconfirm
                              title="Remove Project"
                              description="Are you sure you want to remove this project?"
                              onConfirm={() => removeProject(project.id)}
                              okText="Yes"
                              cancelText="No"
                              okButtonProps={{ danger: true }}
                            >
                              <button 
                                className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                 <Plus size={18} className="rotate-45" />
                              </button>
                            </Popconfirm>
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
                               <DurationPicker 
                                  value={project.duration || ""} 
                                  onChange={(val) => updateProject(project.id, "duration", val)} 
                                />
                               <div className="space-y-1.5 col-span-2">
                                 <div className="flex items-center justify-between">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Description</label>
                                   <button 
                                     onClick={() => handleRefine("project", project.id)}
                                     disabled={refiningId === `project-${project.id}` || !project.description}
                                     className="flex items-center space-x-1.5 px-4 py-1.5 bg-brand-action/10 hover:bg-brand-action/20 border border-brand-action/30 rounded-xl transition-all active:scale-95 group disabled:opacity-50"
                                   >
                                      {refiningId === `project-${project.id}` ? <Loader2 size={12} className="animate-spin text-brand-action" /> : <Sparkles size={12} className="text-brand-action group-hover:scale-110 transition-transform" />}
                                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-action">Refine Project</span>
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

                  {activeSection === "languages" && (
                    <motion.div
                      key="languages"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-xl font-black">Languages</h3>
                         <button 
                            onClick={addLanguage}
                            className="flex items-center space-x-2 px-4 py-2 bg-brand-action text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-brand-action/20 transition-all active:scale-95"
                         >
                            <Plus size={14} />
                            <span>Add Language</span>
                         </button>
                      </div>
                      <div className="space-y-4">
                        {(cvData.languages || []).length === 0 && (
                          <div className="p-8 bg-white/5 border border-dashed border-border-custom rounded-3xl text-center">
                            <Languages size={32} className="mx-auto text-foreground/20 mb-3" />
                            <p className="text-sm text-foreground/40 font-medium">No languages added yet.</p>
                          </div>
                        )}
                        {(cvData.languages || []).map((lang, idx) => (
                          <div key={idx} className="p-5 bg-white/5 border border-border-custom rounded-2xl relative group">
                            <button 
                              onClick={() => removeLanguage(idx)}
                              className="absolute top-3 right-3 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                               <Plus size={16} className="rotate-45" />
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Language</label>
                                <input 
                                  value={lang.name}
                                  onChange={(e) => updateLanguage(idx, "name", e.target.value)}
                                  placeholder="e.g. English"
                                  className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Proficiency</label>
                                <select
                                  value={lang.proficiency}
                                  onChange={(e) => updateLanguage(idx, "proficiency", e.target.value)}
                                  className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold"
                                >
                                  <option value="Beginner">Beginner</option>
                                  <option value="Elementary">Elementary</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Upper Intermediate">Upper Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="Proficient">Proficient</option>
                                  <option value="Native">Native</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "volunteering" && (
                    <motion.div
                      key="volunteering"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-xl font-black">Volunteering</h3>
                         <button 
                            onClick={addVolunteering}
                            className="flex items-center space-x-2 px-4 py-2 bg-brand-action text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-brand-action/20 transition-all active:scale-95"
                         >
                            <Plus size={14} />
                            <span>Add Activity</span>
                         </button>
                      </div>
                      <div className="space-y-6">
                        {(cvData.volunteering || []).length === 0 && (
                          <div className="p-8 bg-white/5 border border-dashed border-border-custom rounded-3xl text-center">
                            <Heart size={32} className="mx-auto text-foreground/20 mb-3" />
                            <p className="text-sm text-foreground/40 font-medium">No volunteering activities added yet.</p>
                          </div>
                        )}
                        {(cvData.volunteering || []).map((vol) => (
                          <div key={vol.id} className="p-6 bg-white/5 border border-border-custom rounded-3xl space-y-4 relative group">
                            <button 
                              onClick={() => removeVolunteering(vol.id)}
                              className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                               <Plus size={18} className="rotate-45" />
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Role / Title</label>
                                <input 
                                  value={vol.role}
                                  onChange={(e) => updateVolunteering(vol.id, "role", e.target.value)}
                                  placeholder="e.g. Community Organizer"
                                  className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Organization</label>
                                <input 
                                  value={vol.organization}
                                  onChange={(e) => updateVolunteering(vol.id, "organization", e.target.value)}
                                  placeholder="e.g. Red Cross"
                                  className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                />
                              </div>
                              <DurationPicker 
                                value={vol.duration} 
                                onChange={(val) => updateVolunteering(vol.id, "duration", val)} 
                              />
                              <div className="space-y-1.5 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Country</label>
                                <div 
                                  onClick={() => setOpenVolCountryId(openVolCountryId === vol.id ? null : vol.id)}
                                  className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                                >
                                  <span>{vol.country || "Select Country"}</span>
                                  <ChevronDown size={14} className={`transition-transform duration-300 ${openVolCountryId === vol.id ? 'rotate-180' : ''}`} />
                                </div>
                                
                                <AnimatePresence>
                                  {openVolCountryId === vol.id && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute z-100 left-0 right-0 mt-2 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[250px] flex flex-col shadow-brand-action/10"
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
                                            onClick={() => {
                                              updateVolunteering(vol.id, "country", c.name);
                                              updateVolunteering(vol.id, "county", "");
                                              setOpenVolCountryId(null);
                                              setCountrySearch("");
                                            }}
                                            className={`flex items-center gap-3 px-4 py-2 hover:bg-brand-action/10 cursor-pointer transition-colors group ${c.name === vol.country ? 'bg-brand-action text-white' : ''}`}
                                          >
                                            <span className={`text-sm font-bold ${c.name === vol.country ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>{c.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div className="space-y-1.5 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">County / State</label>
                                <div 
                                  onClick={() => setOpenVolStateId(openVolStateId === vol.id ? null : vol.id)}
                                  className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                                >
                                  <span>{vol.county || "Select State"}</span>
                                  <ChevronDown size={14} className={`transition-transform duration-300 ${openVolStateId === vol.id ? 'rotate-180' : ''}`} />
                                </div>
                                
                                <AnimatePresence>
                                  {openVolStateId === vol.id && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute z-100 left-0 right-0 mt-2 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[250px] flex flex-col shadow-brand-action/10"
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
                                      <div className="overflow-y-auto p-0 overflow-x-hidden">
                                        {countries
                                          .find(c => c.name === vol.country)
                                          ?.states
                                          .filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()))
                                          .map(s => (
                                          <div 
                                            key={s.code}
                                            onClick={() => {
                                              updateVolunteering(vol.id, "county", s.name);
                                              setOpenVolStateId(null);
                                              setStateSearch("");
                                            }}
                                            className={`flex items-center gap-3 px-4 py-2 hover:bg-brand-action/10 cursor-pointer transition-colors group ${s.name === vol.county ? 'bg-brand-action text-white' : ''}`}
                                          >
                                            <span className={`text-sm font-bold ${s.name === vol.county ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>{s.name}</span>
                                          </div>
                                        ))}
                                        {(!vol.country || (countries.find(c => c.name === vol.country)?.states.length === 0)) && (
                                          <div className="p-4 text-center text-xs text-muted-foreground italic">
                                            No states available for selected country
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div className="space-y-1.5 col-span-2 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Location</label>
                                <div 
                                  onClick={() => setOpenVolLocationId(openVolLocationId === vol.id ? null : vol.id)}
                                  className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all text-sm font-bold focus-within:border-brand-action"
                                >
                                  <span>{vol.location || "Select Location"}</span>
                                  <ChevronDown size={14} className={`transition-transform duration-300 ${openVolLocationId === vol.id ? 'rotate-180' : ''}`} />
                                </div>
                                
                                <AnimatePresence>
                                  {openVolLocationId === vol.id && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      className="absolute z-100 left-0 right-0 mt-2 bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[250px] flex flex-col shadow-brand-action/10"
                                    >
                                      <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/5">
                                        <Search size={16} className="text-muted-foreground" />
                                        <input 
                                          autoFocus
                                          placeholder="Search locations..."
                                          value={stateSearch}
                                          className="w-full bg-transparent outline-none text-sm font-bold h-8"
                                          onChange={(e) => setStateSearch(e.target.value)}
                                        />
                                      </div>
                                      <div className="overflow-y-auto p-0 overflow-x-hidden">
                                        {countries
                                          .find(c => c.name === vol.country)
                                          ?.states
                                          .filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()))
                                          .map(s => (
                                          <div 
                                            key={s.code}
                                            onClick={() => {
                                              updateVolunteering(vol.id, "location", s.name);
                                              setOpenVolLocationId(null);
                                              setStateSearch("");
                                            }}
                                            className={`flex items-center gap-3 px-4 py-2 hover:bg-brand-action/10 cursor-pointer transition-colors group ${s.name === vol.location ? 'bg-brand-action text-white' : ''}`}
                                          >
                                            <span className={`text-sm font-bold ${s.name === vol.location ? 'text-white' : 'text-foreground/80 group-hover:text-foreground'}`}>{s.name}</span>
                                          </div>
                                        ))}
                                        {(!vol.country || (countries.find(c => c.name === vol.country)?.states.length === 0)) && (
                                          <div className="p-4 text-center text-xs text-muted-foreground italic">
                                            Select a country first to see available locations
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="space-y-1.5 col-span-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Description</label>
                                  <button 
                                    onClick={() => handleRefine("volunteering", vol.id)}
                                    disabled={refiningId === vol.id || !vol.description}
                                    className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-brand-action hover:text-brand-action/80 transition-colors disabled:opacity-50"
                                  >
                                     {refiningId === vol.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                     <span>{refiningId === vol.id ? "Refining..." : "Refine with AI"}</span>
                                  </button>
                                </div>
                                <textarea 
                                  value={vol.description}
                                  onChange={(e) => updateVolunteering(vol.id, "description", e.target.value)}
                                  placeholder="Describe your volunteer activities..."
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

              <div className="pt-6 border-t border-border-custom">
                 <div className="flex flex-col gap-3">
                    {/* Save as Draft */}
                    <button 
                      onClick={() => handleSave(false)}
                      disabled={isSavingDraft || isSavingFinish}
                      className="group w-full h-14 flex items-center justify-center gap-2.5 bg-white/5 border border-white/15 rounded-2xl font-black text-sm text-foreground/70 hover:text-foreground hover:bg-white/10 hover:border-brand-action/40 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200"
                    >
                        {isSavingDraft 
                          ? <Loader2 size={18} className="animate-spin" />
                          : <Save size={18} className="group-hover:text-brand-action transition-colors duration-200" />
                        }
                        <span>{isSavingDraft ? 'Saving...' : 'Save as Draft'}</span>
                    </button>
                    {/* Save & Finish */}
                    <button 
                      onClick={() => handleSave(true)}
                      disabled={isSavingDraft || isSavingFinish}
                      className="group w-full h-[60px] flex items-center justify-center gap-2.5 bg-brand-action text-white rounded-2xl font-black text-base shadow-lg shadow-brand-action/30 hover:shadow-brand-action/50 hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200"
                    >
                        {isSavingFinish 
                          ? <Loader2 size={20} className="animate-spin" />
                          : <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                        }
                        <span>{isSavingFinish ? 'Finishing...' : 'Finish & Download'}</span>
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
                            src={`/${currentTemplate === 'minimal' ? 'ats' : currentTemplate === 'executive-board' ? 'board' : currentTemplate === 'bold-impact' ? 'bold' : currentTemplate}.png`} 
                            className="w-full h-full object-cover" 
                            onError={(e) => (e.currentTarget.src = "/modern.png")}
                            alt="Current Template" 
                          />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground/80">
                          Template: <span className="text-brand-action ml-1 uppercase">
                            {currentTemplate}
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
                            className="absolute top-full left-0 mt-2 w-[550px] bg-[#0a0a0a] border border-white/15 rounded-[28px] shadow-2xl p-4 z-100"
                          >
                            <div className="grid grid-cols-3 gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
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
                                    setCurrentTemplate(t.id as any)
                                    setIsTemplateDropdownOpen(false)
                                    // Update URL immediately
                                    const params = new URLSearchParams(window.location.search)
                                    params.set("template", t.id)
                                    window.history.replaceState(null, "", `/builder/${id}?${params.toString()}`)
                                  }}
                                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all group ${currentTemplate === t.id ? 'bg-brand-action/15 text-brand-action border border-brand-action/30' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                  <div className={`w-full h-24 rounded-xl overflow-hidden border transition-all ${currentTemplate === t.id ? 'border-brand-action/40' : 'border-white/10 group-hover:border-white/20'} bg-white/5`}>
                                    <img 
                                      src={`/${t.id === 'minimal' ? 'ats' : t.id === 'executive-board' ? 'board' : t.id === 'bold-impact' ? 'bold' : t.id}.png`} 
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                      onError={(e) => (e.currentTarget.src = "/modern.png")}
                                      alt={t.name} 
                                    />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-tight text-center leading-tight">{t.name}</span>
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

                  <div className="flex items-center space-x-3">
                     <button
                        onClick={handleDownloadPDF}
                        disabled={isSavingDraft || isSavingFinish}
                        className="flex items-center space-x-2.5 px-6 h-11 bg-brand-action text-white rounded-2xl transition-all active:scale-95 group shadow-lg shadow-brand-action/20 hover:brightness-110 disabled:opacity-50"
                      >
                         {isSavingFinish
                            ? <Loader2 size={18} className="animate-spin" />
                            : <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                         }
                         <span className="text-[11px] font-black uppercase tracking-widest">Download CV</span>
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

const DurationPicker = ({ value, onChange, label = "Duration" }: { value: string, onChange: (val: string) => void, label?: string }) => {
  const parts = value.split(" - ")
  const startPart = parts[0]?.trim() || ""
  const endPart = parts[1]?.trim() || ""
  
  const isPresent = endPart === "Present" || endPart === "Current"
  
  // Safe parsing helper
  const parseDate = (str: string) => {
    if (!str || str === "Present" || str === "Current") return null
    const d = dayjs(str, "MMM YYYY")
    return d.isValid() ? d : null
  }

  const startDayjs = parseDate(startPart)
  const endDayjs = isPresent ? null : parseDate(endPart)

  const handleStartChange = (date: dayjs.Dayjs | null) => {
    const startStr = date && date.isValid() ? date.format("MMM YYYY") : ""
    const currentEndStr = isPresent ? "Present" : (endDayjs && endDayjs.isValid() ? endDayjs.format("MMM YYYY") : "")
    
    if (!startStr && !currentEndStr) {
      onChange("")
    } else {
      onChange(`${startStr} - ${currentEndStr}`)
    }
  }

  const handleEndChange = (date: dayjs.Dayjs | null) => {
    const startStr = startDayjs && startDayjs.isValid() ? startDayjs.format("MMM YYYY") : ""
    const endStr = date && date.isValid() ? date.format("MMM YYYY") : ""
    
    if (!startStr && !endStr) {
      onChange("")
    } else {
      onChange(`${startStr} - ${endStr}`)
    }
  }

  const togglePresent = () => {
    const startStr = startDayjs && startDayjs.isValid() ? startDayjs.format("MMM YYYY") : ""
    const endStr = isPresent ? "" : "Present"
    
    if (!startStr && !endStr) {
      onChange("")
    } else {
      onChange(`${startStr} - ${endStr}`)
    }
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="space-y-1.5 col-span-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{label}</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-foreground/30">Start Date</span>
            <DatePicker 
              picker="month"
              value={startDayjs}
              onChange={handleStartChange}
              format="MMM YYYY"
              className="w-full h-11 bg-white/5 border-border-custom hover:border-brand-action focus:border-brand-action rounded-xl text-sm font-bold"
              placeholder="Select start"
              allowClear={false}
            />
          </div>
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase text-foreground/30">End Date</span>
            <div className="flex gap-2">
              <DatePicker 
                picker="month"
                value={endDayjs}
                onChange={handleEndChange}
                disabled={isPresent}
                format="MMM YYYY"
                className="flex-1 h-11 bg-white/5 border-border-custom hover:border-brand-action focus:border-brand-action rounded-xl text-sm font-bold disabled:opacity-50"
                placeholder={isPresent ? "Present" : "Select end"}
                allowClear={false}
              />
              <button
                type="button"
                onClick={togglePresent}
                className={`h-11 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  isPresent
                    ? "bg-brand-action text-white"
                    : "bg-white/5 border border-border-custom text-foreground/40 hover:bg-white/10"
                }`}
              >
                Present
              </button>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

const Page = () => {
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

export default Page
