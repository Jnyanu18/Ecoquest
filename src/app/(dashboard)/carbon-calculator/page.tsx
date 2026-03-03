
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CARBON_COEFFICIENTS } from "@/lib/constants"
import { Calculator, Leaf, TrendingDown, Info } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getEcoMentorAdvice } from "@/ai/flows/ai-eco-mentor"

export default function CarbonCalculator() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ total: number; tips?: any } | null>(null)

  const [formData, setFormData] = useState({
    carKM: 0,
    busKM: 0,
    electricity: 0,
    diet: 'VEG'
  })

  const calculateImpact = async () => {
    setLoading(true)
    try {
      const travelCO2 = (formData.carKM * CARBON_COEFFICIENTS.TRAVEL.CAR) + 
                       (formData.busKM * CARBON_COEFFICIENTS.TRAVEL.BUS)
      const energyCO2 = formData.electricity * CARBON_COEFFICIENTS.ELECTRICITY
      const foodCO2 = (CARBON_COEFFICIENTS.FOOD as any)[formData.diet] * 30 // 30 days
      
      const total = travelCO2 + energyCO2 + foodCO2

      // Call AI Mentor for personalized insights
      const aiAdvice = await getEcoMentorAdvice({
        studentName: "Alex",
        monthlyCO2: total,
        recentActivities: ["Planted 2 trees", "Recycled plastic"],
        dietType: formData.diet,
        travelMode: formData.carKM > formData.busKM ? "Car" : "Bus"
      })

      setResults({ total, tips: aiAdvice })
      toast({
        title: "Report Generated",
        description: "Your monthly carbon footprint has been calculated.",
      })
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: "Please check your inputs and try again."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold">Carbon Calculator</h1>
        <p className="text-muted-foreground">Track your monthly environmental footprint using production-grade coefficients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-accent" />
              Monthly Data Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Travel by Car (KM)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                onChange={(e) => setFormData({...formData, carKM: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>Travel by Bus (KM)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                onChange={(e) => setFormData({...formData, busKM: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>Electricity Consumption (kWh)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                onChange={(e) => setFormData({...formData, electricity: Number(e.target.value)})}
              />
              <p className="text-[10px] text-muted-foreground">Using national avg: 0.82kg/kWh</p>
            </div>
            <div className="space-y-2">
              <Label>Primary Diet</Label>
              <Select onValueChange={(val) => setFormData({...formData, diet: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VEG">Vegetarian</SelectItem>
                  <SelectItem value="MIXED">Mixed (Veg + Non-Veg)</SelectItem>
                  <SelectItem value="NON_VEG">Predominantly Non-Veg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full bg-accent text-accent-foreground font-bold" 
              onClick={calculateImpact}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Calculate & Generate AI Insights"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {results ? (
            <>
              <Card className="bg-primary/10 border-accent/30 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardDescription className="text-foreground/70 uppercase text-xs font-bold tracking-widest">Total Footprint</CardDescription>
                  <CardTitle className="text-5xl font-headline text-accent">
                    {results.total.toFixed(1)} <span className="text-lg">kg CO₂</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    <span>{results.tips.benchmarkComparison}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="eco-gradient text-white border-none">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-accent" />
                    <CardTitle className="text-lg">AI Mentor Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-accent mb-2">Primary Improvement</h4>
                    <p className="text-sm">{results.tips.improvementArea}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-accent">Personalized Tips</h4>
                    {results.tips.personalizedTips.map((tip: string, i: number) => (
                      <div key={i} className="flex gap-2 text-sm bg-white/5 p-2 rounded border border-white/10">
                        <span className="text-accent font-bold">{i+1}</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-border rounded-xl opacity-50">
              <Info className="w-12 h-12 mb-4" />
              <p className="text-center font-medium">Submit your data to see production-level carbon insights and AI mentorship.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
