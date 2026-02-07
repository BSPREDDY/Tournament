"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
    Shield,
    AlertTriangle,
    Users,
    Clock,
    Ban,
    CheckCircle2,
    XCircle,
    Info,
    Gamepad2,
    Trophy,
    Target,
    Zap
} from "lucide-react"
import type { User } from "@/src/db/schema/schema"

export default function RulesPage() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/auth/check")
                if (!response.ok) {
                    redirect("/auth/login")
                }
                const data = await response.json()
                setUser(data.user)
            } catch (error) {
                console.error("Error fetching user:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary" />
            </div>
        )
    }

    if (!user) {
        redirect("/auth/login")
    }

    const rules = [
        {
            icon: Users,
            title: "Team Composition",
            color: "text-primary",
            bgColor: "bg-primary/10",
            items: [
                "Each team must have exactly 4 players",
                "One player must be designated as the In-Game Leader (IGL)",
                "Substitute players are not allowed during a match",
                "All team members must be registered before the tournament begins",
                "Team name must be unique and appropriate"
            ]
        },
        {
            icon: Clock,
            title: "Match Timing & Schedule",
            color: "text-secondary",
            bgColor: "bg-secondary/10",
            items: [
                "Teams must be ready 15 minutes before their scheduled match",
                "Late teams will be given a 5-minute grace period",
                "Failure to join within 10 minutes results in disqualification",
                "Match schedules are final and non-negotiable",
                "Room ID and password will be shared 10 minutes before match"
            ]
        },
        {
            icon: Target,
            title: "Gameplay Rules",
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            items: [
                "Classic mode - Erangel, Miramar, Sanhok, or Vikendi maps only",
                "TPP (Third Person Perspective) mode will be used",
                "All weapons and items from the map are allowed",
                "Teaming with other squads is strictly prohibited",
                "Stream sniping is not allowed and will result in disqualification"
            ]
        },
        {
            icon: Ban,
            title: "Prohibited Actions",
            color: "text-destructive",
            bgColor: "bg-destructive/10",
            items: [
                "Use of hacks, cheats, or any third-party software",
                "Emulators are strictly prohibited - mobile devices only",
                "Teaming up with enemy squads (teaming)",
                "Abusing in-game bugs or glitches",
                "Toxic behavior, harassment, or abusive language",
                "Account sharing or playing on someone else's account"
            ]
        },
        {
            icon: AlertTriangle,
            title: "Penalties & Disqualification",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
            items: [
                "First offense: Warning",
                "Second offense: Match disqualification",
                "Severe violations: Immediate tournament ban",
                "Cheating: Permanent ban from all future tournaments",
                "All decisions by tournament officials are final"
            ]
        }
    ]

    const fairPlayPoints = [
        { icon: CheckCircle2, text: "Play fair and respect your opponents", allowed: true },
        { icon: CheckCircle2, text: "Report bugs to organizers immediately", allowed: true },
        { icon: CheckCircle2, text: "Follow all instructions from tournament officials", allowed: true },
        { icon: CheckCircle2, text: "Maintain good sportsmanship at all times", allowed: true },
        { icon: XCircle, text: "Do not share room ID/password with others", allowed: false },
        { icon: XCircle, text: "Do not stream match without permission", allowed: false },
        { icon: XCircle, text: "Do not use VPN or location spoofing", allowed: false },
        { icon: XCircle, text: "Do not exploit game bugs for advantage", allowed: false }
    ]

    return (
        <div className="w-full pb-8 sm:pb-12">
            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12 slide-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <Shield className="w-4 h-4" />
                            Official Tournament Guidelines
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold gradient-text mb-3 sm:mb-4">
                            BGMI Tournament Rules
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2 font-medium">
                            Please read all rules carefully. Violation of any rule may result in disqualification.
                        </p>
                    </div>

                    {/* Important Notice */}
                    <Card className="border-orange-500/30 bg-orange-500/5 slide-in" style={{ animationDelay: '0.1s' }}>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-orange-500/10">
                                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-orange-600 dark:text-orange-400 mb-2">Important Notice</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        By participating in this tournament, you agree to abide by all rules and regulations listed below.
                                        Tournament organizers reserve the right to make final decisions on all disputes.
                                        Any form of cheating or unsportsmanlike conduct will not be tolerated.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {rules.map((rule, index) => (
                            <Card
                                key={rule.title}
                                className="card-glow overflow-hidden hover-lift slide-in"
                                style={{ animationDelay: `${0.1 * (index + 2)}s` }}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-xl ${rule.bgColor}`}>
                                            <rule.icon className={`w-5 h-5 ${rule.color}`} />
                                        </div>
                                        <CardTitle className="text-lg font-bold">{rule.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {rule.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${rule.bgColor} flex-shrink-0`}
                                                    style={{ backgroundColor: `hsl(var(--${rule.color === 'text-primary' ? 'primary' : rule.color === 'text-secondary' ? 'secondary' : 'foreground'}))` }} />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Fair Play Section */}
                    <Card className="card-glow slide-in" style={{ animationDelay: '0.8s' }}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <Zap className="w-5 h-5 text-primary" />
                                </div>
                                <CardTitle className="text-xl font-bold">Fair Play Guidelines</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {fairPlayPoints.map((point, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-3 p-3 rounded-lg ${point.allowed
                                            ? 'bg-green-500/5 border border-green-500/20'
                                            : 'bg-destructive/5 border border-destructive/20'
                                            }`}
                                    >
                                        <point.icon className={`w-5 h-5 flex-shrink-0 ${point.allowed ? 'text-green-500' : 'text-destructive'
                                            }`} />
                                        <span className="text-sm font-medium">{point.text}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact for Queries */}
                    <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/10 slide-in" style={{ animationDelay: '0.9s' }}>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 text-center sm:text-left">
                                    <div className="p-3 rounded-xl bg-primary/10 hidden sm:block">
                                        <Info className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Have Questions?</h3>
                                        <p className="text-sm text-muted-foreground">
                                            If you have any queries about the rules, please contact us through the support page.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="/dashboard/contact"
                                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm"
                                >
                                    Contact Support
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
