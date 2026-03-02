const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("--- Checking DB Connection and Data ---");
  try {
    const userCount = await prisma.user.count();
    console.log(`User Count: ${userCount}`);

    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true, email: true, name: true }
    });
    console.log("Recent Users:", JSON.stringify(users, null, 2));

    if (users.length > 0) {
      const firstUserId = users[0].id;
      console.log(`Checking CVs for User: ${firstUserId}`);
      const cvCount = await prisma.cV.count({ where: { userId: firstUserId } });
      console.log(`CV Count for this user: ${cvCount}`);
      
      const cvs = await prisma.cV.findMany({
        where: { userId: firstUserId },
        select: { id: true, name: true }
      });
      console.log("CVs for this user:", JSON.stringify(cvs, null, 2));
    }
  } catch (error) {
    console.error("DB Check Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
