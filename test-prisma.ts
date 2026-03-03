import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: "", mode: "insensitive" } },
            { email: { contains: "", mode: "insensitive" } },
          ]
        },
        {}
      ]
    }
  })
  console.log(users.length)
}

main().catch(console.error).finally(() => prisma.$disconnect())
