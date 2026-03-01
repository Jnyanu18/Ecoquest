"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Clock, 
  User, 
  Image as ImageIcon,
  MessageSquare
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const pendingTasks = [
  {
    id: 's1',
    student: 'Maya Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    task: 'Plant a Sapling',
    date: '2 hours ago',
    location: 'School Garden, Sector 4',
    image: 'https://picsum.photos/seed/sap1/400/300',
    description: 'I planted a Hibiscus sapling in my local community garden today. Ensuring it gets daily water.',
    xp: 150
  },
  {
    id: 's2',
    student: 'Rahul V.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    task: 'Zero Plastic Day',
    date: '5 hours ago',
    location: 'Home',
    image: 'https://picsum.photos/seed/plas1/400/300',
    description: 'Managed to avoid all single-use plastics today. Used my cloth bag and steel water bottle everywhere.',
    xp: 200
  }
]

export default function AdminVerification() {
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  const handleFeedbackChange = (id: string, text: string) => {
    setFeedback(prev => ({ ...prev, [id]: text }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold mb-2">Verification Queue</h1>
        <p className="text-muted-foreground">Review and approve student eco-task submissions.</p>
      </div>

      <div className="space-y-6">
        {pendingTasks.map((submission) => (
          <Card key={submission.id} className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 relative h-64 lg:h-auto border-r border-border/50">
                <img 
                  src={submission.image} 
                  alt="Proof" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/60 backdrop-blur-md text-white border-none flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Photo Proof
                  </Badge>
                </div>
              </div>
              <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={submission.avatar} />
                      <AvatarFallback>{submission.student[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{submission.student}</h3>
                      <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Student • Class 9-B
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 border-primary/30">
                      <Clock className="w-3 h-3" />
                      {submission.date}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 border-primary/30">
                      <MapPin className="w-3 h-3" />
                      {submission.location}
                    </Badge>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-headline font-bold text-accent mb-2 uppercase tracking-wide text-xs">Submission Details</h4>
                  <h2 className="text-xl font-bold mb-2">{submission.task}</h2>
                  <p className="text-muted-foreground leading-relaxed italic border-l-2 border-accent/50 pl-4 py-1">
                    "{submission.description}"
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1 mb-2">
                      <MessageSquare className="w-3 h-3" />
                      Feedback for Student
                    </label>
                    <Textarea 
                      placeholder="Add feedback for approval or reason for rejection..." 
                      className="bg-background/50"
                      value={feedback[submission.id] || ''}
                      onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Reward {submission.xp} XP
                    </Button>
                    <Button variant="outline" className="flex-1 border-destructive/20 text-destructive hover:bg-destructive/10">
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Submission
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {pendingTasks.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-headline text-xl font-bold">Queue is Empty!</h3>
            <p className="text-muted-foreground">All student submissions have been verified.</p>
          </div>
        )}
      </div>
    </div>
  )
}