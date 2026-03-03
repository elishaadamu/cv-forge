import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogStatic {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: {
    name: string;
    image?: string;
  };
  createdAt: string;
  tags: string[];
}

export function getAllBlogs(): BlogStatic[] {
  const contentsDir = path.join(process.cwd(), 'contents');
  
  if (!fs.existsSync(contentsDir)) {
    return [];
  }

  const files = fs.readdirSync(contentsDir);
  
  const blogs = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace('.md', '');
      const filePath = path.join(contentsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content: content, // The actual markdown body
        image: data.image,
        category: data.category,
        author: { name: data.author },
        createdAt: data.createdAt,
        tags: data.tags || [],
      };
    });

  return blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBlogBySlug(slug: string): BlogStatic | null {
  const blogs = getAllBlogs();
  return blogs.find(b => b.slug === slug) || null;
}
