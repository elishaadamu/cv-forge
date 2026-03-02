import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    // TODO: Implement CV saving logic with Prisma
    return NextResponse.json({ message: 'CV saved successfully', success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save CV' }, { status: 500 })
  }
}
