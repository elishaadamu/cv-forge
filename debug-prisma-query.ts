import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }]
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

async function main() {
  console.log('--- Testing findUnique ---')
  await prisma.user.findUnique({
    where: { email: 'elishadamu97@gmail.com' }
  })

  console.log('\n--- Testing findFirst ---')
  await prisma.user.findFirst({
    where: { email: 'elishadamu97@gmail.com' }
  })
}

main().finally(() => prisma.$disconnect())
