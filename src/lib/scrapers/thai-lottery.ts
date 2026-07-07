import axios from 'axios'
import * as cheerio from 'cheerio'

export interface LotteryDraw {
  drawDate: Date
  drawNumber: string
  firstPrize: string
  lastTwoDigits: string
  lastThreeDigits: string
  frontThreeDigits: string
  prizes: Record<string, string[]>
  runningNumbers: string[]
}

export async function scrapeThaiLottery(): Promise<LotteryDraw[]> {
  try {
    // Using the rayriffy Thai lottery API
    const response = await axios.get('https://lotto.api.rayriffy.com/history', {
      timeout: 10000,
    })

    const draws: LotteryDraw[] = []
    const data = response.data

    if (data && data.response) {
      for (const [dateStr, drawData] of Object.entries(data.response) as [string, any][]) {
        const drawDate = new Date(dateStr)
        const prizes = drawData.prize || {}
        
        draws.push({
          drawDate,
          drawNumber: dateStr,
          firstPrize: prizes.first?.toString() || '',
          lastTwoDigits: prizes.last2?.toString() || '',
          lastThreeDigits: prizes.last3?.toString() || '',
          frontThreeDigits: prizes.front3?.toString() || '',
          prizes: {
            first: [prizes.first?.toString() || ''],
            last2: [prizes.last2?.toString() || ''],
            last3: [prizes.last3?.toString() || ''],
            front3: [prizes.front3?.toString() || ''],
            second: (prizes.second || []).map((n: number) => n.toString()),
            third: (prizes.third || []).map((n: number) => n.toString()),
            fourth: (prizes.fourth || []).map((n: number) => n.toString()),
            fifth: (prizes.fifth || []).map((n: number) => n.toString()),
          },
          runningNumbers: (prizes.running || []).map((n: number) => n.toString()),
        })
      }
    }

    return draws.slice(0, 50) // Return last 50 draws
  } catch (error) {
    console.error('Error scraping Thai lottery:', error)
    return []
  }
}

export async function scrapeThaiLotteryFromSanook(): Promise<LotteryDraw[]> {
  try {
    const draws: LotteryDraw[] = []
    const currentYear = new Date().getFullYear()
    
    for (let year = currentYear; year >= currentYear - 2; year--) {
      const response = await axios.get(
        `https://www.sanook.com/lotto/check/history/${year}/`,
        { timeout: 10000 }
      )
      
      const $ = cheerio.load(response.data)
      
      // Parse the HTML to extract lottery data
      // This is a simplified example - actual implementation would depend on the HTML structure
      $('table tr').each((_, row) => {
        const cells = $(row).find('td')
        if (cells.length >= 3) {
          const dateStr = $(cells[0]).text().trim()
          const firstPrize = $(cells[1]).text().trim()
          const nearPrize = $(cells[2]).text().trim()
          
          if (dateStr && firstPrize) {
            draws.push({
              drawDate: new Date(dateStr),
              drawNumber: dateStr,
              firstPrize,
              lastTwoDigits: nearPrize,
              lastThreeDigits: '',
              frontThreeDigits: '',
              prizes: { first: [firstPrize] },
              runningNumbers: [],
            })
          }
        }
      })
    }
    
    return draws.slice(0, 50)
  } catch (error) {
    console.error('Error scraping Thai lottery from Sanook:', error)
    return []
  }
}
