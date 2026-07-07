import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeThaiLottery } from '@/lib/scrapers/thai-lottery'
import { scrapeVietnamLottery } from '@/lib/scrapers/vietnam-lottery'
import { scrapeLaosLottery } from '@/lib/scrapers/laos-lottery'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lotteryType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!lotteryType || !['thai', 'vietnam', 'laos'].includes(lotteryType)) {
      return NextResponse.json(
        { error: 'Invalid lottery type' },
        { status: 400 }
      )
    }

    let draws: any[] = []

    if (lotteryType === 'thai') {
      draws = await prisma.thaiLottery.findMany({
        orderBy: { drawDate: 'desc' },
        take: limit,
      })
    } else if (lotteryType === 'vietnam') {
      draws = await prisma.vietnamLottery.findMany({
        orderBy: { drawDate: 'desc' },
        take: limit,
      })
    } else if (lotteryType === 'laos') {
      draws = await prisma.laosLottery.findMany({
        orderBy: { drawDate: 'desc' },
        take: limit,
      })
    }

    return NextResponse.json({
      success: true,
      draws,
      count: draws.length,
    })
  } catch (error) {
    console.error('Error fetching lottery data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lottery data' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { lotteryType } = await req.json()

    if (!lotteryType || !['thai', 'vietnam', 'laos'].includes(lotteryType)) {
      return NextResponse.json(
        { error: 'Invalid lottery type' },
        { status: 400 }
      )
    }

    let scrapedDraws: any[] = []
    let savedCount = 0

    if (lotteryType === 'thai') {
      scrapedDraws = await scrapeThaiLottery()
      for (const draw of scrapedDraws) {
        try {
          await prisma.thaiLottery.upsert({
            where: { drawDate: draw.drawDate },
            update: {
              firstPrize: draw.firstPrize,
              lastTwoDigits: draw.lastTwoDigits,
              lastThreeDigits: draw.lastThreeDigits,
              frontThreeDigits: draw.frontThreeDigits,
              prizes: draw.prizes,
              runningNumbers: draw.runningNumbers,
            },
            create: {
              drawDate: draw.drawDate,
              drawNumber: draw.drawNumber,
              firstPrize: draw.firstPrize,
              lastTwoDigits: draw.lastTwoDigits,
              lastThreeDigits: draw.lastThreeDigits,
              frontThreeDigits: draw.frontThreeDigits,
              prizes: draw.prizes,
              runningNumbers: draw.runningNumbers,
            },
          })
          savedCount++
        } catch (error) {
          console.error('Error saving Thai lottery draw:', error)
        }
      }
    } else if (lotteryType === 'vietnam') {
      scrapedDraws = await scrapeVietnamLottery()
      for (const draw of scrapedDraws) {
        try {
          await prisma.vietnamLottery.upsert({
            where: { drawDate: draw.drawDate },
            update: {
              region: draw.region,
              prizes: draw.prizes,
              specialPrize: draw.specialPrize,
            },
            create: {
              drawDate: draw.drawDate,
              drawNumber: draw.drawNumber,
              region: draw.region,
              prizes: draw.prizes,
              specialPrize: draw.specialPrize,
            },
          })
          savedCount++
        } catch (error) {
          console.error('Error saving Vietnam lottery draw:', error)
        }
      }
    } else if (lotteryType === 'laos') {
      scrapedDraws = await scrapeLaosLottery()
      for (const draw of scrapedDraws) {
        try {
          await prisma.laosLottery.upsert({
            where: { drawDate: draw.drawDate },
            update: {
              firstPrize: draw.firstPrize,
              lastTwoDigits: draw.lastTwoDigits,
              lastThreeDigits: draw.lastThreeDigits,
              prizes: draw.prizes,
            },
            create: {
              drawDate: draw.drawDate,
              drawNumber: draw.drawNumber,
              firstPrize: draw.firstPrize,
              lastTwoDigits: draw.lastTwoDigits,
              lastThreeDigits: draw.lastThreeDigits,
              prizes: draw.prizes,
            },
          })
          savedCount++
        } catch (error) {
          console.error('Error saving Laos lottery draw:', error)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scraped ${scrapedDraws.length} draws, saved ${savedCount} draws`,
      scrapedCount: scrapedDraws.length,
      savedCount,
    })
  } catch (error) {
    console.error('Error scraping lottery data:', error)
    return NextResponse.json(
      { error: 'Failed to scrape lottery data' },
      { status: 500 }
    )
  }
}
