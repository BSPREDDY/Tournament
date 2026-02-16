"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { toast } from "sonner"
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"


export default function ChangePasswordPage() {
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    })
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch("/api/auth/check")
                const userData = await res.json()
                setCurrentUser(userData)
            } catch (error) {
                console.error("Failed to load user:", error)
            }
        }
        loadUser()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (formData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Password changed successfully")
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
            } else {
                toast.error(data.error || "Failed to change password")
            }
        } catch {
            toast.error("Failed to change password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">

            <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 flex-shrink-0">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Change Password</h2>
                    </div>

                    <Card className="card-glow w-full">
                        <CardHeader className="px-4 sm:px-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                                    <Lock className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg sm:text-xl">Update Your Password</CardTitle>
                                    <CardDescription>Ensure your account is using a strong password</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showPassword.current ? "text" : "password"}
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 w-full pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showPassword.new ? "text" : "password"}
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 w-full pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword.confirm ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 w-full pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                                    <p className="text-sm font-semibold mb-3">Password Requirements</p>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                        <li>• At least 8 characters long</li>
                                        <li>• Contains uppercase and lowercase letters</li>
                                        <li>• Contains numbers or special characters</li>
                                    </ul>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white transition-shadow w-full sm:w-auto"
                                    >
                                        {loading ? "Updating..." : "Change Password"}
                                    </Button>
                                    <Link href="/dashboard" className="w-full sm:w-auto">
                                        <Button variant="outline" className="w-full bg-transparent">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
