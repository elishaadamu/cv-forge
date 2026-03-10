"use server"

import { auth } from "@/auth"
import { spawn } from "child_process"
import path from "path"

export async function runScholarshipScraperAction() {
  const session = await auth()
  
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "scripts", "scrapeScholarships.ts")
    console.log(`Starting scraper: ${scriptPath}`)
    
    // Using npx ts-node to run the typescript script directly
    const child = spawn("npx", ["ts-node", scriptPath], {
      shell: true,
      env: { ...process.env, TS_NODE_TRANSPILE_ONLY: "true" }
    })

    let output = ""
    let errorOutput = ""

    child.stdout.on("data", (data) => {
      output += data.toString()
    })

    child.stderr.on("data", (data) => {
      errorOutput += data.toString()
    })

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ success: true, output })
      } else {
        console.error("Scraper failed:", errorOutput)
        resolve({ success: false, error: errorOutput || "Unknown error" })
      }
    })
  })
}

export async function runScholarshipRegionScraperAction() {
  const session = await auth()
  
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "scripts", "scrapeScholarshipRegion.ts")
    console.log(`Starting scraper: ${scriptPath}`)
    
    const child = spawn("npx", ["ts-node", scriptPath], {
      shell: true,
      env: { ...process.env, TS_NODE_TRANSPILE_ONLY: "true" }
    })

    let output = ""
    let errorOutput = ""

    child.stdout.on("data", (data) => {
      output += data.toString()
    })

    child.stderr.on("data", (data) => {
      errorOutput += data.toString()
    })

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ success: true, output })
      } else {
        console.error("Scraper failed:", errorOutput)
        resolve({ success: false, error: errorOutput || "Unknown error" })
      }
    })
  })
}
