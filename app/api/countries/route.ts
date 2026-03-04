import { NextResponse } from "next/server"
import axios from "axios"

export async function GET() {
  try {
    const response = await axios.get('https://www.apicountries.com/countries')
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error proxying countries API:', error)
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 })
  }
}
