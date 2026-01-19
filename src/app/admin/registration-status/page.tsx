"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { toast } from "sonner"
import { Clock, Calendar, CheckCircle, XCircle, Save, Loader2 } from "lucide-react"

interface RegistrationConfig {
    id: string
    registrationStopAt: string | null
    isRegistrationOpen: boolean
}

export default function RegistrationStatusPage() {
    const [config, setConfig] = useState<RegistrationConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [registrationDeadline, setRegistrationDeadline] = useState("")

    useEffect(() => {
        fetchRegistrationConfig()
        const interval = setInterval(fetchRegistrationConfig, 2000) // Update every 2 seconds for real-time deadline checking
        return () => clearInterval(interval)
    }, [])

    const fetchRegistrationConfig = async () => {
        try {
            const res = await fetch("/api/admin/registration-config")
            if (res.ok) {
                const data = await res.json()
                setConfig(data)
                if (data.registrationStopAt) {
                    const deadline = new Date(data.registrationStopAt)
                    const year = deadline.getFullYear()
                    const month = String(deadline.getMonth() + 1).padStart(2, "0")
                    const day = String(deadline.getDate()).padStart(2, "0")
                    const hours = String(deadline.getHours()).padStart(2, "0")
                    const minutes = String(deadline.getMinutes()).padStart(2, "0")

                    const formattedDeadline = `${year}-${month}-${day}T${hours}:${minutes}`
                    setRegistrationDeadline(formattedDeadline)
                }
            } else {
                console.error("[v0] API error:", res.status)
            }
        } catch (error) {
            console.error("[v0] Failed to fetch registration config:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateDeadline = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!registrationDeadline) {
            toast.error("Please select a deadline")
            return
        }

        setIsSaving(true)
        try {
            const localDate = new Date(registrationDeadline)

            if (isNaN(localDate.getTime())) {
                toast.error("Invalid date format")
                setIsSaving(false)
                return
            }

            // Convert to ISO string for database storage
            const isoString = localDate.toISOString()

            const res = await fetch("/api/admin/registration-config", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    registrationStopAt: isoString,
                }),
            })

            if (res.ok) {
                const updatedConfig = await res.json()
                setConfig(updatedConfig)

                const year = localDate.getFullYear()
                const month = String(localDate.getMonth() + 1).padStart(2, "0")
                const day = String(localDate.getDate()).padStart(2, "0")
                const hours = String(localDate.getHours()).padStart(2, "0")
                const minutes = String(localDate.getMinutes()).padStart(2, "0")

                setRegistrationDeadline(`${year}-${month}-${day}T${hours}:${minutes}`)

                toast.success("Registration deadline updated successfully")
            } else {
                const errorData = await res.json()
                toast.error(errorData.error || "Failed to update deadline")
            }
        } catch (error) {
            console.error("[v0] Update deadline error:", error)
            toast.error("An error occurred while updating deadline")
        } finally {
            setIsSaving(false)
        }
    }

    const handleToggleRegistration = async () => {
        setIsSaving(true)
        try {
            const res = await fetch("/api/admin/registration-config", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isRegistrationOpen: !config?.isRegistrationOpen,
                }),
            })

            if (res.ok) {
                const updatedConfig = await res.json()
                setConfig(updatedConfig)
                toast.success(`Registration ${updatedConfig.isRegistrationOpen ? "opened" : "closed"} successfully`)
            } else {
                const errorData = await res.json()
                toast.error(errorData.error || "Failed to toggle registration")
            }
        } catch (error) {
            console.error("[v0] Toggle registration error:", error)
            toast.error("An error occurred while toggling registration")
        } finally {
            setIsSaving(false)
        }
    }

    const calculateTimeRemaining = () => {
        if (!config?.registrationStopAt) return null
        const now = new Date()
        const deadline = new Date(config.registrationStopAt)
        const diff = deadline.getTime() - now.getTime()

        if (diff <= 0) return "Registration deadline has passed"

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        return `${days}d ${hours}h ${minutes}m remaining`
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                    Registration Status
                </h1>
                <p className="text-muted-foreground">Manage tournament registration deadlines and status</p>
            </div>

            {/* Current Status Card */}
            <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        Current Registration Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status Indicator */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                            <div className="flex-1 w-full">
                                <p className="text-sm text-muted-foreground mb-1">Registration Status</p>
                                <div className="flex items-center gap-2">
                                    {config?.isRegistrationOpen ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-lg font-semibold text-green-500">Open</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            <span className="text-lg font-semibold text-red-500">Closed</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Button
                                onClick={handleToggleRegistration}
                                disabled={isSaving}
                                variant="outline"
                                className="w-full md:w-auto mt-4 md:mt-0 hover:bg-primary/10 bg-transparent"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Toggle Status"}
                            </Button>
                        </div>

                        {/* Deadline Info */}
                        <div className="flex items-start md:items-center gap-4 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                            <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1 md:mt-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                                <p className="font-semibold text-lg break-words">{calculateTimeRemaining() || "No deadline set"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Deadline Display */}
                    {config?.registrationStopAt && (
                        <div className="mt-6 p-4 rounded-lg bg-card border border-primary/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Scheduled Deadline</p>
                            </div>
                            <p className="text-lg font-semibold">{new Date(config.registrationStopAt).toLocaleString()}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Set Deadline Card */}
            <Card className="border-2 border-secondary/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-secondary" />
                        Set Registration Deadline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateDeadline} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="deadline" className="text-base font-semibold">
                                Registration Deadline Date & Time
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Select when you want to close registration. Users won't be able to submit forms after this time.
                            </p>
                            <Input
                                id="deadline"
                                type="datetime-local"
                                value={registrationDeadline}
                                onChange={(e) => setRegistrationDeadline(e.target.value)}
                                className="mt-2 bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                                required
                            />
                            {registrationDeadline && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Selected: {new Date(registrationDeadline).toLocaleString()}
                                </p>
                            )}
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">
                                <strong>Note: </strong> Once the deadline passes, users will see a "Registration Closed" message and
                                won't be able to submit new registrations. You can manually toggle the registration status above.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSaving || !registrationDeadline}
                            className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Deadline
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20">
                <CardHeader>
                    <CardTitle className="text-lg">How Registration Deadline Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        When you set a registration deadline, the system will automatically prevent users from submitting the
                        tournament registration form after that time.
                    </p>
                    <p>You have two ways to control registration:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                        <li>
                            <strong>Using Deadline: </strong> Set a specific date and time. Registration closes automatically at that
                            time.
                        </li>
                        <li>
                            <strong>Manual Toggle: </strong> Use the "Toggle Status" button to instantly open or close registration
                            regardless of the deadline.
                        </li>
                    </ul>
                    <p className="text-xs">The page updates every 2 seconds to show the current status and remaining time.</p>
                </CardContent>
            </Card>
        </div>
    )
}
