
"use client"

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  School, 
  Leaf, 
  Trophy, 
  TrendingUp, 
  ShieldCheck,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { useFirestore, useCollection, useDoc } from '@/firebase'
import { collection, query, where, orderBy, limit } from 'firebase/firestore'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

export default function TeacherDashboard() {
  const db = useFirestore()
  
  // Real school data (using demo ID)
  const schoolRef = useMemo(() => db ? doc(db, 'schools', 'S-GLOBAL-001') : null, [db])
  const { data: school, loading: schoolLoading } = useDoc(schoolRef)

  // Real student metrics
  const studentsQuery = useMemo(() => 
    db ? query(collection(db, 'users'), where('schoolId', '==', 'S-GLOBAL-001'), orderBy('ecoPoints', 'desc'), limit(5)) : null, 
    [db]
  )
  const { data: topStudents, loading: studentsLoading } = useCollection(studentsQuery)

  // Submissions for verification overview
  const pendingQuery = useMemo(() => 
    db ? query(collection(db, 'submissions'), where('status', '==', 'pending'), limit(10)) : null, 
    [db]
  )
  const { data: pendingActions } = useCollection(pendingQuery)

  const impactData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 38 },
    { name: 'Thu', value: 65 },
    { name: 'Fri', value: 48 },
    { name: 'Sat', value: 30 },
    { name: 'Sun', value: 20 },
  ]

  if (schoolLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold mb-1">Institutional Hub</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <School className="w-4 h-4" />
            Administering: <span className="text-accent font-bold">{school?.name || 'Green Valley International'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Card className="bg-accent/10 border-accent/20 px-4 py-2 flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-accent" />
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pending Verifications</p>
               <p className="text-lg font-bold">{pendingActions?.length || 0}</p>
             </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase">Total CO2 Reduced</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              {school?.totalCO2Reduced || 1240}kg
              <Leaf className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase">Eco Points Earned</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              {school?.totalPoints || 15800}
              <Trophy className="w-5 h-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase">Institutional Rank</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              #4
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase">Active Students</CardDescription>
            <CardTitle className="text-3xl font-headline flex items-center justify-between">
              450+
              <Users className="w-5 h-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Sustainability Activity Trend</CardTitle>
            <CardDescription>Daily verified eco-tasks completed across the institution.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1d231a', border: '1px solid #3b5c23' }}
                  itemStyle={{ color: '#6aed5e' }}
                />
                <Bar dataKey="value" fill="#6aed5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Eco Champions</CardTitle>
            <CardDescription>Top contributors this month.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {studentsLoading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            ) : topStudents?.map((student: any, i) => (
              <div key={student.uid} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                    {i+1}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{student.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Level {student.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">{student.ecoPoints} XP</p>
                  <Progress value={(student.ecoPoints / 2000) * 100} className="w-20 h-1 mt-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="font-headline">Low Engagement Modules</CardTitle>
              <CardDescription>Courses with < 20% completion rate.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
               <li className="flex justify-between text-sm">
                 <span>Advanced Permaculture</span>
                 <span className="text-yellow-500 font-bold">12%</span>
               </li>
               <li className="flex justify-between text-sm">
                 <span>Water Scarcity Analytics</span>
                 <span className="text-yellow-500 font-bold">18%</span>
               </li>
             </ul>
          </CardContent>
        </Card>
        
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="font-headline">Institutional Verification</CardTitle>
              <CardDescription>Audit transparency and integrity score.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
             <div className="flex items-end gap-2">
               <span className="text-4xl font-headline font-bold text-blue-400">98%</span>
               <span className="text-xs text-muted-foreground pb-1">Accuracy Rating</span>
             </div>
             <p className="text-xs mt-2 text-muted-foreground italic">Your school is in the top 5% for proof-of-work quality.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { doc } from 'firebase/firestore'
