import { getAllBlogs } from "@/lib/blogs"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const blogs = getAllBlogs()
    return NextResponse.json({ success: true, blogs })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 })
  }
}
