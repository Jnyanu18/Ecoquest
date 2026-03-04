"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Droplets, 
  TreePine, 
  Recycle, 
  Camera, 
  CheckCircle2, 
  Loader2,
  Wind
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useUser, useCollection, useFirestore } from '@/firebase'
import { collection, addDoc, serverTimestamp, query, where } from 'firebase/firestore'
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError } from '@/firebase/errors'

export default function MissionsPage() {
  const { user } = useUser()
  const db = useFirestore()
  const [submitting, setSubmitting] = useState<string | null>(null)

  const missionsQuery = useMemo(() => db ? query(collection(db, 'missions'), where('status', '==', 'approved')) : null, [db])
  const { data: missions, loading } = useCollection(missionsQuery)

  const submissionsQuery = useMemo(() => 
    db && user ? query(collection(db, 'submissions'), where('studentId', '==', user.uid)) : null, 
    [db, user]
  )
  const { data: mySubmissions } = useCollection(submissionsQuery)

  const handleApply = (mission: any) => {
    if (!user || !db) return
    setSubmitting(mission.id)

    const submissionData = {
      missionId: mission.id,
      studentId: user.uid,
      schoolId: user.photoURL || 'default-school', // Using photoURL as a temporary store for schoolId if needed, or get from profile
      proofUrl: 'https://picsum.photos/seed/proof/600/400', // Mock upload URL
      status: 'pending',
      submittedAt: serverTimestamp()
    }

    addDoc(collection(db, 'submissions'), submissionData)
      .then(() => {
        toast({
          title: "Mission Submitted",
          description: "Proof uploaded! Awaiting teacher verification.",
        })
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'submissions',
          operation: 'create',
          requestResourceData: submissionData,
        })
        errorEmitter.emit('permission-error', permissionError)
      })
      .finally(() => setSubmitting(null))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'plastic': return Recycle
      case 'water': return Droplets
      case 'trees': return TreePine
      case 'co2': return Wind
      default: return Recycle
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold">Active Missions</h1>
        <p className="text-muted-foreground">Real-world impact tasks. Teacher verification required for rewards.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions?.map((mission: any) => {
            const Icon = getIcon(mission.impactType)
            const isSubmitted = mySubmissions?.some(s => s.missionId === mission.id && s.status === 'pending')
            
            return (
              <Card key={mission.id} className="group hover:border-accent/50 transition-all flex flex-col h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 rounded-lg bg-primary/5 text-accent">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="font-bold border-accent/20 text-accent">
                      +{mission.points} XP
                    </Badge>
                  </div>
                  <CardTitle className="font-headline">{mission.title}</CardTitle>
                  <CardDescription className="min-h-[48px]">{mission.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="bg-muted/30 rounded-lg p-3 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium capitalize">{mission.impactType} Offset</span>
                    <span className="font-bold text-foreground">{mission.impactValue}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full bg-primary/10 hover:bg-primary/20 text-foreground border border-primary/20"
                    onClick={() => handleApply(mission)}
                    disabled={submitting === mission.id || isSubmitted}
                  >
                    {submitting === mission.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : isSubmitted ? (
                      "Already Submitted"
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Apply & Submit Proof
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

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
            {mySubmissions && mySubmissions.length > 0 ? (
              mySubmissions.map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${sub.status === 'pending' ? 'bg-yellow-500 animate-pulse' : sub.status === 'verified' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-bold">Submission #{sub.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">
                        {sub.status === 'pending' ? 'Awaiting Teacher Verification' : `Status: ${sub.status}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={sub.status === 'verified' ? 'default' : 'secondary'} className="capitalize">
                    {sub.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No submissions found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
