import axios from 'axios'

export interface VietnamLotteryDraw {
  drawDate: Date
  drawNumber: string
  region: string
  prizes: Record<string, string>
  specialPrize?: string
}

export async function scrapeVietnamLottery(): Promise<VietnamLotteryDraw[]> {
  try {
    const draws: VietnamLotteryDraw[] = []
    const regions = ['mien_bac', 'mien_nam', 'mien_trung']
    
    for (const region of regions) {
      const response = await axios.get(
        `https://xoso.com.vn/xoso-${region}.html`,
        { timeout: 10000 }
      )
      
      const data = response.data
      if (data && data.results) {
        for (const result of data.results) {
          draws.push({
            drawDate: new Date(result.date),
            drawNumber: result.date,
            region,
            prizes: {
              g1: result.g1 || '',
              g2: result.g2 || '',
              g3: result.g3 || '',
              g4: result.g4 || '',
              g5: result.g5 || '',
              g6: result.g6 || '',
              g7: result.g7 || '',
              db: result.db || '',
            },
            specialPrize: result.db || '',
          })
        }
      }
    }
    
    return draws.slice(0, 100)
  } catch (error) {
    console.error('Error scraping Vietnam lottery:', error)
    return []
  }
}

export async function scrapeVietnamLotteryFromAPI(): Promise<VietnamLotteryDraw[]> {
  try {
    const draws: VietnamLotteryDraw[] = []
    const regions = ['mien-bac', 'mien-nam', 'mien-trung']
    
    for (const region of regions) {
      const response = await axios.get(
        `https://www.minhngoc.net.vn/get-data.html?region=${region}`,
        { timeout: 10000 }
      )
      
      const data = response.data
      if (data && Array.isArray(data)) {
        for (const item of data) {
          draws.push({
            drawDate: new Date(item.date),
            drawNumber: item.date,
            region: region.replace('-', '_'),
            prizes: {
              special: item.special || '',
              first: item.first || '',
              second: item.second || '',
              third: item.third || '',
              fourth: item.fourth || '',
              fifth: item.fifth || '',
              sixth: item.sixth || '',
              seventh: item.seventh || '',
            },
            specialPrize: item.special || '',
          })
        }
      }
    }
    
    return draws.slice(0, 100)
  } catch (error) {
    console.error('Error scraping Vietnam lottery from API:', error)
    return []
  }
}
