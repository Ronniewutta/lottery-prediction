import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateHoroscope, saveHoroscopeData } from '@/lib/horoscope'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { birthDate, birthTime, gender } = await req.json()

    if (!birthDate) {
      return NextResponse.json(
        { error: 'Birth date is required' },
        { status: 400 }
      )
    }

    const date = new Date(birthDate)
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid birth date' },
        { status: 400 }
      )
    }

    const horoscope = await generateHoroscope(date, birthTime, gender)

    // Save to database if user is logged in
    if (session?.user?.id) {
      await saveHoroscopeData(session.user.id, date, horoscope)
    }

    return NextResponse.json({
      success: true,
      horoscope,
    })
  } catch (error) {
    console.error('Horoscope generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate horoscope' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const birthDate = searchParams.get('birthDate')

    if (!birthDate) {
      return NextResponse.json(
        { error: 'Birth date is required' },
        { status: 400 }
      )
    }

    const date = new Date(birthDate)
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid birth date' },
        { status: 400 }
      )
    }

    const horoscope = await generateHoroscope(date)

    return NextResponse.json({
      success: true,
      horoscope,
    })
  } catch (error) {
    console.error('Horoscope generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate horoscope' },
      { status: 500 }
    )
  }
}
