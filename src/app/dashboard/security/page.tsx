"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { toast } from "sonner"
import { Shield, ArrowLeft, Lock, LogOut, AlertCircle, Check } from "lucide-react"
import Link from "next/link"


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

                // Simulate sessions data - in production, fetch from API
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

    if (loading)
        return (
            <div className="flex flex-col min-h-screen bg-background pt-36">
                <div className="text-center py-8 flex-1">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/30 border-t-primary mx-auto"></div>
                </div>
            </div>
        )

    return (
        <div className="flex flex-col min-h-screen bg-background">

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-1">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 flex-shrink-0">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Security Settings</h2>
                    </div>

                    {/* Password Security Card */}
                    <Card className="card-glow w-full">
                        <CardHeader className="px-4 sm:px-6">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <Lock className="w-5 h-5 text-primary" />
                                Password & Authentication
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-4 sm:px-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <p className="font-semibold text-sm sm:text-base">Strong Password Set</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Your password was last changed on {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                <Link href="/dashboard/change-password" className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                                        Change Password
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-2 pt-2">
                                <h4 className="font-semibold text-sm">Password Requirements</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        At least 8 characters
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        Contains uppercase and lowercase letters
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        Contains numbers or special characters
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
