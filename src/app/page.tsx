import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Trophy, Users, Lock, ArrowRight, Mail, HelpCircle } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium BGMI Video Background */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        >
          <source src="/background1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 -left-32 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl opacity-40" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-[3px] border-b border-amber-500/20 z-50 shadow-2xl shadow-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-2 rounded-lg text-black shadow-lg shadow-amber-400/30 group-hover:shadow-amber-400/50 transition-all duration-300">
                <Trophy className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text hidden sm:block">NAG • IronmanYT</h1>
            </Link>

            <div className="flex items-center space-x-2">
              <Link href="/auth/user/login">
                <Button variant="ghost" className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 rounded-full transition-all duration-300 hover:scale-105 font-bold text-sm">
                  Login
                </Button>
              </Link>

              <Link href="/auth/user/signup">
                <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20 rounded-full transition-all duration-300 hover:scale-105 font-bold text-sm">
                  Signup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-8 slide-in">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter animate-slide-in-left">
            <span className="block text-white mb-2">Experience Elite</span>
            <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-cyan-400 bg-clip-text text-transparent text-6xl sm:text-7xl md:text-8xl font-black drop-shadow-lg">
              Gaming Combat
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-amber-100 max-w-3xl mx-auto animate-slide-in-right leading-relaxed drop-shadow-md" style={{ animationDelay: '0.2s' }}>
            Join the ultimate BGMI tournament platform. Register your elite squad, compete against top players, showcase your tactical skills, and claim victory in the most intense gaming championship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
            <Link href="/auth/user/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-300 hover:to-blue-400 hover:shadow-2xl shadow-lg shadow-cyan-500/40 transition-all duration-300 hover:scale-105 gap-2 font-bold rounded-full text-base px-8"
              >
                Register Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/user/login">
              <Button size="lg" className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 gap-2 border-0 hover:shadow-2xl shadow-lg shadow-amber-500/40 rounded-full transition-all duration-300 hover:scale-105 font-bold text-base px-8">
                Already a Player
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 space-y-16">
          <div className="text-center slide-in">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-amber-300 to-cyan-400 bg-clip-text mb-4">Why Choose Our Platform?</h2>
            <p className="text-amber-100 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              The complete ecosystem for competitive gaming. Manage registrations, track progress, and compete at your peak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group slide-in border border-amber-500/20 hover:border-amber-500/50 rounded-2xl backdrop-blur-[1px] bg-black/40 p-8 hover:shadow-2xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: '0.1s' }}>
              <div className="bg-gradient-to-br from-amber-400/20 to-amber-600/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:from-amber-400/40 group-hover:to-amber-600/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-400/20">
                <Trophy className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform group-hover:text-amber-300" />
              </div>
              <h3 className="text-xl font-bold text-amber-300 mb-3">Elite Registration</h3>
              <p className="text-amber-100/80 leading-relaxed">
                Register your 4-player squad instantly. Complete player profiles, game IDs, and all required documentation in one streamlined process.
              </p>
            </div>

            <div className="group slide-in border border-cyan-500/20 hover:border-cyan-500/50 rounded-2xl backdrop-blur-[1px] bg-black/40 p-8 hover:shadow-2xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-cyan-400/20 to-blue-600/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:from-cyan-400/40 group-hover:to-blue-600/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-400/20">
                <Users className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform group-hover:text-cyan-300" />
              </div>
              <h3 className="text-xl font-bold text-cyan-300 mb-3">Team Dashboard</h3>
              <p className="text-cyan-100/80 leading-relaxed">
                Comprehensive team management with real-time stats, player tracking, and tournament updates. Monitor progress like never before.
              </p>
            </div>

            <div className="group slide-in border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl backdrop-blur-[1px] bg-black/40 p-8 hover:shadow-2xl shadow-lg shadow-emerald-500/1<PASSWORD> hover:shadow-emerald-5<PASSWORD> transition-all duration-3<PASSWORD> hover:-translate-y-2" style={{ animationDelay: '<PASSWORD>' }}>
              <div className="bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:from-emerald-400/40 group-hover:to-emerald-600/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-400/20">
                <Lock className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform group-hover:text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-emerald-300 mb-3">Secure & Fast</h3>
              <p className="text-emerald-100/80 leading-relaxed">
                Military-grade encryption, instant confirmations, and 24/7 support. Your data security is our top priority.
              </p>
            </div>
          </div>
        </div>

        {/* Registration Steps */}
        <div className="mt-32 bg-gradient-to-br from-black/60 to-black/40 border border-amber-500/20 backdrop-blur-[1px] rounded-2xl p-12 slide-in shadow-xl hover:shadow-amber-500/20 transition-all">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-amber-300 to-cyan-400 bg-clip-text mb-4">Quick Registration Process</h2>
            <p className="text-amber-100 text-lg">Get battle-ready in 3 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-6 slide-in relative z-10" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-2xl mx-auto shadow-lg shadow-amber-400/50 hover:shadow-amber-400/70 transition-all hover:scale-110">
                1
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-amber-300 mb-2">Create Account</h3>
                <p className="text-sm text-amber-100/80 leading-relaxed">
                  Sign up with your name, email, and phone number to create your elite player profile.
                </p>
              </div>
            </div>

            <div className="space-y-6 slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-black text-2xl mx-auto shadow-lg shadow-cyan-400/50 hover:shadow-cyan-400/70 transition-all hover:scale-110">
                2
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-cyan-300 mb-2">Form Your Squad</h3>
                <p className="text-sm text-cyan-100/80 leading-relaxed">
                  Register your 4-player team with game IDs and contact details for all members.
                </p>
              </div>
            </div>

            <div className="space-y-6 slide-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black text-2xl mx-auto shadow-lg shadow-emerald-400/50 hover:shadow-emerald-400/70 transition-all hover:scale-110">
                3
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-emerald-300 mb-2">Start Competing</h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed">
                  Get confirmed instantly and access your dashboard to begin your journey to victory.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center space-y-8 bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-emerald-500/10 border border-amber-500/30 backdrop-blur-[1px] rounded-2xl p-16 slide-in shadow-xl hover:shadow-amber-500/20 transition-all" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-300 bg-clip-text">Ready to Dominate?</h2>
          <p className="text-amber-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Join thousands of competitive gamers in the ultimate BGMI tournament. Register your elite squad today and compete for glory and rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/user/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-300 hover:to-blue-400 hover:shadow-2xl shadow-lg shadow-cyan-500/40 transition-all duration-300 hover:scale-105 font-bold rounded-full text-base px-8"
              >
                Signup & Compete
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/user/login">
              <Button size="lg" className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 hover:shadow-2xl shadow-lg shadow-amber-500/40 transition-all duration-300 hover:scale-105 font-bold rounded-full text-base px-8 border-0">
                Player Login
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-black/60 via-black/80 to-black border-t border-amber-500/20 mt-24 relative">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="slide-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-2 rounded-lg text-black shadow-lg shadow-amber-400/30">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text">NAG • IronmanYT</h3>
              </div>
              <p className="text-sm text-amber-100/70 leading-relaxed">
                The ultimate competitive gaming platform for BGMI tournaments and esports tournaments.
              </p>
            </div>
            <div className="slide-in" style={{ animationDelay: '0.1s' }}>
              <h4 className="font-bold text-amber-300 mb-4 uppercase text-xs tracking-widest">Navigation</h4>
              <ul className="space-y-3 text-sm text-amber-100/70">
                <li>
                  <Link href="/auth/user/signup" className="hover:text-amber-300 transition-all duration-300 hover:translate-x-1 inline-block">
                    Join Tournament
                  </Link>
                </li>
                <li>
                  <Link href="/auth/user/login" className="hover:text-amber-300 transition-all duration-300 hover:translate-x-1 inline-block">
                    Player Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div className="slide-in" style={{ animationDelay: '0.2s' }}>
              <h4 className="font-bold text-cyan-300 mb-4 uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-3 text-sm text-cyan-100/70">
                <li>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 hover:text-cyan-300 transition-all duration-300 hover:translate-x-1"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 hover:text-cyan-300 transition-all duration-300 hover:translate-x-1"
                  >
                    <HelpCircle className="w-4 h-4 flex-shrink-0" />
                    <span>FAQ</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-500/20 pt-8 text-center text-sm text-amber-100/60 slide-in" style={{ animationDelay: '0.4s' }}>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400" />
              &copy; {new Date().getFullYear()} NAG • IronmanYT. All rights reserved.
            </p>
          </div>
        </div>
      </footer >
    </div >
  )
}