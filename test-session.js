async function testSession() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/session')
    const data = await res.json()
    console.log('Session result:', data)
  } catch (err) {
    console.error('Failed to fetch session:', err.message)
  }
}

testSession()
