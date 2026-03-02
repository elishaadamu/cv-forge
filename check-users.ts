import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log('Users found:', users.map(u => ({ id: u.id, email: u.email, hasPassword: !!u.password })))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
