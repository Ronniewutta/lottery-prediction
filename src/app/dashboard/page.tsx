'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, TrendingUp, Calendar, Star, Zap, Target, BarChart3, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Prediction {
  numbers: string[]
  confidence: number
  method: string
  analysis: string
  generatedAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState('thai')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const lotteryTypes = [
    { id: 'thai', name: 'Thai Lottery', icon: '🇹🇭' },
    { id: 'vietnam', name: 'Vietnam XSMB', icon: '🇻🇳' },
    { id: 'laos', name: 'Laos Lottery', icon: '🇱🇦' },
  ]

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
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push('/horoscope')}>
              Horoscope
            </Button>
            <span className="text-white text-sm">{session.user?.name || session.user?.email}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-xs text-gray-400">Lottery Systems</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">150+</p>
                  <p className="text-xs text-gray-400">Historical Draws</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">AI</p>
                  <p className="text-xs text-gray-400">Prediction Engine</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Free</p>
                  <p className="text-xs text-gray-400">All Features</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Section */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              AI Predictions
            </CardTitle>
            <CardDescription className="text-gray-400">
              Generate AI-powered predictions for your chosen lottery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                  <div className="space-y-4">
                    {predictions[type.id] ? (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {predictions[type.id].numbers.map((num, idx) => (
                            <Badge key={idx} variant="secondary" className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                              {num}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            Confidence: {(predictions[type.id].confidence * 100).toFixed(1)}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(predictions[type.id].generatedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{predictions[type.id].analysis}</p>
                        <Button 
                          onClick={() => generatePrediction(type.id)}
                          disabled={loading[type.id]}
                          variant="outline"
                        >
                          {loading[type.id] ? 'Generating...' : 'Generate New Prediction'}
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Button 
                          onClick={() => generatePrediction(type.id)}
                          disabled={loading[type.id]}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500"
                          size="lg"
                        >
                          {loading[type.id] ? (
                            <>Generating...</>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-2" />
                              Generate Prediction
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => router.push('/horoscope')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Horoscope</h3>
                  <p className="text-sm text-gray-400">Get lucky numbers from your zodiac</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Statistics</h3>
                  <p className="text-sm text-gray-400">View historical data analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Draw Schedule</h3>
                  <p className="text-sm text-gray-400">Upcoming lottery draws</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
