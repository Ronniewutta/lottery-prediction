'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, TrendingUp, Calendar, Star, Zap, Target } from 'lucide-react'

interface Prediction {
  numbers: string[]
  confidence: number
  method: string
  analysis: string
  generatedAt: string
}

interface LotteryStats {
  totalDraws: number
  lastDraw: string
  hotNumbers: string[]
  coldNumbers: string[]
}

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [stats, setStats] = useState<Record<string, LotteryStats>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState('thai')

  const lotteryTypes = [
    { id: 'thai', name: 'Thai Lottery', icon: '🇹🇭', color: 'from-blue-500 to-purple-600' },
    { id: 'vietnam', name: 'Vietnam XSMB', icon: '🇻🇳', color: 'from-red-500 to-yellow-500' },
    { id: 'laos', name: 'Laos Lottery', icon: '🇱🇦', color: 'from-blue-400 to-red-500' },
  ]

  const generatePrediction = async (type: string) => {
    setLoading(prev => ({ ...prev, [type]: true }))
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotteryType: type }),
      })
      const data = await response.json()
      if (data.success) {
        setPredictions(prev => ({ ...prev, [type]: data.prediction }))
      }
    } catch (error) {
      console.error('Error generating prediction:', error)
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }))
    }
  }

  const fetchStats = async (type: string) => {
    try {
      const response = await fetch(`/api/lottery?type=${type}&limit=50`)
      const data = await response.json()
      if (data.success) {
        setStats(prev => ({
          ...prev,
          [type]: {
            totalDraws: data.count,
            lastDraw: data.draws[0]?.drawDate || 'N/A',
            hotNumbers: calculateHotNumbers(data.draws),
            coldNumbers: calculateColdNumbers(data.draws),
          },
        }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const calculateHotNumbers = (draws: any[]): string[] => {
    const frequency: Record<string, number> = {}
    draws.forEach(draw => {
      const numbers = draw.firstPrize || ''
      for (const digit of numbers) {
        frequency[digit] = (frequency[digit] || 0) + 1
      }
    })
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([digit]) => digit)
  }

  const calculateColdNumbers = (draws: any[]): string[] => {
    const frequency: Record<string, number> = {}
    draws.forEach(draw => {
      const numbers = draw.firstPrize || ''
      for (const digit of numbers) {
        frequency[digit] = (frequency[digit] || 0) + 1
      }
    })
    return Object.entries(frequency)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 5)
      .map(([digit]) => digit)
  }

  useEffect(() => {
    lotteryTypes.forEach(type => fetchStats(type.id))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LOTTO AI</h1>
              <p className="text-xs text-gray-400">Smart Prediction System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-white text-sm">{session.user?.name || session.user?.email}</span>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => router.push('/register')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-4">
          AI-Powered Predictions
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            LOTTO AI
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Smart lottery prediction system with horoscope integration for Thai, Vietnam, and Laos lotteries.
          Powered by AI and statistical analysis.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => router.push('/register')}>
            <Zap className="w-5 h-5 mr-2" />
            Start Predicting
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push('/dashboard')}>
            <TrendingUp className="w-5 h-5 mr-2" />
            View Statistics
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Why Choose LOTTO AI?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">AI Predictions</CardTitle>
              <CardDescription className="text-gray-400">
                Advanced statistical analysis and pattern recognition for smarter predictions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Horoscope Integration</CardTitle>
              <CardDescription className="text-gray-400">
                Combine AI with your zodiac and Chinese astrology for personalized lucky numbers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">Multi-Lottery Support</CardTitle>
              <CardDescription className="text-gray-400">
                Thai, Vietnam XSMB, and Laos lottery predictions all in one place
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Live Predictions Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Live Predictions
        </h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            {lotteryTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id} className="data-[state=active]:bg-white/10">
                <span className="mr-2">{type.icon}</span>
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {lotteryTypes.map(type => (
            <TabsContent key={type.id} value={type.id}>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">{type.icon}</span>
                    {type.name} Prediction
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    AI-generated prediction for the next draw
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {predictions[type.id] ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {predictions[type.id].numbers.map((num, idx) => (
                          <Badge key={idx} variant="secondary" className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                            {num}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Confidence: {(predictions[type.id].confidence * 100).toFixed(1)}%</span>
                        <span>Method: {predictions[type.id].method}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{predictions[type.id].analysis}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Button 
                        onClick={() => generatePrediction(type.id)}
                        disabled={loading[type.id]}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500"
                      >
                        {loading[type.id] ? (
                          <>Generating...</>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Prediction
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {stats[type.id] && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-white font-medium mb-3">Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Total Draws: </span>
                          <span className="text-white">{stats[type.id].totalDraws}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Hot Numbers: </span>
                          <span className="text-white">{stats[type.id].hotNumbers.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">LOTTO AI</span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              For entertainment purposes only. Please gamble responsibly.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
