import axios from 'axios'

export interface LaosLotteryDraw {
  drawDate: Date
  drawNumber: string
  firstPrize: string
  lastTwoDigits: string
  lastThreeDigits: string
  prizes: Record<string, string[]>
}

export async function scrapeLaosLottery(): Promise<LaosLotteryDraw[]> {
  try {
    const draws: LaosLotteryDraw[] = []
    
    // Using a public API or scraping source
    const response = await axios.get(
      'https://www.lalottery.com/api/results',
      { timeout: 10000 }
    )
    
    const data = response.data
    if (data && data.results) {
      for (const result of data.results) {
        draws.push({
          drawDate: new Date(result.date),
          drawNumber: result.date,
          firstPrize: result.first || '',
          lastTwoDigits: result.last2 || '',
          lastThreeDigits: result.last3 || '',
          prizes: {
            first: [result.first || ''],
            second: [result.second || ''],
            third: [result.third || ''],
            last2: [result.last2 || ''],
            last3: [result.last3 || ''],
          },
        })
      }
    }
    
    return draws.slice(0, 50)
  } catch (error) {
    console.error('Error scraping Laos lottery:', error)
    return []
  }
}

export async function scrapeLaosLotteryAlternative(): Promise<LaosLotteryDraw[]> {
  try {
    const draws: LaosLotteryDraw[] = []
    
    // Alternative scraping source
    const response = await axios.get(
      'https://laoslottery.net/api/v1/results',
      { timeout: 10000 }
    )
    
    const data = response.data
    if (data && Array.isArray(data)) {
      for (const item of data) {
        draws.push({
          drawDate: new Date(item.draw_date),
          drawNumber: item.draw_number || item.draw_date,
          firstPrize: item.first_prize || '',
          lastTwoDigits: item.last_two_digits || '',
          lastThreeDigits: item.last_three_digits || '',
          prizes: {
            first: [item.first_prize || ''],
            second: [item.second_prize || ''],
            third: [item.third_prize || ''],
            last2: [item.last_two_digits || ''],
            last3: [item.last_three_digits || ''],
          },
        })
      }
    }
    
    return draws.slice(0, 50)
  } catch (error) {
    console.error('Error scraping Laos lottery alternative:', error)
    return []
  }
}
