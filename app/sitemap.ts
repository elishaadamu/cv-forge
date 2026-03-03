import { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cvmyjob.com"; // User's domain base

  // Static routes
  const staticRoutes = [
    "",
    "/templates",
    "/blog",
    "/ats",
    "/login",
    "/signup",
    "/support",
    "/features",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic blog routes from static files
  const blogs = getAllBlogs();
  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
