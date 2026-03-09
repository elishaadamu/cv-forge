import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "error", "warn", "info"],
});

async function main() {
  try {
    console.log("Attempting to connect and count users...");
    const count = await prisma.user.count();
    console.log(`Success! User count: ${count}`);
  } catch (err) {
    console.error("Database connection failed during test:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
