
"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Loader2,
  BrainCircuit,
  Zap
} from "lucide-react"
import { summarizeLearningModule } from "@/ai/flows/ai-module-summaries"
import { generateQuiz, type QuizGenerationOutput } from "@/ai/flows/ai-quiz-generation"
import { toast } from "@/hooks/use-toast"

const MODULE_DATA: Record<string, any> = {
  'm1': {
    title: 'Plastic & Our Oceans',
    content: `The ocean is the heart of our planet, but it's suffering from a plastic plague. Over 8 million tons of plastic enter our oceans every year. Most of this is single-use plastic—bottles, straws, and packaging. These plastics don't biodegrade; they fragment into microplastics which enter the food chain, harming marine life and eventually humans. Understanding the circular economy and reducing personal plastic consumption is the first step toward planetary healing.`,
    image: 'https://picsum.photos/seed/ocean1/800/400'
  },
  'm2': {
    title: 'Solar Power Basics',
    content: `Solar energy is the most abundant energy resource on Earth. Photovoltaic cells convert sunlight directly into electricity using the photoelectric effect. By decentralizing energy production through rooftop solar, we reduce reliance on coal-fired power plants, which are the leading cause of global CO2 emissions. This module covers how solar panels work, the role of inverters, and the economics of grid-tied systems.`,
    image: 'https://picsum.photos/seed/solar1/800/400'
  }
}

export default function ModuleDetail() {
  const { moduleId } = useParams()
  const router = useRouter()
  const module = MODULE_DATA[moduleId as string]

  const [summary, setSummary] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<QuizGenerationOutput | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [quizMode, setQuizMode] = useState(false)
  const [quizResults, setQuizResults] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  if (!module) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Module not found</h2>
        <Button onClick={() => router.push('/learn')} className="mt-4">Back to Learning Hub</Button>
      </div>
    )
  }

  const handleGenerateSummary = async () => {
    setLoadingAI(true)
    try {
      const res = await summarizeLearningModule(module.content)
      setSummary(res.summary)
      toast({ title: "AI Summary Ready", description: "The core concepts have been distilled for you." })
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to summarize content." })
    } finally {
      setLoadingAI(false)
    }
  }

  const handleGenerateQuiz = async () => {
    setLoadingAI(true)
    try {
      const res = await generateQuiz({ learningContent: module.content, numQuestions: 3 })
      setQuiz(res)
      setQuizMode(true)
      toast({ title: "AI Quiz Generated", description: "Test your mastery of the material." })
    } catch (e) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to generate quiz." })
    } finally {
      setLoadingAI(false)
    }
  }

  const calculateScore = () => {
    if (!quiz) return 0
    let correct = 0
    quiz.questions.forEach((q, i) => {
      if (quizResults[i] === q.correctAnswer) correct++
    })
    return (correct / quiz.questions.length) * 100
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.push('/learn')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Hub
      </Button>

      <div className="relative h-[300px] w-full rounded-2xl overflow-hidden border border-accent/20">
        <img src={module.image} alt={module.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
          <Badge className="w-fit mb-4 bg-accent text-accent-foreground border-none">Active Module</Badge>
          <h1 className="text-4xl font-headline font-bold text-white">{module.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Study Material
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {module.content}
              </p>
            </CardContent>
          </Card>

          {summary && (
            <Card className="bg-accent/5 border-accent/20 accent-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Sparkles className="w-5 h-5" />
                  AI Concept Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic leading-relaxed text-foreground">
                  "{summary}"
                </p>
              </CardContent>
            </Card>
          )}

          {quizMode && quiz && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="font-headline">{quiz.title}</CardTitle>
                <CardDescription>{quiz.instructions || 'Answer the questions based on the text above.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {quiz.questions.map((q, i) => (
                  <div key={i} className="space-y-4">
                    <p className="font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs">{i+1}</span>
                      {q.questionText}
                    </p>
                    <div className="grid gap-2">
                      {q.type === 'multiple-choice' && q.options?.map(opt => (
                        <Button 
                          key={opt}
                          variant={quizResults[i] === opt ? "default" : "outline"}
                          className={`justify-start text-left h-auto py-3 px-4 ${showResults && opt === q.correctAnswer ? 'border-green-500 bg-green-500/10' : ''}`}
                          onClick={() => !showResults && setQuizResults({...quizResults, [i]: opt})}
                          disabled={showResults}
                        >
                          {opt}
                        </Button>
                      ))}
                      {q.type === 'true-false' && ['True', 'False'].map(opt => (
                        <Button 
                          key={opt}
                          variant={quizResults[i] === opt ? "default" : "outline"}
                          className={`justify-start text-left h-auto py-3 px-4 ${showResults && opt === q.correctAnswer ? 'border-green-500 bg-green-500/10' : ''}`}
                          onClick={() => !showResults && setQuizResults({...quizResults, [i]: opt})}
                          disabled={showResults}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                    {showResults && q.explanation && (
                      <p className="text-xs text-muted-foreground italic pl-8">💡 {q.explanation}</p>
                    )}
                  </div>
                ))}
                
                {!showResults ? (
                  <Button 
                    className="w-full bg-accent text-accent-foreground font-bold"
                    onClick={() => setShowResults(true)}
                  >
                    Submit Quiz & Finalize Module
                  </Button>
                ) : (
                  <div className="text-center p-6 bg-accent/10 rounded-2xl border border-accent/20">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Mastery Score</p>
                    <h2 className="text-4xl font-headline font-bold text-accent">{calculateScore()}%</h2>
                    <p className="text-sm mt-4">Module Complete! +50 XP Awarded.</p>
                    <Button variant="link" onClick={() => router.push('/learn')} className="mt-4 text-accent">Back to Modules</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Mastery Hub</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start gap-3 bg-primary/10 hover:bg-primary/20 text-foreground"
                onClick={handleGenerateSummary}
                disabled={loadingAI || summary !== null}
              >
                {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-accent" />}
                AI Concept Distiller
              </Button>
              <Button 
                className="w-full justify-start gap-3 bg-primary/10 hover:bg-primary/20 text-foreground"
                onClick={handleGenerateQuiz}
                disabled={loadingAI || quizMode}
              >
                {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4 text-accent" />}
                Generate AI Quiz
              </Button>
            </CardContent>
          </Card>

          <Card className="eco-gradient text-white border-none">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Module Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Base XP</span>
                <span className="font-bold">100 XP</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">AI Mastery Bonus</span>
                <span className="font-bold text-accent">+50 XP</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Badge Unlock</span>
                <span className="font-bold">Ocean Protector</span>
              </div>
              <Progress value={45} className="h-1 bg-white/10" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
