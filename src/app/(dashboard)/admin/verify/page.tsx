"use client"

import React, { useState, useMemo } from 'react'
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
  MessageSquare,
  Loader2
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useFirestore, useCollection } from '@/firebase'
import { collection, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError } from '@/firebase/errors'
import { toast } from '@/hooks/use-toast'

export default function AdminVerification() {
  const db = useFirestore()
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const submissionsQuery = useMemo(() => 
    db ? query(collection(db, 'submissions'), where('status', '==', 'pending')) : null, 
    [db]
  )
  const { data: pendingSubmissions, loading } = useCollection(submissionsQuery)

  const handleAction = (submissionId: string, status: 'verified' | 'rejected') => {
    if (!db) return
    setActionLoading(submissionId)
    
    const submissionRef = doc(db, 'submissions', submissionId)
    const updateData = {
      status,
      feedback: feedback[submissionId] || '',
      verifiedAt: serverTimestamp()
    }

    updateDoc(submissionRef, updateData)
      .then(() => {
        toast({
          title: status === 'verified' ? "Submission Approved" : "Submission Rejected",
          description: `Submission has been marked as ${status}.`,
        })
      })
      .catch(async () => {
        const permissionError = new FirestorePermissionError({
          path: submissionRef.path,
          operation: 'update',
          requestResourceData: updateData,
        })
        errorEmitter.emit('permission-error', permissionError)
      })
      .finally(() => setActionLoading(null))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold mb-2">Verification Queue</h1>
        <p className="text-muted-foreground">Review and approve student eco-task submissions.</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : pendingSubmissions && pendingSubmissions.length > 0 ? (
          pendingSubmissions.map((submission: any) => (
            <Card key={submission.id} className="overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 relative h-64 lg:h-auto border-r border-border/50">
                  <img 
                    src={submission.proofUrl} 
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
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.studentId}`} />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">Student ID: {submission.studentId.slice(0, 8)}</h3>
                        <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                          <User className="w-3 h-3" />
                          Institutional Participant
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="flex items-center gap-1 border-primary/30">
                        <Clock className="w-3 h-3" />
                        {submission.submittedAt?.toDate().toLocaleDateString() || 'Recently'}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-headline font-bold text-accent mb-2 uppercase tracking-wide text-xs">Submission Details</h4>
                    <h2 className="text-xl font-bold mb-2">Mission ID: {submission.missionId}</h2>
                    <p className="text-muted-foreground leading-relaxed italic border-l-2 border-accent/50 pl-4 py-1">
                      "Real-time student proof for verified task completion."
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
                        onChange={(e) => setFeedback(prev => ({ ...prev, [submission.id]: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button 
                        className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                        disabled={actionLoading === submission.id}
                        onClick={() => handleAction(submission.id, 'verified')}
                      >
                        {actionLoading === submission.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                        Approve & Reward XP
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-destructive/20 text-destructive hover:bg-destructive/10"
                        disabled={actionLoading === submission.id}
                        onClick={() => handleAction(submission.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Submission
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
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
