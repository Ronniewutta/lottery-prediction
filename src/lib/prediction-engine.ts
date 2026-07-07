import { prisma } from './prisma'

export interface PredictionResult {
  predictedNumbers: string[]
  confidence: number
  method: string
  analysis: string
}

export interface LotteryStats {
  frequency: Record<string, number>
  hotNumbers: string[]
  coldNumbers: string[]
  patterns: string[]
  trends: string[]
}

// Calculate frequency analysis for lottery numbers
export function calculateFrequency(numbers: string[]): Record<string, number> {
  const frequency: Record<string, number> = {}
  
  for (const num of numbers) {
    for (const digit of num) {
      frequency[digit] = (frequency[digit] || 0) + 1
    }
  }
  
  return frequency
}

// Find hot numbers (frequently appearing)
export function findHotNumbers(frequency: Record<string, number>, count: number = 5): string[] {
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([digit]) => digit)
}

// Find cold numbers (rarely appearing)
export function findColdNumbers(frequency: Record<string, number>, count: number = 5): string[] {
  return Object.entries(frequency)
    .sort(([, a], [, b]) => a - b)
    .slice(0, count)
    .map(([digit]) => digit)
}

// Analyze patterns in lottery numbers
export function analyzePatterns(numbers: string[]): string[] {
  const patterns: string[] = []
  
  // Check for consecutive numbers
  const sorted = [...numbers].sort()
  let consecutive = 1
  for (let i = 1; i < sorted.length; i++) {
    if (parseInt(sorted[i]) === parseInt(sorted[i - 1]) + 1) {
      consecutive++
    } else {
      if (consecutive >= 3) {
        patterns.push(`${consecutive} consecutive numbers found`)
      }
      consecutive = 1
    }
  }
  
  // Check for repeating digits
  const digitCounts: Record<string, number> = {}
  for (const num of numbers) {
    for (const digit of num) {
      digitCounts[digit] = (digitCounts[digit] || 0) + 1
    }
  }
  
  for (const [digit, count] of Object.entries(digitCounts)) {
    if (count >= 3) {
      patterns.push(`Digit ${digit} appears ${count} times`)
    }
  }
  
  // Check for sum patterns
  const sums = numbers.map(num => 
    num.split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  )
  
  const avgSum = sums.reduce((a, b) => a + b, 0) / sums.length
  if (avgSum > 15) {
    patterns.push('High sum trend detected')
  } else if (avgSum < 10) {
    patterns.push('Low sum trend detected')
  }
  
  return patterns
}

// Generate prediction using statistical analysis
export function generateStatisticalPrediction(
  historicalNumbers: string[],
  type: string = '2digit'
): PredictionResult {
  const frequency = calculateFrequency(historicalNumbers)
  const hotNumbers = findHotNumbers(frequency, 10)
  const coldNumbers = findColdNumbers(frequency, 5)
  const patterns = analyzePatterns(historicalNumbers)
  
  let predictedNumbers: string[] = []
  let confidence = 0
  
  if (type === '2digit') {
    // Generate 2-digit predictions
    const combinations: string[] = []
    for (let i = 0; i < hotNumbers.length; i++) {
      for (let j = 0; j < hotNumbers.length; j++) {
        if (i !== j) {
          combinations.push(`${hotNumbers[i]}${hotNumbers[j]}`)
        }
      }
    }
    predictedNumbers = combinations.slice(0, 10)
    confidence = 0.3 + (patterns.length * 0.05)
  } else if (type === '3digit') {
    // Generate 3-digit predictions
    const combinations: string[] = []
    for (let i = 0; i < Math.min(5, hotNumbers.length); i++) {
      for (let j = 0; j < Math.min(5, hotNumbers.length); j++) {
        for (let k = 0; k < Math.min(5, hotNumbers.length); k++) {
          if (i !== j && j !== k && i !== k) {
            combinations.push(`${hotNumbers[i]}${hotNumbers[j]}${hotNumbers[k]}`)
          }
        }
      }
    }
    predictedNumbers = combinations.slice(0, 20)
    confidence = 0.2 + (patterns.length * 0.03)
  } else if (type === '6digit') {
    // Generate 6-digit predictions
    const shuffled = [...hotNumbers].sort(() => Math.random() - 0.5)
    predictedNumbers = [shuffled.slice(0, 6).join('')]
    confidence = 0.1
  }
  
  const analysis = `Statistical analysis shows ${hotNumbers.length} hot numbers and ${coldNumbers.length} cold numbers. ${patterns.join('. ')}.`
  
  return {
    predictedNumbers,
    confidence: Math.min(confidence, 0.8),
    method: 'statistical_frequency',
    analysis,
  }
}

