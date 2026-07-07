'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, Star, Calendar, Clock, Zap, Heart } from 'lucide-react'

interface HoroscopeResult {
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

export default function HoroscopePage() {
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [gender, setGender] = useState('')
  const [horoscope, setHoroscope] = useState<HoroscopeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateHoroscope = async () => {
    if (!birthDate) {
      setError('Please enter your birth date')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthTime, gender }),
      })

      const data = await response.json()

      if (data.success) {
        setHoroscope(data.horoscope)
      } else {
        setError(data.error || 'Failed to generate horoscope')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

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
              <p className="text-xs text-gray-400">Horoscope</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard'}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              Chinese Astrology
            </Badge>
            <h1 className="text-3xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                Lucky Numbers from Your Stars
              </span>
            </h1>
            <p className="text-gray-400">
              Combine your zodiac sign with Zi Wei Dou Shu analysis for personalized lottery numbers
            </p>
          </div>

          {/* Input Form */}
          <Card className="bg-white/5 border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Enter Your Birth Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                We'll analyze your stars to generate lucky numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-white">Birth Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthTime" className="text-white">Birth Time (Optional)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="birthTime"
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Gender (Optional)</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={generateHoroscope} 
                  disabled={loading || !birthDate}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {loading ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Lucky Numbers
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Horoscope Results */}
          {horoscope && (
            <div className="space-y-6">
              {/* Zodiac Info */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Your Zodiac Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-gray-400 text-sm">Western Zodiac</p>
                      <p className="text-white text-xl font-bold">{horoscope.zodiacSign}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-gray-400 text-sm">Chinese Zodiac</p>
                      <p className="text-white text-xl font-bold">{horoscope.chineseZodiac}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lucky Numbers */}
              <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Your Lucky Numbers
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Based on your zodiac and Chinese astrology analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {horoscope.luckyNumbers.map((num, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-2xl px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
                      >
                        {num}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Elements */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Five Elements Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(horoscope.elements).map(([element, value]) => (
                      <div key={element} className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl mb-1">
                          {element === 'wood' && '🌳'}
                          {element === 'fire' && '🔥'}
                          {element === 'earth' && '🌍'}
                          {element === 'metal' && '⚙️'}
                          {element === 'water' && '💧'}
                        </div>
                        <p className="text-white text-sm capitalize">{element}</p>
                        <p className="text-gray-400 text-xs">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Analysis */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Star Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{horoscope.analysis}</p>
                </CardContent>
              </Card>

              {/* Lottery Advice */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Lottery Advice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{horoscope.lotteryAdvice}</p>
                </CardContent>
              </Card>

              {/* Use in Predictions */}
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500"
                onClick={() => window.location.href = '/dashboard'}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Use These Numbers in Predictions
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
