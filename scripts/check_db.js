const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const latest = await prisma.scholarship.findMany({
    orderBy: { postedAt: 'desc' },
    take: 5
  });
  console.log(JSON.stringify(latest, null, 2));
  await prisma.$disconnect();
}
check();
