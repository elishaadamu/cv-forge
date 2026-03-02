"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
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
  ShieldCheck
} from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"

import { ModernProfessional, CVData } from "@/components/templates/ModernProfessional"
import { ClassicTable } from "@/components/templates/ClassicTable"
import { ExecutiveTwoColumn } from "@/components/templates/ExecutiveTwoColumn"
import { ATSAuditPanel } from "@/components/ATSAuditPanel"
import { refineTextWithAI, saveCV } from "@/lib/actions"
import { useRouter } from "next/navigation"

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
    phone: "+353 87 123 4567",
    location: "Dublin, Ireland",
    website: "alexsterling.design",
    linkedin: "linkedin.com/in/alexsterling",
    github: "github.com/asterling",
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

export default function BuilderPage() {
  const { data: session } = useSession()
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
  const [currentTemplate, setCurrentTemplate] = useState<"modern" | "classic" | "executive">("modern")
  const [isRefining, setIsRefining] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isPreview) {
      document.body.classList.add("builder-fullscreen")
    } else {
      document.body.classList.remove("builder-fullscreen")
    }
    return () => document.body.classList.remove("builder-fullscreen") // Cleanup on unmount
  }, [isPreview])

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

  const updateSkill = (index: number, field: "category" | "items", value: any) => {
    setCvData(prev => {
      const newSkills = [...prev.skills]
      if (field === "items" && typeof value === "string") {
        newSkills[index] = { ...newSkills[index], items: value.split(",").map(i => i.trim()).filter(i => i) }
      } else {
        newSkills[index] = { ...newSkills[index], [field]: value }
      }
      return { ...prev, skills: newSkills }
    })
  }

  const addSkillGroup = () => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: "", items: [] }]
    }))
  }

  const removeSkillGroup = (index: number) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
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
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Phone</label>
                          <input 
                            value={cvData.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
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
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-xl font-black">Expertise</h3>
                         <button 
                            onClick={addSkillGroup}
                            className="flex items-center space-x-2 px-4 py-2 bg-brand-action text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-brand-action/20 transition-all active:scale-95"
                         >
                            <Plus size={14} />
                            <span>Add Group</span>
                         </button>
                      </div>
                      <div className="space-y-6">
                        {cvData.skills.map((skill, idx) => (
                          <div key={idx} className="p-6 bg-white/5 border border-border-custom rounded-3xl space-y-4 relative group">
                            <button 
                              onClick={() => removeSkillGroup(idx)}
                              className="absolute top-4 right-4 text-foreground/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                               <Plus size={18} className="rotate-45" />
                            </button>
                            <div className="space-y-4">
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Category</label>
                                 <input 
                                   value={skill.category}
                                   onChange={(e) => updateSkill(idx, "category", e.target.value)}
                                   placeholder="e.g. Web Development"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                               <div className="space-y-1.5">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Items (Comma separated)</label>
                                 <input 
                                   value={skill.items.join(", ")}
                                   onChange={(e) => updateSkill(idx, "items", e.target.value)}
                                   placeholder="React, Next.js, Node.js"
                                   className="w-full h-11 px-4 bg-white/5 border border-border-custom rounded-xl outline-none focus:border-brand-action transition-all text-sm font-bold" 
                                 />
                               </div>
                            </div>
                          </div>
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
                                 <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Link/URL</label>
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
             <div className={`border-border-custom flex flex-wrap items-center justify-between px-3 sm:px-8 bg-background/80 backdrop-blur-2xl z-40 gap-3 transition-all duration-300 ${
               isPreview 
               ? "h-auto py-4 sm:h-22 border-b" 
               : "h-auto py-3 sm:h-20 border-b"
             }`}>
                 <div className="flex items-center space-x-3 sm:space-x-5">
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-white/5 p-1 rounded-2xl border border-border-custom">
                       {[
                         { id: "modern", name: "Modern", img: "/modern.png" },
                         { id: "classic", name: "Classic", img: "/classic.png" },
                         { id: "executive", name: "Exec", img: "/executive.png" }
                       ].map((t) => (
                         <button 
                           key={t.id}
                           onClick={() => setCurrentTemplate(t.id as any)}
                           className={`group relative w-16 sm:w-20 h-8 sm:h-10 rounded-xl overflow-hidden transition-all border-2 ${currentTemplate === t.id ? "border-brand-action scale-105 shadow-lg shadow-brand-action/20" : "border-transparent opacity-40 hover:opacity-100"}`}
                         >
                           <img src={t.img} className="w-full h-full object-cover" alt={t.name} />
                           <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${currentTemplate === t.id ? "opacity-0" : "group-hover:opacity-0"}`}>
                              <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter text-white">{t.name}</span>
                           </div>
                         </button>
                       ))}
                    </div>
                    <div className="hidden md:flex items-center space-x-2 text-brand-success text-[10px] font-black uppercase tracking-[0.2em] border-l border-border-custom pl-5">
                       <div className="w-1.5 h-1.5 bg-brand-success rounded-full animate-pulse" />
                       <span className="hidden lg:inline">Live Sync Active</span>
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
               <div className={`flex-1 w-full overflow-auto bg-slate-100/5 custom-scrollbar relative z-10 flex justify-center py-10 ${isPreview ? "p-0 pb-24" : ""}`}>
                <div className={`origin-top transition-transform duration-500 scale-[0.4] xs:scale-[0.5] sm:scale-75 md:scale-[0.85] lg:scale-[0.75] xl:scale-95 ${isPreview ? "scale-[0.4] xs:scale-[0.55] sm:scale-100 mt-4 mb-20" : "my-0"}`}>
                   {renderTemplate()}
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
