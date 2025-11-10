"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, FileText, Users, Wrench } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Image src="/logo.png" alt="TreeShop" width={120} height={40} className="object-contain" />
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="TreeShop" width={200} height={66} className="object-contain" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">Professional Tree Service Management</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Complete business management and proposal builder for your tree service company
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pricing Calculator</h3>
                <p className="text-muted-foreground">Calculate accurate job costs with loadout-based pricing</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Proposal Builder</h3>
                <p className="text-muted-foreground">Create professional proposals with detailed line items</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Team Management</h3>
                <p className="text-muted-foreground">Manage employees, roles, and labor costs</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Wrench className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Equipment Tracking</h3>
                <p className="text-muted-foreground">Track equipment costs and create loadouts</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          TreeShop &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}
