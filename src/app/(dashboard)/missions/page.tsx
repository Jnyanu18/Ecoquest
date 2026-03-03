
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Droplets, 
  TreePine, 
  Wind, 
  Recycle, 
  Camera, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

const missions = [
  {
    id: 'm1',
    title: 'Zero Waste Warrior',
    description: 'Ensure a day of zero single-use plastics. Upload a photo of your alternatives.',
    xp: 150,
    impactType: 'Plastic Reduced',
    impactValue: '0.5kg',
    icon: Recycle,
    color: 'text-orange-500'
  },
  {
    id: 'm2',
    title: 'Water Guardian',
    description: 'Fix a leaky tap or optimize shower time. Save 50 liters today.',
    xp: 100,
    impactType: 'Water Saved',
    impactValue: '50L',
    icon: Droplets,
    color: 'text-blue-500'
  },
  {
    id: 'm3',
    title: 'Afforestation Drive',
    description: 'Plant a local tree variety in your school or neighborhood.',
    xp: 300,
    impactType: 'CO2 Offset',
    impactValue: '22kg/yr',
    icon: TreePine,
    color: 'text-green-500'
  }
]

export default function MissionsPage() {
  const [submitting, setSubmitting] = useState<string | null>(null)

  const handleApply = (id: string) => {
    setSubmitting(id)
    // Simulate production-grade submission flow
    setTimeout(() => {
      setSubmitting(null)
      toast({
        title: "Mission Applied",
        description: "Submit your proof photo to earn XP after teacher verification.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold">Active Missions</h1>
        <p className="text-muted-foreground">Real-world impact tasks. Teacher verification required for rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <Card key={mission.id} className="group hover:border-accent/50 transition-all flex flex-col h-full">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg bg-primary/5 ${mission.color}`}>
                  <mission.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="font-bold border-accent/20 text-accent">
                  +{mission.xp} XP
                </Badge>
              </div>
              <CardTitle className="font-headline">{mission.title}</CardTitle>
              <CardDescription className="min-h-[48px]">{mission.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="bg-muted/30 rounded-lg p-3 flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">{mission.impactType}</span>
                <span className="font-bold text-foreground">{mission.impactValue}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                className="w-full bg-primary/10 hover:bg-primary/20 text-foreground border border-primary/20"
                onClick={() => handleApply(mission.id)}
                disabled={submitting === mission.id}
              >
                {submitting === mission.id ? (
                  "Initiating..."
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Apply & Submit Proof
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="border-accent/10">
        <CardHeader>
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            Verification Pipeline
          </CardTitle>
          <CardDescription>Status of your recent mission submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <div>
                  <p className="font-bold">Compost Submission #142</p>
                  <p className="text-xs text-muted-foreground">Awaiting Teacher Verification</p>
                </div>
              </div>
              <Badge variant="secondary">In Review</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
