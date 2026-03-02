import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"

async function simulateLogin(email, password) {
  console.log("Simulating login for:", email)
  
  // 1. Authorize logic
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log("Result: User not found")
      return
    }
    
    if (!user.password) {
      console.log("Result: No password set")
      return
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    console.log("Password valid:", isValid)
    
    if (isValid) {
      console.log("Authorize would return user:", user.email)
    } else {
      console.log("Authorize would return null (invalid password)")
    }
  } catch (err) {
    console.error("Error during simulation:", err)
  }
}

// Testing with the email we found in DB
simulateLogin("elishadamu97@gmail.com", "wrong_password")
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
