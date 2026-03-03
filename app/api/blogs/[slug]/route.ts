import { getAllBlogs, getBlogBySlug } from "@/lib/blogs"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await (params as any);
    const blog = getBlogBySlug(slug)
    
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 })
    }

    const allBlogs = getAllBlogs()
    const related = allBlogs
      .filter(b => b.category === blog.category && b.slug !== blog.slug)
      .slice(0, 3)

    return NextResponse.json({ success: true, blog, related })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
