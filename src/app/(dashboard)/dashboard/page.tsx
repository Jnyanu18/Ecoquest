"use client"

import React, { useEffect, useState, useMemo } from 'react'
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
  Award,
  Calendar,
  Loader2
} from "lucide-react"
import { getXPProgress, getLevelFromXP } from "@/lib/gamification-engine"
import { getPersonalizedEcoTips } from "@/ai/flows/personalized-eco-tips"
import { useUser, useDoc, useFirestore } from '@/firebase'
import { doc } from 'firebase/firestore'

export default function StudentDashboard() {
  const { user, loading: authLoading } = useUser()
  const db = useFirestore()
  
  const userRef = useMemo(() => user && db ? doc(db, 'users', user.uid) : null, [user, db])
  const { data: profile, loading: profileLoading } = useDoc(userRef)
  
  const [tips, setTips] = useState<string[]>([])
  const [loadingTips, setLoadingTips] = useState(false)

  const xp = profile?.ecoPoints || 0
  const progress = getXPProgress(xp)
  const currentLevel = getLevelFromXP(xp)

  useEffect(() => {
    async function fetchTips() {
      if (!profile) return;
      setLoadingTips(true)
      try {
        const result = await getPersonalizedEcoTips({
          learningProgressSummary: `Level ${currentLevel} student. XP: ${xp}.`,
          completedTasksSummary: profile.badges || []
        })
        setTips(result.tips)
      } catch (error) {
        setTips(["Reduce meat consumption for 3 days.", "Switch to a bamboo toothbrush."])
      } finally {
        setLoadingTips(false)
      }
    }
    if (profile) fetchTips()
  }, [profile, currentLevel, xp])

  if (authLoading || profileLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Please sign in to view your dashboard</h2>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold mb-1 tracking-tight">Eco Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Active Streak: <span className="text-accent font-bold">{profile?.streak || 0} Days</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-4 py-1.5 border-accent/20 text-accent font-bold">
            {profile?.role === 'student' ? 'Student Hero' : 'Educational Guide'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="accent-glow bg-card/50 border-accent/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total XP</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              {xp}
              <TrendingUp className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>LVL {currentLevel}</span>
                <span>LVL {currentLevel + 1}</span>
              </div>
              <Progress value={progress} className="h-2 bg-muted/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">CO2 Saved</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              {profile?.totalCO2Saved?.toFixed(1) || 0}kg
              <Wind className="w-5 h-5 text-blue-400" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">School Impact</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              Eco-Star
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Role</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              <span className="capitalize">{profile?.role}</span>
              <Award className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-accent/10 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <CardTitle className="font-headline text-xl">AI-Tailored Eco Strategy</CardTitle>
              </div>
              <CardDescription>Hyper-personalized suggestions based on your data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {loadingTips ? (
                  [1, 2, 3].map(i => <div key={i} className="h-14 bg-muted animate-pulse rounded-xl" />)
                ) : tips.length > 0 ? (
                  tips.map((tip, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 group hover:border-accent/30 transition-all cursor-default">
                      <div className="bg-accent/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-accent/20">
                        <span className="text-accent text-[10px] font-bold">{i + 1}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{tip}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Complete tasks to unlock AI suggestions.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-headline text-lg">Active Institutional Challenges</CardTitle>
              <Button variant="link" size="sm" className="text-accent font-bold">BATTLE HUB</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-border/50 bg-card/30 flex items-center justify-between group cursor-pointer hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                    <Recycle className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold">Zero Plastic Week</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Institutional • 200 XP</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-accent/20 bg-card/50">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Impact Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {profile?.badges?.map((badge: string) => (
                  <div key={badge} className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent/5 border border-accent/10 text-center">
                    <span className="text-2xl mb-1">🏅</span>
                    <span className="text-[10px] font-bold uppercase text-accent tracking-tighter">{badge}</span>
                  </div>
                ))}
                {(!profile?.badges || profile.badges.length === 0) && (
                  <div className="col-span-2 text-center py-4 text-xs text-muted-foreground">
                    No badges earned yet. Complete missions!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="eco-gradient text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="font-headline text-accent">School EcoRank</CardTitle>
              <CardDescription className="text-white/70">Institutional Status</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="text-7xl font-headline font-bold mb-2 text-white">B+</div>
              <p className="text-xs text-accent font-bold uppercase tracking-widest">Active Participant</p>
              <Button className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white border-none font-bold">
                VIEW LEADERBOARD
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
