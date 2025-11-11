"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Sparkles, LogIn, Users } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 overflow-hidden">
      <div className="w-full max-w-7xl">
        {/* Two-Panel Hero - Side by Side Always */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Founding Members Login Panel */}
          <Card className="border-primary bg-gradient-to-br from-primary/20 to-primary/5 h-full">
            <CardHeader className="text-center space-y-3 sm:space-y-4 pt-6 sm:pt-12 pb-4 sm:pb-8">
              <div className="flex justify-center">
                <Image src="/logo.png" alt="TreeShop" width={140} height={46} className="object-contain sm:w-[160px] sm:h-[53px]" />
              </div>
              <Badge variant="default" className="text-xs sm:text-base px-3 sm:px-4 py-0.5 sm:py-1 mx-auto">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Founding Members 2025
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl">Member Login</CardTitle>
              <CardDescription className="text-sm sm:text-lg">
                Access your TreeShop dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 pb-6 sm:pb-12 px-4 sm:px-6">
              <Button
                size="lg"
                className="w-full text-base sm:text-lg h-12 sm:h-14"
                onClick={() => window.location.href = '/sign-in'}
              >
                <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Login to Dashboard
              </Button>
              <div className="text-center space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 inline text-accent mr-1" />
                  Invitation Only - Founding Members
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="px-1 h-auto text-[10px] sm:text-xs"
                    onClick={() => window.open('https://www.treeshop.app/tech#application', '_blank')}
                  >
                    Apply here
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Panel */}
          <Card className="border-muted h-full">
            <CardHeader className="text-center space-y-3 sm:space-y-4 pt-6 sm:pt-12 pb-4 sm:pb-8">
              <CardTitle className="text-2xl sm:text-4xl leading-tight">
                The First-Ever System
                <br />
                <span className="text-primary">To Make Pricing This Simple.</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-lg font-medium">
                Revolutionary scientific pricing that transforms how tree service companies operate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 pb-6 sm:pb-12 px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">World's First TreeShop Score™ System</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      80+ complexity factors. Every job calculated with scientific precision. Never guess again.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">Direct Partnership With Founder</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      1-on-1 access to build your empire. Personal guidance from someone who actually gets it.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">Founding Member Exclusivity</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Shape the platform. Priority features. VIP marketing as TreeShop explodes nationwide.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-2 sm:pt-4 text-center">
                <p className="text-base sm:text-lg font-bold text-primary mb-1 sm:mb-2">🔒 Invitation Only</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Limited to serious tree service companies ready to dominate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
