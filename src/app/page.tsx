import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Trophy, Users, Lock, ArrowRight } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-card/60 backdrop-blur-xl border-b border-primary/10 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300">
                <Trophy className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold gradient-text">NAG • IronmanYT</h1>
            </Link>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:bg-primary/80 rounded-full transition-all duration-300 hover:scale-105">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl shadow-lg shadow-primary/30 rounded-full transition-all duration-300 hover:scale-105 font-bold">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-6 slide-in">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight animate-slide-in-left">
            <span className="block">Welcome to</span>
            <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-size-200 animate-gradient-x text-4xl sm:text-6xl md:text-7xl font-black">
              NAG • IronmanYT'S Tournament
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            Register your elite gaming team and compete in the most exciting esports tournament. Showcase your skills,
            claim victory, and join the champions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-2xl shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 gap-2 font-bold rounded-full"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="hover:bg-primary/80 bg-transparent gap-2 border-primary/50 hover:border-primary rounded-full transition-all duration-300 hover:scale-105 font-bold">
                Already Registered
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 space-y-12">
          <div className="text-center slide-in">
            <h2 className="text-4xl font-bold gradient-text">Why Choose NAG • IronmanYT'S Tournament?</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              Everything you need to manage your tournament registration and track your team's progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-glow hover-lift rounded-2xl border p-8 hover:shadow-2xl shadow-lg shadow-primary/10 transition-all duration-300 hover:border-primary/70 group slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:from-primary/40 group-hover:to-secondary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                <Trophy className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all">Team Registration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Register your 4-player team with complete player details, IDs, and contact information in minutes.
              </p>
            </div>

            <div className="card-glow hover-lift rounded-2xl border p-8 hover:shadow-2xl shadow-lg shadow-secondary/10 transition-all duration-300 hover:border-secondary/70 group slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-secondary/20 to-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:from-secondary/40 group-hover:to-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-secondary/20">
                <Users className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-secondary group-hover:to-primary group-hover:bg-clip-text transition-all">Player Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                View and manage all player details, track registrations, and organize your team in one dashboard.
              </p>
            </div>

            <div className="card-glow hover-lift rounded-2xl border p-8 hover:shadow-2xl shadow-lg shadow-primary/10 transition-all duration-300 hover:border-primary/70 group slide-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:from-primary/40 group-hover:to-secondary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                <Lock className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text transition-all">Secure Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access your personalized dashboard with encrypted data and real-time updates on your registration.
              </p>
            </div>
          </div>
        </div>

        {/* Registration Steps */}
        <div className="mt-24 bg-gradient-to-br from-card to-card/50 card-glow hover-lift rounded-2xl border p-12 slide-in shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-2">How to Register</h2>
            <p className="text-muted-foreground text-lg">Get your team registered in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}

            <div className="space-y-4 slide-in relative z-10" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl mx-auto shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-110">
                1
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary mb-2">Create Account</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sign up with your personal details including name, email, phone, and age to create your account.
                </p>
              </div>
            </div>

            <div className="space-y-4 slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-bold text-xl mx-auto shadow-lg shadow-secondary/30 hover:shadow-secondary/50 transition-all hover:scale-110">
                2
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-secondary mb-2">Team Registration</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fill in your team details and player information including game IDs and contact numbers.
                </p>
              </div>
            </div>

            <div className="space-y-4 slide-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl mx-auto shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-110">
                3
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary mb-2">Confirmation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Receive instant confirmation and access your dashboard to track your tournament status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center space-y-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 card-glow hover-lift rounded-2xl border p-12 slide-in shadow-xl" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">Ready to Compete?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Don't miss out on the biggest gaming tournament. Register your team today and get ready to dominate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-2xl shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 font-bold rounded-full"
              >
                Register Your Team
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-2xl shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 font-bold rounded-full border-0">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-card via-card/80 to-background border-t border-primary/10 mt-20 relative">
        {/* Animated footer background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div className="slide-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white shadow-lg shadow-primary/30">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold gradient-text">NAG • IronmanYT</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The ultimate platform for gaming tournament registrations and team management.
              </p>
            </div>
            <div className="slide-in" style={{ animationDelay: '0.1s' }}>
              <h4 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-widest">Quick Links</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/register" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="slide-in" style={{ animationDelay: '0.2s' }}>
              <h4 className="font-semibold text-foreground mb-4 uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/10 pt-8 text-center text-sm text-muted-foreground slide-in" style={{ animationDelay: '0.3s' }}>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
              &copy; {new Date().getFullYear()} NAG • IronmanYT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
