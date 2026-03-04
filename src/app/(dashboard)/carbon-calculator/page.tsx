
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateMonthlyCarbon, type CarbonInput } from "@/lib/carbon-engine"
import { Calculator, Leaf, TrendingDown, Info, BarChart3 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getEcoMentorAdvice } from "@/ai/flows/ai-eco-mentor"
import { MOCK_USER } from "@/lib/constants"

export default function CarbonCalculator() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ total: number; tips: any; breakdown: any } | null>(null)

  const [formData, setFormData] = useState<CarbonInput>({
    carKM: 0,
    busKM: 0,
    electricityKWh: 0,
    dietType: 'VEG'
  })

  const calculateImpact = async () => {
    if (loading) return;
    setLoading(true)
    try {
      const { total, breakdown, comparison } = calculateMonthlyCarbon(formData);

      // Call AI Mentor for personalized insights
      const aiAdvice = await getEcoMentorAdvice({
        studentName: MOCK_USER.name,
        monthlyCO2: total,
        recentActivities: ["Planted 2 trees", "Composted kitchen waste"],
        dietType: formData.dietType,
        travelMode: formData.carKM > formData.busKM ? "Private Car" : "Public Transport"
      })

      setResults({ total, tips: aiAdvice, breakdown })
      toast({
        title: "Report Generated",
        description: `Your footprint is ${total.toFixed(1)}kg CO2. Check AI insights below!`,
      })
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: "Failed to generate AI mentorship advice."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-bold">Institutional Carbon Audit</h1>
        <p className="text-muted-foreground">Submit your monthly activity data for verified environmental impact tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-accent/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="w-5 h-5 text-accent" />
                Monthly Data Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Travel by Car (KM)</Label>
                <Input 
                  type="number" 
                  value={formData.carKM}
                  onChange={(e) => setFormData({...formData, carKM: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Travel by Bus (KM)</Label>
                <Input 
                  type="number" 
                  value={formData.busKM}
                  onChange={(e) => setFormData({...formData, busKM: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Electricity (kWh)</Label>
                <Input 
                  type="number" 
                  value={formData.electricityKWh}
                  onChange={(e) => setFormData({...formData, electricityKWh: Number(e.target.value)})}
                />
                <p className="text-[10px] text-muted-foreground">National average: 0.82kg/kWh</p>
              </div>
              <div className="space-y-2">
                <Label>Primary Diet</Label>
                <Select value={formData.dietType} onValueChange={(val: any) => setFormData({...formData, dietType: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VEG">Vegetarian</SelectItem>
                    <SelectItem value="MIXED">Mixed (Veg + Meat)</SelectItem>
                    <SelectItem value="NON_VEG">High Meat Consumption</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full bg-accent text-accent-foreground font-bold h-11" 
                onClick={calculateImpact}
                disabled={loading}
              >
                {loading ? "Running Audit..." : "Calculate & Consult AI"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {results ? (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-primary/10 border-accent/20">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-foreground/70 uppercase text-[10px] font-bold tracking-widest">Calculated Footprint</CardDescription>
                    <CardTitle className="text-4xl font-headline text-accent">
                      {results.total.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kg CO₂</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm font-medium mt-2">
                      <TrendingDown className="w-4 h-4 text-green-500" />
                      <span>{results.tips.benchmarkComparison}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-border">
                  <CardHeader className="pb-2">
                    <CardDescription className="uppercase text-[10px] font-bold tracking-widest">Primary Improvement</CardDescription>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {results.tips.improvementArea}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card className="eco-gradient text-white border-none shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-accent" />
                      <CardTitle className="text-xl font-headline">AI Mentor Strategic Advice</CardTitle>
                    </div>
                    <BarChart3 className="w-6 h-6 text-accent/50" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-sm leading-relaxed">
                    "{results.tips.motivationMessage}"
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-accent tracking-widest">High Impact Actions</h4>
                    <div className="grid gap-3">
                      {results.tips.personalizedTips.map((tip: string, i: number) => (
                        <div key={i} className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10 group hover:bg-white/10 transition-colors">
                          <div className="bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
                            {i+1}
                          </div>
                          <p className="text-sm leading-snug">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-card/30">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Calculator className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-headline text-xl font-bold mb-2">Ready for Audit</h3>
              <p className="text-center text-muted-foreground max-w-sm">
                Enter your monthly travel, energy, and diet data to receive a SIH-grade carbon report and AI mentorship.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
