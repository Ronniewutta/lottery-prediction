import { astro } from 'iztro'
import { prisma } from './prisma'

export interface HoroscopeResult {
  zodiacSign: string
  chineseZodiac: string
  luckyNumbers: number[]
  elements: {
    wood: number
    fire: number
    earth: number
    metal: number
    water: number
  }
  analysis: string
  lotteryAdvice: string
}

// Get zodiac sign from birth date
export function getZodiacSign(birthDate: Date): string {
  const month = birthDate.getMonth() + 1
  const day = birthDate.getDate()

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius'
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces'
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius'
  return 'Capricorn'
}

// Get Chinese zodiac from birth year
export function getChineseZodiac(birthYear: number): string {
  const animals = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ]
  return animals[(birthYear - 4) % 12]
}

// Generate lucky numbers based on horoscope
export function generateLuckyNumbers(
  birthDate: Date,
  zodiacSign: string,
  chineseZodiac: string
): number[] {
  const luckyNumbers: number[] = []
  
  // Add numbers based on zodiac sign
  const zodiacNumbers: Record<string, number[]> = {
    'Aries': [1, 9, 17, 25, 33],
    'Taurus': [2, 10, 18, 26, 34],
    'Gemini': [3, 11, 19, 27, 35],
    'Cancer': [4, 12, 20, 28, 36],
    'Leo': [5, 13, 21, 29, 37],
    'Virgo': [6, 14, 22, 30, 38],
    'Libra': [7, 15, 23, 31, 39],
    'Scorpio': [8, 16, 24, 32, 40],
    'Sagittarius': [9, 17, 25, 33, 41],
    'Capricorn': [10, 18, 26, 34, 42],
    'Aquarius': [11, 19, 27, 35, 43],
    'Pisces': [12, 20, 28, 36, 44],
  }
  
  luckyNumbers.push(...(zodiacNumbers[zodiacSign] || [1, 2, 3, 4, 5]))
  
  // Add numbers based on Chinese zodiac
  const chineseNumbers: Record<string, number[]> = {
    'Rat': [2, 3, 5],
    'Ox': [1, 4, 6],
    'Tiger': [1, 3, 7],
    'Rabbit': [3, 6, 9],
    'Dragon': [1, 5, 7],
    'Snake': [2, 8, 9],
    'Horse': [2, 3, 7],
    'Goat': [2, 7, 9],
    'Monkey': [4, 9, 11],
    'Rooster': [5, 7, 8],
    'Dog': [3, 4, 9],
    'Pig': [2, 5, 8],
  }
  
  luckyNumbers.push(...(chineseNumbers[chineseZodiac] || [1, 2, 3]))
  
  // Add birth date based numbers
  const day = birthDate.getDate()
  luckyNumbers.push(day % 10)
  luckyNumbers.push(Math.floor(day / 10))
  
  // Remove duplicates and return top 10
  return [...new Set(luckyNumbers)].slice(0, 10)
}

// Get element analysis
export function getElements(birthDate: Date): { wood: number; fire: number; earth: number; metal: number; water: number } {
  const year = birthDate.getFullYear()
  const elements = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  }
  
  // Simple element calculation based on year
  const lastDigit = year % 10
  if (lastDigit <= 1) elements.wood = 1
  else if (lastDigit <= 3) elements.fire = 1
  else if (lastDigit <= 5) elements.earth = 1
  else if (lastDigit <= 7) elements.metal = 1
  else elements.water = 1
  
  return elements
}

// Generate horoscope analysis
export function generateHoroscopeAnalysis(
  birthDate: Date,
  zodiacSign: string,
  chineseZodiac: string
): string {
  const analyses: Record<string, string> = {
    'Aries': 'Your fiery energy brings bold opportunities. Trust your instincts for lottery numbers.',
    'Taurus': 'Your steady nature favors conservative choices. Consider numbers with stable patterns.',
    'Gemini': 'Your versatile mind sees multiple possibilities. Mix odd and even numbers.',
    'Cancer': 'Your intuition is strong. Trust your gut feelings for number selection.',
    'Leo': 'Your confidence attracts good fortune. Choose numbers that reflect your boldness.',
    'Virgo': 'Your analytical mind helps spot patterns. Use statistical analysis for better odds.',
    'Libra': 'Your balance seeks harmony. Choose numbers in balanced combinations.',
    'Scorpio': 'Your intensity uncovers hidden opportunities. Look for unconventional numbers.',
    'Sagittarius': 'Your optimism opens doors. Consider numbers with upward energy.',
    'Capricorn': 'Your discipline pays off. Stick to systematic number selection.',
    'Aquarius': 'Your innovation brings fresh perspectives. Try unique number combinations.',
    'Pisces': 'Your intuition guides you well. Trust dreams and spiritual messages.',
  }
  
  return analyses[zodiacSign] || 'Your unique energy brings special opportunities.'
}

