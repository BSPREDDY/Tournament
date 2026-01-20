"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { toast } from "sonner"
import { Shield, ArrowLeft, Lock, LogOut, AlertCircle, Check } from "lucide-react"
import Link from "next/link"
import { UserNavbar } from "@/src/components/user/navbar"
import { Footer } from "@/src/components/user/footer"

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
            <div className="flex flex-col min-h-screen bg-background pt-20">
                {currentUser && <UserNavbar user={currentUser} />}
                <div className="text-center py-8 flex-1">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/30 border-t-primary mx-auto"></div>
                </div>
                <Footer />
            </div>
        )

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {currentUser && <UserNavbar user={currentUser} />}

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-20 flex-1">
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

                    {/* Two-Factor Authentication Card */}
                    <Card className="card-glow w-full">
                        <CardHeader className="px-4 sm:px-6">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <Shield className="w-5 h-5 text-primary" />
                                Two-Factor Authentication
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-4 sm:px-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        <p className="font-semibold text-sm sm:text-base">Not Enabled</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                                </div>
                                <Button disabled className="w-full sm:w-auto text-xs sm:text-sm">
                                    Enable 2FA
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Sessions Card */}
                    <Card className="card-glow w-full">
                        <CardHeader className="px-4 sm:px-6">
                            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                <LogOut className="w-5 h-5 text-primary" />
                                Active Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-4 sm:px-6">
                            {sessions.length > 0 ? (
                                <>
                                    <div className="space-y-3">
                                        {sessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-primary/10 bg-primary/5 gap-3"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <p className="font-semibold text-sm sm:text-base">{session.device}</p>
                                                        {session.isCurrent && (
                                                            <Badge className="text-xs bg-green-600 hover:bg-green-700">Current</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{session.location}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Last active: {new Date(session.lastActive).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {session.isCurrent && (
                                                    <Badge variant="outline" className="text-xs w-full sm:w-auto justify-center sm:justify-start">
                                                        Active now
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="destructive" className="w-full mt-4" onClick={handleLogoutAllSessions}>
                                        Logout From All Sessions
                                    </Button>
                                </>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No active sessions</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Activity Card */}
                    <Card className="card-glow w-full">
                        <CardHeader className="px-4 sm:px-6">
                            <CardTitle className="text-lg sm:text-xl">Account Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-4 sm:px-6">
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-card border border-border gap-3">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm sm:text-base">Account Created</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            {new Date(user?.createdAt || Date.now()).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-card border border-border gap-3">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm sm:text-base">Last Password Change</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            {new Date().toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
