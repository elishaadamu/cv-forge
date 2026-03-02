import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"

async function testAuthorize(email, password) {
  console.log("Testing authorize for:", email)
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.log("User not found")
    return
  }

  if (!user.password) {
    console.log("User has no password (OAuth user?)")
    return
  }

  console.log("User found, comparing password...")
  const isValid = await bcrypt.compare(password, user.password)
  console.log("Password valid:", isValid)
}

// Replace with actual credentials if known, or use the one we found in DB
// User 1: email: "elishadamu97@gmail.com", password: ???
// Since I don't know the password, I can't fully test success, 
// but I can test the DB connectivity part.

testAuthorize("elishadamu97@gmail.com", "password123")
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
