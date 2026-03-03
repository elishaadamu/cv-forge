import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst()
  if (!user) {
    console.log("No user found. Please sign up first.")
    return
  }

  const category = await prisma.category.upsert({
    where: { name: 'Career Strategy' },
    update: {},
    create: { name: 'Career Strategy' }
  })

  await prisma.tag.upsert({
    where: { name: 'Resume' },
    update: {},
    create: { name: 'Resume' }
  })

  await prisma.blog.upsert({
    where: { slug: 'how-to-land-your-dream-job-in-2024' },
    update: {},
    create: {
      title: 'How to Land Your Dream Job in 2024',
      slug: 'how-to-land-your-dream-job-in-2024',
      excerpt: 'Discover the ultimate strategies to stand out in a competitive job market with ATS-optimised CVs and AI-driven networking.',
      content: `
# The Modern Job Search

In 2024, simply having a good CV isn't enough. You need a **digital presence**, a **technical edge**, and a **strategic mindset**.

## 1. ATS Optimization
Most companies use Applicant Tracking Systems. If your CV isn't formatted correctly, humans will never see it. 

### Key Tips:
* Use standard headings
* Include industry-specific keywords
* Avoid complex tables and graphics in the raw file

## 2. Leverage AI
AI can help you refine your professional story. Use it to:
* Brainstorm impact statements
* Match keywords to job descriptions
* Practice interview questions

> "The best way to predict your future is to create it." — Abraham Lincoln

Stay tuned for more insights on how to forge your career.
`,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop',
      published: true,
      authorId: user.id,
      categoryId: category.id,
      tags: {
        connect: { name: 'Resume' }
      }
    }
  })

  console.log("Seed finished!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
