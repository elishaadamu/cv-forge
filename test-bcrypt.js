const bcrypt = require("bcryptjs")

async function test() {
  const hash = "$2b$10$dYZUzmUllRSM1qLiNs4.3eVieJDgjSuWShf3zHr5lAost76KIVh5i"
  console.log("Hash:", hash)
  
  // We don't know the password, but we can check if bcryptjs is working
  const startTime = Date.now()
  const result = await bcrypt.compare("any_password", hash)
  const duration = Date.now() - startTime
  
  console.log("Comparison result:", result)
  console.log("Duration:", duration, "ms")
}

test()