// Generate prediction using pattern matching
export function generatePatternPrediction(
  historicalNumbers: string[]
): PredictionResult {
  const patterns = analyzePatterns(historicalNumbers)
  const frequency = calculateFrequency(historicalNumbers)
  
  // Look for repeating patterns
  const lastNumbers = historicalNumbers.slice(-5)
  const predictedNumbers: string[] = []
  
  // Simple pattern: numbers that appeared recently might appear again
  for (const num of lastNumbers) {
    const lastDigit = num[num.length - 1]
    const firstDigit = num[0]
    
    // Combine with hot numbers
    const hotNumbers = findHotNumbers(frequency, 3)
    for (const hot of hotNumbers) {
      predictedNumbers.push(`${firstDigit}${hot}`)
      predictedNumbers.push(`${hot}${lastDigit}`)
    }
  }
  
  const uniquePredictions = [...new Set(predictedNumbers)].slice(0, 10)
  
  return {
    predictedNumbers: uniquePredictions,
    confidence: 0.25 + (patterns.length * 0.04),
    method: 'pattern_matching',
    analysis: `Pattern analysis identified ${patterns.length} patterns in recent draws.`,
  }
}

// Save prediction to database
export async function savePrediction(
  userId: string | null,
  predictionType: string,
  drawDate: Date,
  result: PredictionResult
): Promise<void> {
  await prisma.prediction.create({
    data: {
      userId,
      predictionType,
      drawDate,
      predictedNumbers: result.predictedNumbers,
      confidence: result.confidence,
      method: result.method,
    },
  })
}

// Get historical numbers from database
export async function getHistoricalNumbers(
  lotteryType: string,
  limit: number = 100
): Promise<string[]> {
  let numbers: string[] = []
  
  if (lotteryType === 'thai') {
    const draws = await prisma.thaiLottery.findMany({
      orderBy: { drawDate: 'desc' },
      take: limit,
    })
    numbers = draws.map((d: { firstPrize: string }) => d.firstPrize).filter(Boolean)
  } else if (lotteryType === 'vietnam') {
    const draws = await prisma.vietnamLottery.findMany({
      orderBy: { drawDate: 'desc' },
      take: limit,
    })
    numbers = draws.map((d: { specialPrize: string | null }) => d.specialPrize || '').filter(Boolean)
  } else if (lotteryType === 'laos') {
    const draws = await prisma.laosLottery.findMany({
      orderBy: { drawDate: 'desc' },
      take: limit,
    })
    numbers = draws.map((d: { firstPrize: string }) => d.firstPrize).filter(Boolean)
  }
  
  return numbers
}

// Main prediction function
export async function generatePrediction(
  lotteryType: string,
  userId?: string
): Promise<PredictionResult> {
  const historicalNumbers = await getHistoricalNumbers(lotteryType, 50)
  
  if (historicalNumbers.length < 10) {
    // Not enough data, use random generation
    return {
      predictedNumbers: Array.from({ length: 10 }, () => 
        Math.floor(Math.random() * 100).toString().padStart(2, '0')
      ),
      confidence: 0.1,
      method: 'random',
      analysis: 'Insufficient historical data for accurate prediction.',
    }
  }
  
  // Combine multiple prediction methods
  const statisticalPrediction = generateStatisticalPrediction(historicalNumbers, '2digit')
  const patternPrediction = generatePatternPrediction(historicalNumbers)
  
  // Merge predictions
  const allPredictions = [
    ...statisticalPrediction.predictedNumbers,
    ...patternPrediction.predictedNumbers,
  ]
  
  const uniquePredictions = [...new Set(allPredictions)].slice(0, 15)
  const avgConfidence = (statisticalPrediction.confidence + patternPrediction.confidence) / 2
  
  return {
    predictedNumbers: uniquePredictions,
    confidence: avgConfidence,
    method: 'combined_statistical_pattern',
    analysis: `Combined analysis: ${statisticalPrediction.analysis} ${patternPrediction.analysis}`,
  }
}
