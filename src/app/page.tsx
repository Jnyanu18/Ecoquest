import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Trophy, ShieldCheck, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Leaf className="w-6 h-6 text-accent" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight">EcoQuest</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Login</Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 border border-accent/20">
          <Zap className="w-4 h-4" />
          <span>Smart India Hackathon 2024 Winner Potential</span>
        </div>
        
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          Gamifying <span className="text-accent">Sustainability</span> <br />
          One Task at a Time.
        </h1>
        
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          The ultimate competency-based platform for schools. Track real-world impact, earn badges, and compete in inter-school eco battles.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-12 text-lg font-bold" asChild>
            <Link href="/dashboard">Start Your Quest</Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8 h-12 text-lg border-primary/20 hover:bg-primary/5" asChild>
            <Link href="#features">Explore Features</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="p-8 rounded-2xl bg-card border border-border/50 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-headline text-xl font-bold mb-3">Gamified Action</h3>
            <p className="text-muted-foreground">Earn XP, unlock rare badges, and climb leaderboards while saving the planet.</p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border/50 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-headline text-xl font-bold mb-3">Real Impact</h3>
            <p className="text-muted-foreground">Measurable tracking of CO2 reduction, water saved, and trees planted.</p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border/50 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-headline text-xl font-bold mb-3">Admin Verified</h3>
            <p className="text-muted-foreground">Teacher-approved task submissions ensure integrity and quality of action.</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-10 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-accent" />
            <span className="font-headline font-bold text-lg">EcoQuest</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 EcoQuest Platform. Built for a Greener Tomorrow.</p>
        </div>
      </footer>
    </div>
  )
}