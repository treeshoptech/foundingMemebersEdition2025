"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, FileText, Users, Wrench, TrendingUp, Zap, Shield, Clock, CheckCircle2, Sparkles } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      <header className="border-b backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="TreeShop" width={120} height={40} className="object-contain" />
            <Badge variant="secondary" className="hidden sm:inline-flex">Founding Members 2025</Badge>
          </div>
          <Button onClick={() => window.location.href = '/sign-in'}>
            Sign In
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="default" className="text-base px-4 py-1">
              <Sparkles className="h-4 w-4 mr-2" />
              Founding Members Edition 2025
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Stop Guessing.
              <br />
              <span className="text-primary">Start Profiting.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The first scientifically-backed pricing system for tree service professionals. Calculate every job with precision, win more contracts, and increase your margins by 10-20%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 h-14">
                  Get Started Free
                </Button>
              </Link>
              <Link href="https://treeshop.app" target="_blank">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                  Watch Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 inline text-green-500 mr-1" />
              Founding Member Price: $5,000/year (locked in forever)
              <br />
              <span className="text-xs">Regular price: $10,000/year after founding period</span>
            </p>
          </div>
        </section>

        {/* ROI Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">The TreeShop Advantage</CardTitle>
              <CardDescription className="text-lg">Proven ROI for Tree Service Companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-primary">7,680%</div>
                  <div className="text-sm text-muted-foreground">Average ROI</div>
                  <div className="text-xs text-muted-foreground">$384K gain for $5K investment</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-primary">10-20%</div>
                  <div className="text-sm text-muted-foreground">Increased Close Rate</div>
                  <div className="text-xs text-muted-foreground">Scientific pricing wins trust</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-primary">$8,000</div>
                  <div className="text-sm text-muted-foreground">Average Proposal Value</div>
                  <div className="text-xs text-muted-foreground">Higher margins per job</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Win</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete business management built for tree service professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <Calculator className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">TreeShop Score™</h3>
                <p className="text-muted-foreground text-sm">
                  Scientific pricing for forestry mulching, stump grinding, land clearing, tree removal, and trimming
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <Zap className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">AFISS System</h3>
                <p className="text-muted-foreground text-sm">
                  80+ complexity factors in 18 categories. Account for every obstacle, access issue, and site condition
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <FileText className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Proposal Builder</h3>
                <p className="text-muted-foreground text-sm">
                  Professional proposals with digital signatures, PDF export, and transparent AFISS documentation
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <Wrench className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Equipment Costing</h3>
                <p className="text-muted-foreground text-sm">
                  True hourly costs with ownership, operating, and burden multipliers. Know your real margins
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Labor Management</h3>
                <p className="text-muted-foreground text-sm">
                  Employee burden multipliers by skill level. Calculate true labor costs including taxes and overhead
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <TrendingUp className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Pipeline Tracking</h3>
                <p className="text-muted-foreground text-sm">
                  Lead → Proposal → Work Order → Invoice. Track every job through your entire workflow
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <Clock className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Real-Time Sync</h3>
                <p className="text-muted-foreground text-sm">
                  Powered by Convex. Instant updates across all devices. Never lose data, always in sync
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <Shield className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Multi-Tenant</h3>
                <p className="text-muted-foreground text-sm">
                  Complete data isolation. Manage multiple companies or franchise locations securely
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How TreeShop Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to scientific pricing
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Add Your Resources</h3>
                    <p className="text-muted-foreground">
                      Input your equipment (trucks, mulchers, grinders) and crew members with true labor costs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Create Loadouts</h3>
                    <p className="text-muted-foreground">
                      Combine equipment and crew for each service type. TreeShop calculates your true hourly costs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Calculate TreeShop Score</h3>
                    <p className="text-muted-foreground">
                      Enter job details and select AFISS factors. Get instant pricing with production hours and profit margins
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Generate Proposals</h3>
                    <p className="text-muted-foreground">
                      Professional proposals with transparent pricing, digital signatures, and PDF export. Close more deals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Join the Founding Members</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Lock in $5,000/year pricing forever. Limited to the first 50 tree service companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 h-14">
                    Start Your Free Trial
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  No credit card required • 14-day free trial
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Image src="/logo.png" alt="TreeShop" width={120} height={40} className="object-contain" />
              <p className="text-sm text-muted-foreground">
                Scientific pricing for tree service professionals
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="https://treeshop.app" target="_blank" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="https://treeshop.app" target="_blank" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="https://treeshop.app" target="_blank" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="https://treeshop.app" target="_blank" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="https://treeshop.app" target="_blank" className="hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://treeshop.app" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Website</a></li>
                <li><a href="mailto:founders@treeshop.app" className="hover:text-primary transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>TreeShop &copy; {new Date().getFullYear()} • All rights reserved • Founding Members Edition 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
