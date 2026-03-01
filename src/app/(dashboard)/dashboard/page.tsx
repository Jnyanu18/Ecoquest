"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TreePine, 
  Droplets, 
  Wind, 
  Recycle, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react"
import { MOCK_USER } from "@/lib/constants"
import { getPersonalizedEcoTips } from "@/ai/flows/personalized-eco-tips"

export default function StudentDashboard() {
  const [tips, setTips] = useState<string[]>([])
  const [loadingTips, setLoadingTips] = useState(true)

  useEffect(() => {
    async function fetchTips() {
      try {
        const result = await getPersonalizedEcoTips({
          learningProgressSummary: `Completed ${MOCK_USER.level} levels. Average quiz score 85%. Strong in waste management.`,
          completedTasksSummary: ["Planted 2 saplings", "1 week plastic-free"]
        })
        setTips(result.tips)
      } catch (error) {
        console.error("Failed to fetch tips", error)
        setTips(["Try using a reusable water bottle today!", "Turn off lights when leaving the room."])
      } finally {
        setLoadingTips(false)
      }
    }
    fetchTips()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold mb-2">Welcome back, {MOCK_USER.name}!</h1>
        <p className="text-muted-foreground">You're on a 5-day streak. Keep it up!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="accent-glow">
          <CardHeader className="pb-2">
            <CardDescription>Experience Points</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              {MOCK_USER.xp} XP
              <TrendingUp className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Level {MOCK_USER.level}</span>
                <span>Level {MOCK_USER.level + 1}</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Trees Planted</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              {MOCK_USER.stats.treesPlanted}
              <TreePine className="w-5 h-5 text-green-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>CO₂ Offset</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              {MOCK_USER.stats.co2SavedKg}kg
              <Wind className="w-5 h-5 text-blue-400" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Water Saved</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              {MOCK_USER.stats.waterSavedLiters}L
              <Droplets className="w-5 h-5 text-cyan-500" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <CardTitle className="font-headline">AI-Powered Eco Tips</CardTitle>
              </div>
              <CardDescription>Personalized suggestions based on your recent activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {loadingTips ? (
                  [1, 2, 3].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />)
                ) : (
                  tips.map((tip, i) => (
                    <li key={i} className="flex gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                      <div className="bg-accent/20 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-accent text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{tip}</p>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Active Challenges</CardTitle>
              <Button variant="link" size="sm" className="text-accent">View All</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-border/50 bg-card/30 flex items-center justify-between group cursor-pointer hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                    <Recycle className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold">Zero Plastic Week</h4>
                    <p className="text-sm text-muted-foreground">5 days remaining • 200 XP</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="p-4 rounded-xl border border-border/50 bg-card/30 flex items-center justify-between group cursor-pointer hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <TreePine className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold">Plant a Sapling</h4>
                    <p className="text-sm text-muted-foreground">One-time task • 150 XP</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Recent Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {MOCK_USER.badges.map(badge => (
                  <Badge key={badge} variant="secondary" className="px-3 py-1 bg-primary/20 text-accent border-accent/20">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="eco-gradient text-white border-none">
            <CardHeader>
              <CardTitle className="font-headline text-accent">School EcoScore</CardTitle>
              <CardDescription className="text-white/70">Green Valley High Ranking</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="text-6xl font-headline font-bold mb-2">A+</div>
              <p className="text-sm text-accent font-medium">Top 5% Schools Nationally</p>
              <Button className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white border-none">
                View School Battle
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}