const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  fs.writeFileSync('user-dump-utf8.json', JSON.stringify(users, null, 2), 'utf8')
  console.log('Wrote to user-dump-utf8.json')
}

main().finally(() => prisma.$disconnect())
