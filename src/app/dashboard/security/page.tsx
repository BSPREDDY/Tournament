"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    ArrowLeft,
    Lock,
    Check,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"

import { Button } from "@/src/components/ui/button"

export default function SecurityPage() {
    const [user, setUser] = useState<any>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [sessions, setSessions] = useState<any[]>([])

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch("/api/auth/check")
                const userData = await res.json()

                setCurrentUser(userData)
                setUser(userData)

                // Mock session data
                setSessions([
                    {
                        id: "current",
                        device: "Chrome on Windows",
                        location: "Current device",
                        lastActive: new Date(),
                        isCurrent: true,
                    },
                ])
            } catch (error) {
                toast.error("Failed to load security information")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    const handleLogoutAllSessions = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            window.location.href = "/"
        } catch (error) {
            toast.error("Failed to logout")
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-background animate-in fade-in slide-in-from-bottom-4 duration-700">
            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex-1 space-y-8">

                {/* ===== HEADER ===== */}
                <div className="flex items-center gap-4 animate-in slide-in-from-left-6 fade-in duration-500">
                    <Link href="/dashboard">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                                hover:bg-primary/10
                                transition-all
                                hover:scale-105
                                active:scale-95
                            "
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>

                    <h2 className="text-2xl sm:text-3xl font-bold gradient-text tracking-tight">
                        Security Settings
                    </h2>
                </div>

                {/* ===== PASSWORD & AUTH CARD ===== */}
                <Card
                    className="
                        card-glow
                        transition-all duration-300
                        hover:-translate-y-1
                        hover:shadow-xl
                        animate-in fade-in slide-in-from-bottom-6

                    "
                >
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Lock className="w-5 h-5 text-primary animate-pulse" />
                            Password & Authentication
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">

                        {/* Password Status */}
                        <div
                            className="
                                flex flex-col sm:flex-row
                                items-start sm:items-center
                                justify-between
                                p-5
                                rounded-xl
                                bg-gradient-to-r
                                from-green-50 to-emerald-50
                                dark:from-green-950/40 dark:to-emerald-950/20
                                border border-green-200 dark:border-green-900
                                gap-4
                                transition-all duration-300
                                hover:shadow-md
                            "
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 animate-bounce" />
                                    <p className="font-semibold text-green-800 dark:text-green-200">
                                        Strong Password Set
                                    </p>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                    Your password was last changed on{" "}
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>

                            <Link
                                href="/dashboard/change-password"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    variant="outline"
                                    className="
                                        w-full sm:w-auto
                                        transition-all
                                        hover:bg-primary/10
                                        hover:scale-105
                                        active:scale-95
                                    "
                                >
                                    Change Password
                                </Button>
                            </Link>
                        </div>

                        {/* Password Rules */}
                        <div className="space-y-3 pt-2">
                            <h4 className="font-semibold text-sm">
                                Password Requirements
                            </h4>

                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {[
                                    "At least 8 characters",
                                    "Contains uppercase and lowercase letters",
                                    "Contains numbers or special characters",
                                ].map((rule, index) => (
                                    <li
                                        key={index}
                                        className="
                                            flex items-center gap-2
                                            animate-in fade-in slide-in-from-left-3
                                        "
                                        style={{
                                            animationDelay: `${index * 80}ms`,
                                        }}
                                    >
                                        <Check className="w-4 h-4 text-green-600" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
