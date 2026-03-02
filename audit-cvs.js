const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("--- CV Table Audit ---");
  try {
    const totalCVs = await prisma.cV.count();
    console.log(`Total CVs in Database: ${totalCVs}`);

    const latestCVs = await prisma.cV.findMany({
      take: 10,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        userId: true,
        updatedAt: true
      }
    });

    console.log("Latest 10 CVs:", JSON.stringify(latestCVs, null, 2));
  } catch (error) {
    console.error("DB Audit Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
