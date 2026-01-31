import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Trophy, Users, Lock, ArrowRight } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-card via-card to-card border-b border-primary/10 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white">
                <Trophy className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold gradient-text">Nag • IronmanTY</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8 mt-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 slide-in">
          <h1 className="text-5xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            <span className="block">Welcome to</span>
            <span className="block gradient-text">Nag • IronmanTY'S Tournament</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Register your elite gaming team and compete in the most exciting esports tournament. Showcase your skills,
            claim victory, and join the champions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl transition-shadow gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="hover:bg-primary/5 bg-transparent gap-2">
                Already Registered
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold gradient-text">Why Choose Nag • IronmanTY'S Tournament?</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Everything you need to manage your tournament registration and track your team's progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-glow rounded-xl border p-8 hover:shadow-lg transition-all duration-200 hover:border-primary/50 group">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Team Registration</h3>
              <p className="text-muted-foreground">
                Register your 4-player team with complete player details, IDs, and contact information in minutes.
              </p>
            </div>

            <div className="card-glow rounded-xl border p-8 hover:shadow-lg transition-all duration-200 hover:border-secondary/50 group">
              <div className="bg-gradient-to-br from-secondary/20 to-primary/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:from-secondary/30 group-hover:to-primary/30 transition-colors">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Player Management</h3>
              <p className="text-muted-foreground">
                View and manage all player details, track registrations, and organize your team in one dashboard.
              </p>
            </div>

            <div className="card-glow rounded-xl border p-8 hover:shadow-lg transition-all duration-200 hover:border-primary/50 group">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Secure Dashboard</h3>
              <p className="text-muted-foreground">
                Access your personalized dashboard with encrypted data and real-time updates on your registration.
              </p>
            </div>
          </div>
        </div>

        {/* Registration Steps */}
        <div className="mt-24 bg-gradient-to-br from-card to-card/50 card-glow rounded-xl border p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text">How to Register</h2>
            <p className="text-muted-foreground mt-4">Get your team registered in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg mx-auto">
                1
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary">Create Account</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Sign up with your personal details including name, email, phone, and age to create your account.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-bold text-lg mx-auto">
                2
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-secondary">Team Registration</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Fill in your team details and player information including game IDs and contact numbers.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg mx-auto">
                3
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary">Confirmation</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Receive instant confirmation and access your dashboard to track your tournament status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center space-y-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 card-glow rounded-xl border p-10">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Compete?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Don't miss out on the biggest gaming tournament. Register your team today and get ready to dominate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl transition-shadow"
              >
                Register Your Team
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl transition-shadow">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-card via-card to-card border-t border-primary/10">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold gradient-text">Nag <strong>•</strong> IronmanTY</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The ultimate platform for gaming tournament registrations and team management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/register" className="hover:text-primary transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-primary transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/10 pt-5 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Nag • IronmanTY. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
