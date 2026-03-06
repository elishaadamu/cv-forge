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
  Edit3,
  Check
} from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { message, Popconfirm, DatePicker, ConfigProvider, theme } from "antd"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { MousePointerClick, PanelRight } from "lucide-react"


dayjs.extend(customParseFormat)

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
    nationality: "",
    gender: "",
    dateOfBirth: "",
    placeOfBirth: "",
    passport: "",
    workPermit: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  volunteering: []
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
  const [openVolCountryId, setOpenVolCountryId] = useState<string | null>(null)
  const [openVolStateId, setOpenVolStateId] = useState<string | null>(null)
  const [openExpCountryId, setOpenExpCountryId] = useState<string | null>(null)
  const [openExpStateId, setOpenExpStateId] = useState<string | null>(null)
  const [openEduCountryId, setOpenEduCountryId] = useState<string | null>(null)
  const [openEduStateId, setOpenEduStateId] = useState<string | null>(null)
  const countries = countriesData
  const [isSaving, setIsSaving] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
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
  const [isInitialLoading, setIsInitialLoading] = useState(!!cvIdParam)
  const [lastSavedData, setLastSavedData] = useState(JSON.stringify({ data: INITIAL_DATA, templateId: "modern" }))
  // Track the ID of the CV being edited so saves always update the same record
  const [currentCvId, setCurrentCvId] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const templateDropdownRef = useRef<HTMLDivElement>(null)
  const phoneDropdownRef = useRef<HTMLDivElement>(null)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const stateDropdownRef = useRef<HTMLDivElement>(null)
  const skillsDropdownRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const uploadWidgetRef = useRef<any>(null)

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
    // If we have an ID in the URL, fetch it
    if (cvIdParam && session?.user?.id && cvIdParam !== currentCvId) {
      const loadCV = async () => {
        setIsInitialLoading(true)
        try {
          console.log("BUILDER_LOAD: Fetching CV", cvIdParam)
          const res = await getCV(cvIdParam, session.user.id)
          if (res.success && res.data) {
            // Update lastSavedData immediately with the loaded content to prevent an immediate auto-save re-trigger
            const loadedDataStr = JSON.stringify({ data: res.data, templateId: res.data.templateId || currentTemplate })
            setLastSavedData(loadedDataStr)
            
            setCvData(res.data)
            if (res.data.templateId) setCurrentTemplate(res.data.templateId as any)
            setCurrentCvId(cvIdParam)
            console.log("BUILDER_LOAD: Success", cvIdParam)
          } else {
            console.error("BUILDER_LOAD: Failed", res.error)
          }
        } catch (err) {
          console.error("BUILDER_LOAD: Exception", err)
        } finally {
          setIsInitialLoading(false)
        }
      }
      loadCV()
    } else if (!cvIdParam) {
      // If no ID param, we're not loading an existing CV
      setIsInitialLoading(false)
    }
  }, [cvIdParam, session, currentCvId])

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
      const target = event.target as HTMLElement
      // If the click was inside an Ant Design date picker dropdown, do nothing
      if (target.closest('.ant-picker-dropdown')) {
        return
      }

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

  const handleSave = async (shouldRedirect = false) => {
    if (!session?.user?.id) return
    setIsSaving(true)
    // Pass currentCvId so we always update the same record, never create a duplicate
    const res = await saveCV(session.user.id, { ...cvData, templateId: currentTemplate }, currentCvId || undefined)
    if (res.success && res.id) {
      setCurrentCvId(res.id)  // pin the ID for all future saves
      if (shouldRedirect) {
        router.push(`/builder/success?cvId=${res.id}`)
      } else {
        // Stay on the WYSIWYG canvas — silently update the URL
        window.history.replaceState(null, "", `/builder?template=${currentTemplate}&cvId=${res.id}`)
      }
    }
    setIsSaving(false)
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
      experience: [...prev.experience, { id: newId, role: "", company: "", duration: "", location: "", description: [] }]
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
      education: [...prev.education, { id: newId, degree: "", school: "", duration: "", location: "", fieldOfStudy: "", grade: "" }]
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
      else if (section === "skills") {
        setCvData(prev => ({
          ...prev,
          skills: [...prev.skills, { category: value || "New Category", items: [] }]
        }))
      }
      return
    }

    if (path.endsWith(".remove")) {
      const section = keys[0]
      if (section === "experience") removeExperience(value)
      else if (section === "education") removeEducation(value)
      else if (section === "projects") removeProject(value)
      else if (section === "languages") removeLanguage(value)
      else if (section === "volunteering") removeVolunteering(value)
      else if (section === "skills") {
        setCvData(prev => ({
          ...prev,
          skills: prev.skills.filter((_, i) => i !== value)
        }))
      }
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
      const items = Array.isArray(value) ? value.flatMap((v: any) => (typeof v === 'object' && v !== null && 'items' in v) ? (v.items || []) : [v]) : []
      setCvData(prev => ({ ...prev, skills: [{ category: "Skills", items: items }] }))
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
    // Check if both data and template are unchanged
    const currentDataStr = JSON.stringify({ data: cvData, templateId: currentTemplate })
    if (currentDataStr === lastSavedData) return

    const timer = setTimeout(async () => {
      // Prevent starting a new save if manual save or auto-save is already in flight,
      // or if we are still doing the initial load of an existing CV.
      if (session?.user?.id && !isSaving && !isAutoSaving && !refiningId && !isInitialLoading) {
        setIsAutoSaving(true)
        try {
          // Always pass currentCvId so we update the existing record, not create a new one
          const res = await saveCV(session.user.id, { ...cvData, templateId: currentTemplate }, currentCvId || undefined)
          if (res.success && res.id) {
            setLastSavedData(currentDataStr)
            setCurrentCvId(res.id)
            // Silently update the URL to reflect the saved CV id
            const currentParams = new URLSearchParams(window.location.search)
            if (currentParams.get("cvId") !== res.id || currentParams.get("template") !== currentTemplate) {
              window.history.replaceState(null, "", `/builder?template=${currentTemplate}&cvId=${res.id}`)
            }
          }
        } catch (error) {
          console.error("Auto-save failed:", error)
        } finally {
          setIsAutoSaving(false)
        }
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [cvData, session, currentTemplate, lastSavedData, currentCvId, isSaving, isAutoSaving, refiningId])

  const handleDownloadVarieties = async () => {
    if (!cvData) {
      message.error("No CV data found")
      return
    }

    setIsSaving(true)
    try {
      // First save the CV to ensure the success page has the latest data
      const res = await saveCV(session?.user?.id || "guest", { ...cvData, templateId: currentTemplate }, currentCvId || undefined)
      
      if (res.success && res.id) {
        // Redirect to the dedicated success/download page
        router.push(`/builder/success?cvId=${res.id}`)
      } else {
        throw new Error("Failed to save CV before redirecting")
      }
    } catch (error) {
      console.error("Navigation error:", error)
      message.error("Failed to prepare your downloads. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const renderTemplate = () => {
    const templateProps = {
      data: cvData,
      isEditable: isInlineEdit && !isPreview,
      onUpdate: handleUpdate,
      onRefine: handleRefine,
      refiningId,
      onImageClick: () => uploadWidgetRef.current?.open()
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
      
      <main className="flex-1 w-full bg-[#070707] relative pt-20">
        <div className="flex flex-col relative z-10">
          
          {/* Top Selection & Status Toolbar - Not fixed, will scroll away */}
          {!isPreview && (
            <div className="min-h-20 shrink-0 border-b border-white/5 flex flex-wrap items-center justify-between px-4 sm:px-8 py-4 sm:py-0 bg-black/40 backdrop-blur-3xl z-40 gap-4">
              <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-start gap-4">
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
                </div>
              </div>

              <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-4">
                 <button
                  onClick={() => setIsAuditOpen(true)}
                  className="flex items-center space-x-2 px-5 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/5 hover:bg-brand-action/10 hover:border-brand-action/30 border border-white/10 text-brand-action transition-all active:scale-95 group"
                >
                   <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                   <span className="hidden lg:inline">ATS Compliance</span>
                </button>
                
                <button
  onClick={() => setIsInlineEdit(!isInlineEdit)}
  className={`flex items-center space-x-2 px-5 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
    isInlineEdit
      ? "bg-brand-action text-white border-brand-action"
      : "bg-white/5 hover:bg-white/10 border-border-custom text-foreground/70"
  }`}
  title={
    isInlineEdit
      ? "Using Inline Edit - Click directly on CV to edit"
      : "Using Sidebar Editor"
  }
>
  {isInlineEdit ? (
    <>
      <MousePointerClick size={16} className="text-white" />
    </>
  ) : (
    <>
      <PanelRight size={16} className="text-foreground/70" />
    </>
  )}
</button>

                 <button 
                  onClick={handleDownloadVarieties}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-5 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-brand-action text-white shadow-lg shadow-brand-action/20 border border-brand-action/30 transition-all active:scale-95 group disabled:opacity-50"
                >
                   {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                   <span className="hidden lg:inline">Download Varieties</span>
                </button>

                <button 
                  onClick={() => setIsPreview(!isPreview)}
                  className={`flex items-center space-x-2 px-6 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 bg-brand-action text-white shadow-xl shadow-brand-action/20`}
                >
                   <Eye size={16} />
                   <span>Review & Export</span>
                </button>
              </div>
            </div>
          )}

          {/* Preview Overlay Header - Only show when in preview mode */}
          {isPreview && (
            <div className="min-h-20 shrink-0 border-b border-white/5 flex flex-wrap items-center justify-between px-4 sm:px-8 py-4 sm:py-0 bg-[#0c0c0c] z-50 gap-4">
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
                <button 
                  onClick={() => setIsPreview(false)}
                  className="flex items-center space-x-2 px-6 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all active:scale-95"
                >
                   <ArrowUpRight size={16} className="rotate-180" />
                   <span>Close Preview</span>
                </button>
                <div className="hidden sm:block h-6 w-px bg-white/10" />
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-white/40">
                  Previewing: <span className="text-brand-action">{currentTemplate}</span>
                </span>
              </div>
              
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
                <button 
                  onClick={handleDownloadVarieties}
                  className="flex items-center space-x-2 px-8 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-brand-action text-white shadow-xl shadow-brand-action/30 transition-all active:scale-95"
                >
                   <Download size={16} />
                   <span>Download Varieties</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Workspace (CV Canvas) */}
          <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden min-h-[600px] lg:min-h-0 lg:h-full">
            {/* Sidebar Editor - Hidden when Inline Edit is active or in Preview mode */}
            {!isPreview && !isInlineEdit && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-[480px] shrink-0 flex h-auto lg:h-[calc(100vh-80px)] lg:overflow-hidden bg-[#0a0a0a] border-r border-white/5"
              >
                {/* 1. Sidebar Rail (Section Navigator) - Sticky on all devices */}
                <div className="w-[72px] shrink-0 border-r border-white/5 flex flex-col items-center py-6 gap-3 overflow-y-auto custom-scrollbar bg-black/40 sticky top-20 lg:top-0 self-start lg:h-full z-30">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      title={section.title}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2 shrink-0 ${
                        activeSection === section.id
                          ? "bg-brand-action text-white border-brand-action shadow-lg shadow-brand-action/20 scale-105"
                          : "bg-white/5 border-transparent text-foreground/40 hover:bg-white/10"
                      }`}
                    >
                      <section.icon size={20} />
                    </button>
                  ))}
                </div>

                {/* 2. Editor Body (Form Content) - Independent scroll on desktop */}
                <div className="flex-1 flex flex-col lg:overflow-y-auto custom-scrollbar p-6 min-w-0 lg:h-full">
                  <header className="space-y-2 mb-8">
                    <div className="flex items-center space-x-2 text-brand-action font-black uppercase tracking-widest text-[10px]">
                      <Wand2 size={14} />
                      <span>{sections.find(s => s.id === activeSection)?.title} Editor</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight leading-tight">
                      Edit <span className="text-brand-action">{sections.find(s => s.id === activeSection)?.title}</span>
                    </h1>
                  </header>

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
                              name="fullName"
                              autoComplete="name"
                              value={cvData.personalInfo.fullName}
                              onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                              className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Title</label>
                            <input 
                              name="jobTitle"
                              autoComplete="organization-title"
                              value={cvData.personalInfo.jobTitle}
                              onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
                              placeholder="e.g. Designer"
                              className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Email</label>
                            <input 
                              type="email"
                              name="email"
                              autoComplete="email"
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
                                  name="phone"
                                  autoComplete="tel"
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
                               name="postalCode"
                               autoComplete="postal-code"
                               value={cvData.personalInfo.location || ""}
                               onChange={(e) => updatePersonalInfo("location", e.target.value)}
                               placeholder="Postal code (e.g. 10123)"
                               className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                             />
                           </div>
                           <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Portfolio Website</label>
                             <input 
                               name="url"
                               autoComplete="url"
                               value={cvData.personalInfo.website || ""}
                               onChange={(e) => updatePersonalInfo("website", e.target.value)}
                               placeholder="portfolio.com"
                               className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                             />
                           </div>
                           <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">GitHub URL</label>
                             <input 
                               value={cvData.personalInfo.github || ""}
                               onChange={(e) => updatePersonalInfo("github", e.target.value)}
                               placeholder="github.com/username"
                               className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                             />
                           </div>
                           <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Facebook URL</label>
                             <input 
                               value={cvData.personalInfo.facebook || ""}
                               onChange={(e) => updatePersonalInfo("facebook", e.target.value)}
                               placeholder="facebook.com/username"
                               className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                             />
                           </div>
                           <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">LinkedIn URL</label>
                             <input 
                               value={cvData.personalInfo.linkedin || ""}
                               onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                               placeholder="linkedin.com/in/username"
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
                                   name="bday"
                                   autoComplete="bday"
                                   value={cvData.personalInfo.dateOfBirth || ""}
                                   onChange={(e) => updatePersonalInfo("dateOfBirth", e.target.value)}
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Place of Birth</label>
                                 <input 
                                   name="address-level2"
                                   autoComplete="address-level2"
                                   value={cvData.personalInfo.placeOfBirth || ""}
                                   onChange={(e) => updatePersonalInfo("placeOfBirth", e.target.value)}
                                   placeholder="e.g. Lagos, Nigeria"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Nationality</label>
                                 <input 
                                   name="country-name"
                                   autoComplete="country-name"
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
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Duration</label>
                                 <input 
                                   value={exp.duration}
                                   onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                                   placeholder="e.g. Jan 2020 - Present"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>

                               <div className="space-y-1.5 col-span-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Location / Zip</label>
                                   <input 
                                     value={exp.location || ""}
                                     onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                                     placeholder="City, Country"
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
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Duration</label>
                                 <input 
                                   value={edu.duration}
                                   onChange={(e) => updateEducation(edu.id, "duration", e.target.value)}
                                   placeholder="e.g. 2018 - 2022"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>

                               <div className="space-y-1.5 col-span-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Location / Zip</label>
                                   <input 
                                     value={edu.location || ""}
                                     onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                                     placeholder="City, Country"
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
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-black">Skills</h3>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addSkill(skillInput)
                                setSkillInput('')
                              }
                            }}
                            className="flex-1 px-4 py-3 bg-white/5 border border-border-custom rounded-xl text-foreground/90 placeholder-foreground/30 focus:outline-none focus:border-brand-action/50 text-sm"
                            placeholder="Add a skill..."
                          />
                          <button
                            onClick={() => { addSkill(skillInput); setSkillInput('') }}
                            className="px-4 py-3 bg-brand-action hover:bg-brand-action/90 rounded-xl text-white transition-all"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cvData.skills.flatMap(g => g.items).map((skill, index) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-border-custom rounded-full text-xs text-foreground/80"
                            >
                              {skill}
                              <button onClick={() => removeSkill(skill)} className="hover:text-brand-action transition-colors">
                                <Plus size={12} className="rotate-45" />
                              </button>
                            </span>
                          ))}
                        </div>
                        {cvData.skills.flatMap(g => g.items).length === 0 && (
                          <p className="text-center text-foreground/30 text-sm py-8">No skills added yet. Add your first skill above.</p>
                        )}
                      </motion.div>
                    )}

                    {activeSection === "projects" && (
                      <motion.div
                        key="projects"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black">Projects</h3>
                          <button
                            onClick={addProject}
                            className="p-2 bg-brand-action/10 hover:bg-brand-action/20 rounded-xl text-brand-action transition-all"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        {cvData.projects.map((proj) => (
                          <div key={proj.id} className="p-4 bg-white/5 border border-border-custom rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Project</span>
                              <button onClick={() => removeProject(proj.id)} className="text-foreground/30 hover:text-red-400 transition-colors">
                                <Plus size={16} className="rotate-45" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={proj.name}
                              onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-border-custom rounded-xl text-foreground/90 placeholder-foreground/30 focus:outline-none focus:border-brand-action/50 text-sm"
                              placeholder="Project Name"
                            />
                            <textarea
                              value={proj.description}
                              onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-border-custom rounded-xl text-foreground/90 placeholder-foreground/30 focus:outline-none focus:border-brand-action/50 text-sm resize-none"
                              rows={3}
                              placeholder="Project description..."
                            />
                            <input
                              type="text"
                              value={proj.link}
                              onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-border-custom rounded-xl text-foreground/90 placeholder-foreground/30 focus:outline-none focus:border-brand-action/50 text-sm"
                              placeholder="Project Link (optional)"
                            />
                          </div>
                        ))}
                        {cvData.projects.length === 0 && (
                          <p className="text-center text-foreground/30 text-sm py-8">No projects added yet. Click + to add.</p>
                        )}
                      </motion.div>
                    )}

                    {activeSection === "languages" && (
                      <motion.div
                        key="languages"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black">Languages</h3>
                          <button
                            onClick={addLanguage}
                            className="p-2 bg-brand-action/10 hover:bg-brand-action/20 rounded-xl text-brand-action transition-all"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        {cvData.languages?.map((lang, index) => (
                          <div key={index} className="p-4 bg-white/5 border border-border-custom rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Language</span>
                              <button onClick={() => removeLanguage(index)} className="text-foreground/30 hover:text-red-400 transition-colors">
                                <Plus size={16} className="rotate-45" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={lang.name}
                              onChange={(e) => updateLanguage(index, "name", e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-border-custom rounded-xl text-foreground/90 placeholder-foreground/30 focus:outline-none focus:border-brand-action/50 text-sm"
                              placeholder="Language"
                            />
                            <select
                              value={lang.proficiency}
                              onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-border-custom rounded-xl text-foreground/90 focus:outline-none focus:border-brand-action/50 text-sm"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Fluent">Fluent</option>
                              <option value="Native">Native</option>
                            </select>
                          </div>
                        ))}
                        {(!cvData.languages || cvData.languages.length === 0) && (
                          <p className="text-center text-foreground/30 text-sm py-8">No languages added yet. Click + to add.</p>
                        )}
                      </motion.div>
                    )}

                    {activeSection === "volunteering" && (
                      <motion.div
                        key="volunteering"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black">Volunteering</h3>
                          <button
                            onClick={addVolunteering}
                            className="p-2 bg-brand-action/10 hover:bg-brand-action/20 rounded-xl text-brand-action transition-all"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        {cvData.volunteering?.map((vol) => (
                          <div key={vol.id} className="p-4 bg-white/5 border border-border-custom rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Volunteering</span>
                              <button onClick={() => removeVolunteering(vol.id)} className="text-foreground/30 hover:text-red-400 transition-colors">
                                <Plus size={16} className="rotate-45" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={vol.role}
                              onChange={(e) => updateVolunteering(vol.id, "role", e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-border-custom rounded-xl text-foreground/90 placeholder-foreground/30 focus:outline-none focus:border-brand-action/50 text-sm"
                              placeholder="Role"
                            />
                            <input
                              type="text"
                              value={vol.organization}
                              onChange={(e) => updateVolunteering(vol.id, "organization", e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-border-custom rounded-xl text-foreground/90 placeholder-foreground/30 focus:outline-none focus:border-brand-action/50 text-sm"
                              placeholder="Organization"
                            />
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Duration</label>
                              <input
                                value={vol.duration}
                                onChange={(e) => updateVolunteering(vol.id, "duration", e.target.value)}
                                className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold"
                                placeholder="e.g. 2023 - Present"
                              />
                            </div>
                          </div>
                        ))}
                        {(!cvData.volunteering || cvData.volunteering.length === 0) && (
                          <p className="text-center text-foreground/30 text-sm py-8">No volunteering experience added yet. Click + to add.</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.aside>
            )}

            {/* CV Canvas Area - Independent scroll on desktop */}
            <div className={`flex-1 lg:overflow-y-auto custom-scrollbar p-10 sm:p-24 transition-all duration-700 bg-[#050505] relative min-h-0 lg:h-[calc(100vh-80px)] ${isPreview ? "bg-background" : ""} ${!isPreview && !isInlineEdit ? "hidden lg:block" : ""}`}>
              {/* The CV Document */}
              <div
                className={`mx-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isPreview ? "scale-95" : "scale-105 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]"}`}
                style={{ width: "210mm" }}
              >
                <div
                  ref={previewRef}
                  className={`relative bg-white min-h-[297mm] ring-1 ring-black/5 ${isPreview ? 'pointer-events-none shadow-2xl scale-[1.02] transition-transform duration-500 origin-top' : ''}`}
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
        </div>

        {/* ATS Audit Logic */}
        <ATSAuditPanel 
          isOpen={isAuditOpen} 
          onClose={() => setIsAuditOpen(false)} 
          cvData={{...cvData, templateId: currentTemplate}} 
        />

        {/* Hidden Upload Widget for Template Clicks */}
        <CldUploadWidget 
          uploadPreset="cvforge_uploads"
          onSuccess={(result: any) => {
            if (result?.info?.secure_url) {
              updatePersonalInfo("profileImage", result.info.secure_url)
            }
          }}
        >
          {({ open }) => {
            uploadWidgetRef.current = { open }
            return null
          }}
        </CldUploadWidget>
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
