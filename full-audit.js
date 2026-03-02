const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("=== FULL DB AUDIT ===");
  try {
    const users = await prisma.user.findMany({
      include: {
        cvs: true,
        accounts: true,
        sessions: true
      }
    });

    console.log(`Total Users: ${users.length}`);
    users.forEach(u => {
      console.log(`- User: ${u.email} (ID: ${u.id})`);
      console.log(`  Name: ${u.name}`);
      console.log(`  CVs: ${u.cvs.length}`);
      u.cvs.forEach(c => console.log(`    * CV: ${c.name} (ID: ${c.id})`));
      console.log(`  Accounts: ${u.accounts.length}`);
      console.log(`  Sessions: ${u.sessions.length}`);
      console.log("-------------------");
    });

  } catch (error) {
    console.error("Audit Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
