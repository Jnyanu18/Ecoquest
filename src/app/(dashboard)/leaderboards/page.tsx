"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Crown, TrendingUp, Users, School } from "lucide-react"

const topStudents = [
  { rank: 1, name: 'Arjun K.', school: 'Green Valley', xp: 4250, avatar: '1' },
  { rank: 2, name: 'Sara Miller', school: 'Pine Hill Academy', xp: 3980, avatar: '2' },
  { rank: 3, name: 'John Doe', school: 'Green Valley', xp: 3720, avatar: '3' },
  { rank: 4, name: 'Zoya Q.', school: 'Oasis High', xp: 3500, avatar: '4' },
  { rank: 5, name: 'Kevin Lee', school: 'Oasis High', xp: 3420, avatar: '5' },
]

const topSchools = [
  { rank: 1, name: 'Green Valley High', ecoScore: 98, impact: '1.2t CO2', students: 450 },
  { rank: 2, name: 'Oasis International', ecoScore: 94, impact: '0.9t CO2', students: 320 },
  { rank: 3, name: 'Pine Hill Academy', ecoScore: 91, impact: '0.7t CO2', students: 280 },
]

export default function Leaderboards() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold mb-2">Global Leaderboards</h1>
        <p className="text-muted-foreground">See how you and your school compare in the EcoQuest mission.</p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-8">
          <TabsTrigger value="students" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            Top Students
          </TabsTrigger>
          <TabsTrigger value="schools" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            School Eco Battle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {topStudents.slice(0, 3).map((student, i) => (
              <Card key={student.name} className={`relative overflow-hidden ${i === 0 ? 'accent-glow border-accent/50 scale-105 z-10' : ''}`}>
                <CardContent className="pt-10 text-center">
                  <div className="absolute top-4 left-4">
                    {i === 0 ? <Crown className="w-6 h-6 text-yellow-500" /> : <Medal className={`w-6 h-6 ${i === 1 ? 'text-gray-400' : 'text-amber-700'}`} />}
                  </div>
                  <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-muted">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-headline font-bold text-xl">{student.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{student.school}</p>
                  <div className="bg-accent/10 rounded-full py-1.5 px-4 inline-flex items-center gap-2 text-accent font-bold">
                    <TrendingUp className="w-4 h-4" />
                    {student.xp} XP
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {topStudents.map((student) => (
                  <div key={student.name} className="flex items-center justify-between p-4 hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-headline font-bold text-lg w-8 text-center text-muted-foreground">#{student.rank}</span>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold">{student.name}</h4>
                        <p className="text-xs text-muted-foreground">{student.school}</p>
                      </div>
                    </div>
                    <div className="font-bold text-accent">{student.xp} XP</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools">
          <div className="grid gap-6">
            {topSchools.map((school) => (
              <Card key={school.name} className="overflow-hidden group hover:border-accent/50 transition-colors">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="md:w-16 bg-muted/30 flex items-center justify-center font-headline text-2xl font-bold border-r border-border/50">
                    {school.rank}
                  </div>
                  <div className="flex-1 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <School className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-xl">{school.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {school.students} Students</span>
                          <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {school.impact} saved</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-xs font-bold uppercase text-muted-foreground mb-1 tracking-widest">EcoScore</div>
                      <div className="text-4xl font-headline font-bold text-accent">{school.ecoScore}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}