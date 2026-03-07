"use server"

import axios from "axios"

export interface ScrapedJob {
  title: string
  company: string
  description: string
  image: string
  url: string
  location: string
  salary: string
  type: string
}

export async function scrapeJobUrl(url: string): Promise<ScrapedJob | { error: string }> {
  const attemptScrape = async (userAgent: string) => {
    return await axios.get(url, {
      headers: {
        "User-Agent": userAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/",
      },
      timeout: 8000
    })
  }

  try {
    let response
    try {
      // Try Desktop first
      response = await attemptScrape("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
    } catch (e: any) {
      if (e.response?.status === 403) {
        // Try Mobile Fallback (often less protected)
        response = await attemptScrape("Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1")
      } else {
        throw e
      }
    }

    const html = response.data
    return parseJobHtml(html, url)
  } catch (error: any) {
    console.error("Scraping error:", error.message)
    if (error.response?.status === 403) {
      return { error: "Access Denied (403). Site is highly protected." }
    }
    return { error: "Failed to connect to the site. Please check the URL." }
  }
}

export async function parseJobHtml(html: string, url: string = ""): Promise<ScrapedJob> {
  const getMeta = (property: string) => {
    const reg = new RegExp(`<meta[^>]*?(?:property|name)=["'](?:og:)?${property}["'][^>]*?content=["']([^"']*)["']`, "i")
    const match = html.match(reg)
    return match ? match[1].replace(/&amp;/g, "&").trim() : ""
  }

  const getTitle = () => {
    const match = html.match(/<title>([^<]*)<\/title>/i)
    return match ? match[1].replace(/&amp;/g, "&").trim() : ""
  }

  const titleRaw = getMeta("title") || getTitle() || "Unknown Position"
  const titleParts = titleRaw.split(/(?: at | \| | - |: )/i)
  const title = titleParts[0].trim()
  
  let company = getMeta("site_name") || ""
  if (!company && titleParts.length > 1) {
    company = titleParts[titleParts.length - 1].trim()
  }

  const description = getMeta("description") || ""
  const image = getMeta("image") || ""

  return {
    title,
    company,
    description,
    image,
    url,
    location: "Remote / Multiple Locations",
    salary: "Competitive",
    type: "Full-time"
  }
}
