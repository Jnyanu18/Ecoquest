"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Award, Star, Search, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

const modules = [
  {
    id: 'm1',
    title: 'Plastic & Our Oceans',
    description: 'Understand the lifecycle of plastic and how it impacts marine biodiversity.',
    image: 'https://picsum.photos/seed/ocean1/600/400',
    duration: '45 mins',
    lessons: 6,
    points: 100,
    progress: 100,
    category: 'Marine Life'
  },
  {
    id: 'm2',
    title: 'Solar Power Basics',
    description: 'Learn how solar cells convert sunlight into clean, renewable energy for homes.',
    image: 'https://picsum.photos/seed/solar1/600/400',
    duration: '60 mins',
    lessons: 8,
    points: 150,
    progress: 30,
    category: 'Energy'
  },
  {
    id: 'm3',
    title: 'The Art of Composting',
    description: 'Turn your kitchen waste into black gold for your garden and reduce landfill contributions.',
    image: 'https://picsum.photos/seed/compost1/600/400',
    duration: '30 mins',
    lessons: 4,
    points: 80,
    progress: 0,
    category: 'Waste'
  },
  {
    id: 'm4',
    title: 'Urban Forestry',
    description: 'The importance of micro-forests in urban environments and how to start one.',
    image: 'https://picsum.photos/seed/forest1/600/400',
    duration: '50 mins',
    lessons: 5,
    points: 120,
    progress: 0,
    category: 'Biodiversity'
  }
]

export default function LearningHub() {
  const [filter, setFilter] = useState('All')
  
  const categories = ['All', ...new Set(modules.map(m => m.category))]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold mb-2">Learning Hub</h1>
          <p className="text-muted-foreground">Complete modules to earn XP and boost your EcoScore.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search modules..." className="pl-10" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <Button 
            key={cat} 
            variant={filter === cat ? "default" : "outline"} 
            className={`rounded-full ${filter === cat ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.filter(m => filter === 'All' || m.category === filter).map((module) => (
          <Card key={module.id} className="overflow-hidden group hover:border-accent/50 transition-all">
            <div className="relative h-48 w-full overflow-hidden">
              <Image 
                src={module.image} 
                alt={module.title} 
                fill 
                className="object-cover transition-transform group-hover:scale-105"
                data-ai-hint={module.category.toLowerCase()}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <Badge className="bg-accent text-accent-foreground border-none">
                  {module.category}
                </Badge>
              </div>
              {module.progress === 100 && (
                <div className="absolute top-4 right-4 bg-accent p-1.5 rounded-full text-accent-foreground shadow-lg">
                  <Award className="w-4 h-4" />
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-xl">{module.title}</CardTitle>
                <div className="flex items-center gap-1 text-accent font-bold">
                  <Star className="w-4 h-4 fill-accent" />
                  <span className="text-sm">{module.points}</span>
                </div>
              </div>
              <CardDescription className="line-clamp-2">{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {module.duration}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {module.lessons} Lessons
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-1.5" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary/10 hover:bg-primary/20 text-foreground border border-primary/20 group">
                {module.progress === 0 ? 'Start Module' : module.progress === 100 ? 'Review Module' : 'Continue Learning'}
                <Play className="w-4 h-4 ml-2 fill-current" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}