// Generate lottery advice based on horoscope
export function generateLotteryAdvice(
  zodiacSign: string,
  chineseZodiac: string,
  luckyNumbers: number[]
): string {
  const elementAdvice: Record<string, string> = {
    'Rat': 'Rats are clever and quick. Trust your sharp instincts.',
    'Ox': 'Oxen are patient and determined. Stick with your chosen numbers.',
    'Tiger': 'Tigers are brave and competitive. Take calculated risks.',
    'Rabbit': 'Rabbits are gentle and lucky. Trust your quiet intuition.',
    'Dragon': 'Dragons are powerful and fortunate. Bold choices pay off.',
    'Snake': 'Snakes are wise and intuitive. Look for hidden patterns.',
    'Horse': 'Horses are energetic and free. Try diverse number combinations.',
    'Goat': 'Goats are creative and artistic. Choose numbers with personal meaning.',
    'Monkey': 'Monkeys are clever and adaptable. Be flexible with your strategy.',
    'Rooster': 'Roosters are observant and hardworking. Analyze patterns carefully.',
    'Dog': 'Dogs are loyal and honest. Stick to your trusted numbers.',
    'Pig': 'Pigs are generous and lucky. Share your good fortune.',
  }
  
  const chineseAdvice = elementAdvice[chineseZodiac] || 'Trust your instincts.'
  const luckyStr = luckyNumbers.slice(0, 5).join(', ')
  
  return `${chineseAdvice} Your lucky numbers for this period are: ${luckyStr}. Consider these in your lottery selections.`
}

// Main horoscope generation function
export async function generateHoroscope(
  birthDate: Date,
  birthTime?: string,
  gender?: string
): Promise<HoroscopeResult> {
  const zodiacSign = getZodiacSign(birthDate)
  const chineseZodiac = getChineseZodiac(birthDate.getFullYear())
  const luckyNumbers = generateLuckyNumbers(birthDate, zodiacSign, chineseZodiac)
  const elements = getElements(birthDate)
  const analysis = generateHoroscopeAnalysis(birthDate, zodiacSign, chineseZodiac)
  const lotteryAdvice = generateLotteryAdvice(zodiacSign, chineseZodiac, luckyNumbers)
  
  // Try to use iztro for more detailed analysis
  try {
    const dateStr = birthDate.toISOString().split('T')[0]
    const hour = birthTime ? parseInt(birthTime.split(':')[0]) : 12
    const astrolabe = astro.bySolar(dateStr, hour, gender === 'male' ? '男' : '女', true, 'zh-CN')
    
    // Get additional insights from the astrolabe
    const palaces = astrolabe.palaces
    
    if (palaces && palaces.length > 0) {
      return {
        zodiacSign,
        chineseZodiac,
        luckyNumbers,
        elements,
        analysis: `${analysis} Zi Wei Dou Shu analysis shows strong potential.`,
        lotteryAdvice: `${lotteryAdvice} Your stars align for financial opportunities.`,
      }
    }
  } catch (error) {
    console.log('Using basic horoscope analysis')
  }
  
  return {
    zodiacSign,
    chineseZodiac,
    luckyNumbers,
    elements,
    analysis,
    lotteryAdvice,
  }
}

// Save horoscope data to database
export async function saveHoroscopeData(
  userId: string,
  birthDate: Date,
  horoscope: HoroscopeResult
): Promise<void> {
  await prisma.horoscopeData.upsert({
    where: {
      userId_date: {
        userId,
        date: new Date(),
      },
    },
    update: {
      zodiacSign: horoscope.zodiacSign,
      chineseZodiac: horoscope.chineseZodiac,
      luckyNumbers: horoscope.luckyNumbers,
      elements: horoscope.elements,
      analysis: horoscope.analysis,
    },
    create: {
      userId,
      date: new Date(),
      zodiacSign: horoscope.zodiacSign,
      chineseZodiac: horoscope.chineseZodiac,
      luckyNumbers: horoscope.luckyNumbers,
      elements: horoscope.elements,
      analysis: horoscope.analysis,
    },
  })
}
