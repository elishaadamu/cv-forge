const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Checking DB schema validity and update capability...");
  try {
     const user = await prisma.user.findFirst();
     if (!user) {
         console.log("No user found, creating a dummy user...");
         // Skip update if no user, but findFirst should have at least showed if columns exist
         return;
     }

     console.log("Testing update on user:", user.id);
     const updated = await prisma.user.update({
       where: { id: user.id },
       data: {
         otpCode: "123456",
         otpExpiry: new Date(Date.now() + 600000)
       }
     });
     console.log("✅ Update succeeded! otpCode:", updated.otpCode);

  } catch (err) {
     console.error("❌ Test failed:", err.message);
  } finally {
     await prisma.$disconnect();
  }
}

main();
