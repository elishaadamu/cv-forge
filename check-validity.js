const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("--- DATA VALIDITY CHECK ---");
  try {
    const cvs = await prisma.cV.findMany({
      include: {
        user: true
      }
    });
    
    console.log(`Checking ${cvs.length} CVs...`);
    cvs.forEach(cv => {
      console.log(`- CV "${cv.name}" (ID: ${cv.id})`);
      console.log(`  User: ${cv.user ? cv.user.email : "MISSING"}`);
      console.log(`  UserId in CV: ${cv.userId}`);
      if (cv.user && cv.userId !== cv.user.id) {
        console.error(`  Mismatch: userId ${cv.userId} != user.id ${cv.user.id}`);
      }
    });

  } catch (error) {
    console.error("Check failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
