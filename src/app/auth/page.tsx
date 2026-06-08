"use client"

import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { Users, Shield, ArrowRight } from "lucide-react"

export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            <div className="max-w-4xl w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        Tournament Hub
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Join the epic battle or manage the tournament. Select your role to continue.
                    </p>
                </div>

                {/* Auth Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Player Option */}
                    <Link href="/auth/user/login" className="group">
                        <div className="h-full p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer">
                            <div className="flex flex-col h-full">
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center group-hover:bg-cyan-500/30 transition-all duration-300">
                                        <Users className="w-8 h-8 text-cyan-400" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                        Player
                                    </h2>
                                    <p className="text-gray-300 text-sm sm:text-base mb-6">
                                        Register your team, join matches, and compete against other players in the tournament.
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="space-y-2 mb-6">
                                    <p className="text-xs sm:text-sm text-cyan-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                                        Register team
                                    </p>
                                    <p className="text-xs sm:text-sm text-cyan-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                                        View match details
                                    </p>
                                    <p className="text-xs sm:text-sm text-cyan-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                                        Track standings
                                    </p>
                                </div>

                                {/* Button */}
                                <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2 group-hover:gap-3">
                                    <span>Continue as Player</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </div>
                    </Link>

                    {/* Admin Option */}
                    <Link href="/auth/admin/login" className="group">
                        <div className="h-full p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-500/20 hover:border-amber-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer">
                            <div className="flex flex-col h-full">
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center group-hover:bg-amber-500/30 transition-all duration-300">
                                        <Shield className="w-8 h-8 text-amber-400" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                        Admin
                                    </h2>
                                    <p className="text-gray-300 text-sm sm:text-base mb-6">
                                        Manage tournaments, monitor registrations, control bracket assignments, and oversee match progress.
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="space-y-2 mb-6">
                                    <p className="text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                                        Configure settings
                                    </p>
                                    <p className="text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                                        Monitor registrations
                                    </p>
                                    <p className="text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                                        Manage brackets
                                    </p>
                                </div>

                                {/* Button */}
                                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/50 flex items-center justify-center gap-2 group-hover:gap-3">
                                    <span>Continue as Admin</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Footer Info */}
                <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <p className="text-center text-gray-400 text-sm sm:text-base">
                        By logging in, you agree to our Tournament Rules and Terms of Service. Make sure you have the correct account type selected above.
                    </p>
                </div>
            </div>
        </div>
    )
}