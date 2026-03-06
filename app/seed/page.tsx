"use client"

import { useEffect, useState } from "react"
import { saveCV } from "@/lib/actions"

export default function SeedPage() {
  const [status, setStatus] = useState("Ready to seed...")
  
  const handleSeed = async () => {
    setStatus("Seeding...")
    try {
      // In a real app we'd get the actual user ID from the session, 
      // but here we are assuming we are elishadamu97@gmail.com
      // We can also just visit this page while logged in.
      
      const cvData = {
        personalInfo: {
          fullName: "Elisha Adamu",
          email: "elishadamu97@gmail.com",
          jobTitle: "Senior Full-Stack Engineer",
          summary: "Over 7 years of full-stack experience in React, Next.js, and Node.js. Expertise in architecting scalable and performant cloud-native applications for enterprise clients.",
          phoneCode: "+234",
          phone: "8123456789",
          country: "Nigeria",
          county: "Lagos",
          location: "Ikeja",
          nationality: "Nigerian",
          gender: "Male",
          dateOfBirth: "1997-10-15",
          placeOfBirth: "Kaduna",
          passport: "A09123456",
          workPermit: "Citizen"
        },
        experience: [
          {
            id: "master-exp-1",
            company: "Tech Forge Africa",
            role: "Lead Software Architect",
            duration: "2021 - Present",
            location: "Lagos",
            country: "Nigeria",
            county: "Lagos State",
            workDescription: "Driving the technical direction of high-impact web products and leading architecture transitions to modern stacks.",
            description: [
              "Designed and implemented microservices handling millions of monthly requests.",
              "Mentor team of 15 devs across 3 different timezones."
            ]
          },
          {
            id: "master-exp-2",
            company: "Innovate Hub",
            role: "Senior Full Stack Dev",
            duration: "2018 - 2021",
            location: "FCT",
            country: "Nigeria",
            county: "Abuja",
            workDescription: "Core feature lead for cloud-based SaaS solutions.",
            description: [
              "Integrated multiple third-party APIs for fintech projects.",
              "Reduced application latency by 50% using edge caching."
            ]
          }
        ],
        education: [
          {
            id: "master-edu-1",
            school: "University of Lagos",
            degree: "Master of Science",
            fieldOfStudy: "Computer Science",
            duration: "2020 - 2022",
            grade: "Distinction",
            location: "Akoka",
            country: "Nigeria"
          },
          {
            id: "master-edu-2",
            school: "Ahmadu Bello University",
            degree: "B.Eng.",
            fieldOfStudy: "Software Engineering",
            duration: "2014 - 2018",
            grade: "First Class",
            location: "Zaria",
            country: "Nigeria"
          }
        ],
        skills: [
          { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"] },
          { category: "Backend", items: ["Node.js", "Express", "Prisma", "PostgreSQL", "Docker"] }
        ],
        projects: [
          { id: "master-proj-1", name: "CV Forge", description: "The ultimate AI CV builder.", link: "https://cv-forge.com" }
        ],
        languages: [
          { name: "English", proficiency: "Fluent" },
          { name: "French", proficiency: "Intermediate" }
        ],
        volunteering: [
          { id: "master-vol-1", organization: "Tech Charity", role: "Mentor", duration: "2021", location: "Online", country: "Nigeria", description: "Helping kids learn code." }
        ],
        templateId: "refined"
      };

      // We'll use a placeholder for the userId, the server action should have safety checks
      // Or we can just call the action and it will get the current session user
      const res = await saveCV("auto-from-session" as any, cvData as any);
      
      if (res.success) {
        setStatus(`SUCCESS! CV Created with ID: ${res.id}. You can close this page.`);
      } else {
        setStatus(`FAILED: ${res.error}`);
      }
    } catch (err: any) {
      setStatus(`ERROR: ${err.message}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white">
      <h1 className="text-3xl font-black mb-8 text-brand-action">MASTER CV SEEDER</h1>
      <p className="mb-8 text-foreground/60">{status}</p>
      <button 
        onClick={handleSeed}
        className="px-8 py-4 bg-brand-action text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all"
      >
        Run Seed Now
      </button>
      <p className="mt-8 text-xs text-brand-action/40 uppercase tracking-widest">Only use this if logged in as elishadamu97@gmail.com</p>
    </div>
  )
}
