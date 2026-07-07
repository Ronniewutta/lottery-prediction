import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generatePrediction } from '@/lib/prediction-engine'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { lotteryType } = await req.json()

    if (!lotteryType || !['thai', 'vietnam', 'laos'].includes(lotteryType)) {
      return NextResponse.json(
        { error: 'Invalid lottery type' },
        { status: 400 }
      )
    }

    const prediction = await generatePrediction(
      lotteryType,
      session?.user?.id
    )

    return NextResponse.json({
      success: true,
      prediction: {
        numbers: prediction.predictedNumbers,
        confidence: prediction.confidence,
        method: prediction.method,
        analysis: prediction.analysis,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const lotteryType = searchParams.get('type')

    if (!lotteryType || !['thai', 'vietnam', 'laos'].includes(lotteryType)) {
      return NextResponse.json(
        { error: 'Invalid lottery type' },
        { status: 400 }
      )
    }

    const prediction = await generatePrediction(
      lotteryType,
      session?.user?.id
    )

    return NextResponse.json({
      success: true,
      prediction: {
        numbers: prediction.predictedNumbers,
        confidence: prediction.confidence,
        method: prediction.method,
        analysis: prediction.analysis,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    )
  }
}
