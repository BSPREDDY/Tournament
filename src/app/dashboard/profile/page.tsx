"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { toast } from "sonner"
import { User, Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"


export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                // Get current user for navbar
                const res = await fetch("/api/auth/check")
                const userData = await res.json()
                setCurrentUser(userData)

                // Get profile data
                const profileRes = await fetch("/api/user/profile")
                const profileData = await profileRes.json()
                setUser(profileData)
                setFormData({
                    firstName: profileData.firstName || "",
                    lastName: profileData.lastName || "",
                    email: profileData.email || "",
                    phoneNumber: profileData.phoneNumber || "",
                })
            } catch (error) {
                toast.error("Failed to load profile")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                const updatedUser = await res.json()
                setUser(updatedUser)
                toast.success("Profile updated successfully")
                setEditing(false)
            } else {
                toast.error("Failed to update profile")
            }
        } catch {
            toast.error("Failed to update profile")
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
                    <div className="flex items-center gap-4 animate-in slide-in-from-left-6 fade-in duration-500">
                        <Link href="/dashboard">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary/10 transition-all hover:scale-105 active:scale-95"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h2 className="text-2xl sm:text-3xl font-bold gradient-text tracking-tight">
                            My Profile
                        </h2>
                    </div>

                    {/* Profile Card */}
                    <Card className="card-glow w-full flex items-center">
                        <CardHeader className="px-4 sm:px-6">
                            <CardTitle className="text-xl sm:text-2xl font-bold text-primary">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 sm:px-6">
                            {editing ? (
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 w-full"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 w-full"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <Input
                                            id="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                                        <Button
                                            type="submit"
                                            className="bg-gradient-to-r from-primary to-secondary text-white w-full sm:w-auto"
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setEditing(false)}
                                            className="hover:bg-primary/5 w-full sm:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    {/* Avatar and Name */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 items-center">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center animate-pulse">
                                            <User className="w-10 h-10 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl sm:text-2xl font-semibold">
                                                {user?.firstName} {user?.lastName}
                                            </h3>
                                            <p className="text-muted-foreground capitalize text-sm sm:text-base">{user?.role}</p>
                                        </div>
                                    </div>

                                    {/* Info Cards */}
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10 flex-col sm:flex-row sm:items-center">
                                            <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 sm:mt-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <p className="font-medium text-sm sm:text-base break-all">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/10 flex-col sm:flex-row sm:items-center">
                                            <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 sm:mt-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-muted-foreground">Phone</p>
                                                <p className="font-medium text-sm sm:text-base">{user?.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setEditing(true)}
                                        className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-shadow w-full sm:w-auto"
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
