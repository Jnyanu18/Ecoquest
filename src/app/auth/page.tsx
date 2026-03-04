
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Loader2, LogIn, UserPlus } from "lucide-react"
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "@/hooks/use-toast"
import { useFirebase } from '@/firebase'

export default function AuthPage() {
  const { auth, firestore } = useFirebase()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'student' | 'teacher'>('student')

  const handleAuthSuccess = async (user: any, isNew: boolean, selectedRole?: string) => {
    const userRef = doc(firestore, 'users', user.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      // Provision profile if it doesn't exist
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || 'Eco Hero',
        role: selectedRole || 'student',
        schoolId: 'S-GLOBAL-001', // Default school for demo
        ecoPoints: 0,
        level: 1,
        streak: 0,
        badges: [],
        totalCO2Saved: 0,
        createdAt: serverTimestamp()
      })
    }
    
    toast({ title: isNew ? "Account Created" : "Welcome Back!", description: "Redirecting to your dashboard..." })
    router.push('/dashboard')
  }

  const onEmailAuth = async (e: React.FormEvent<HTMLFormElement>, type: 'login' | 'signup') => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      if (type === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(res.user, { displayName: name })
        await handleAuthSuccess(res.user, true, role)
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password)
        await handleAuthSuccess(res.user, false)
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Authentication Error", description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const onGoogleSignIn = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)
      await handleAuthSuccess(res.user, false)
    } catch (error: any) {
      toast({ variant: "destructive", title: "Google Sign-In Failed", description: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="bg-primary p-2 rounded-lg">
          <Leaf className="w-6 h-6 text-accent" />
        </div>
        <span className="font-headline font-bold text-2xl">EcoQuest</span>
      </div>

      <Card className="w-full max-w-md border-accent/20 accent-glow">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Join the Mission</CardTitle>
          <CardDescription>Empowering the next generation of eco-leaders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={(e) => onEmailAuth(e, 'login')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="hero@school.edu" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button className="w-full bg-accent text-accent-foreground font-bold" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => onEmailAuth(e, 'signup')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Arjun Kumar" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input id="signup-email" name="email" type="email" placeholder="hero@school.edu" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" required />
                </div>
                <div className="space-y-3 pt-2">
                  <Label>I am a...</Label>
                  <RadioGroup defaultValue="student" onValueChange={(val: any) => setRole(val)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="r1" />
                      <Label htmlFor="r1">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teacher" id="r2" />
                      <Label htmlFor="r2">Teacher/Admin</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button className="w-full bg-accent text-accent-foreground font-bold" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
            </div>

            <Button variant="outline" className="w-full border-accent/20" onClick={onGoogleSignIn} disabled={loading}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
