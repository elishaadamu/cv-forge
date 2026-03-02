const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      password: true,
      image: true
    }
  })
  console.log('--- User List ---')
  users.forEach(u => {
    console.log(`Email: ${u.email}, Name: ${u.name}, HasPassword: ${!!u.password}, HasImage: ${!!u.image}`)
  })
  console.log('-----------------')
}

main().finally(() => prisma.$disconnect())
