"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { toast } from "sonner"
import { Clock, Calendar, CheckCircle, XCircle, Save, Loader2, Trophy as TrophyIcon, Trophy } from "lucide-react"

interface RegistrationConfig {
    id: string
    registrationStopAt: string | null
    isRegistrationOpen: boolean
    maxTeams: string | null
    currentTeams?: number
}

export default function RegistrationStatusPage() {
    const [config, setConfig] = useState<RegistrationConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [registrationDeadline, setRegistrationDeadline] = useState("")
    const [maxTeams, setMaxTeams] = useState("")

    useEffect(() => {
        fetchRegistrationConfig()
        // Only fetch once on mount - no polling to avoid infinite API calls
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
                if (data.maxTeams) {
                    setMaxTeams(data.maxTeams)
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
        <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                    Registration Status
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage tournament registration deadlines and status</p>
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Status Indicator */}
                        <div className={`flex flex-col gap-4 p-4 sm:p-6 rounded-lg border ${config?.isRegistrationOpen ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20' : 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20'}`}>
                            <div className="flex-1">
                                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Registration Status</p>
                                <div className="flex items-center gap-2">
                                    {config?.isRegistrationOpen ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                                            <span className="text-base sm:text-lg font-semibold text-green-500">Open</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />
                                            <span className="text-base sm:text-lg font-semibold text-red-500">Closed</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Button
                                onClick={handleToggleRegistration}
                                disabled={isSaving}
                                variant="outline"
                                className="w-full hover:bg-primary/10 bg-transparent text-xs sm:text-sm"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Toggle Status"}
                            </Button>
                        </div>

                        {/* Teams Count */}
                        <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-lg bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/20">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Teams Registered</p>
                                    <p className="font-semibold text-sm sm:text-lg break-words">
                                        {config?.currentTeams || 0} {config?.maxTeams ? `/ ${config.maxTeams}` : ''}
                                    </p>
                                    {config?.maxTeams && (
                                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                                            <div
                                                className="bg-accent h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min((config.currentTeams || 0) / parseInt(config.maxTeams) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Deadline Info */}
                        <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Time Remaining</p>
                                    <p className="font-semibold text-sm sm:text-lg break-words">{calculateTimeRemaining() || "No deadline set"}</p>
                                </div>
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

            {/* Set Max Teams Card */}
            <Card className="border-2 border-accent/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                        <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0" />
                        <span className="truncate">Maximum Teams Allowed</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault()
                            if (!maxTeams || parseInt(maxTeams) <= 0) {
                                toast.error("Please enter a valid number of teams")
                                return
                            }

                            setIsSaving(true)
                            try {
                                const res = await fetch("/api/admin/registration-config", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        maxTeams: maxTeams,
                                    }),
                                })

                                if (res.ok) {
                                    const updatedConfig = await res.json()
                                    setConfig(updatedConfig)
                                    setMaxTeams(updatedConfig.maxTeams)
                                    toast.success(`Maximum teams updated to ${maxTeams}`)
                                } else {
                                    const errorData = await res.json()
                                    toast.error(errorData.error || "Failed to update max teams")
                                }
                            } catch (error) {
                                console.error("[v0] Update max teams error:", error)
                                toast.error("An error occurred while updating max teams")
                            } finally {
                                setIsSaving(false)
                            }
                        }}
                        className="space-y-4 sm:space-y-6"
                    >
                        <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor="maxTeams" className="text-sm sm:text-base font-semibold">
                                Number of Teams
                            </Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Set the maximum number of teams that can participate in the tournament.
                            </p>
                            <Input
                                id="maxTeams"
                                type="number"
                                value={maxTeams}
                                onChange={(e) => setMaxTeams(e.target.value)}
                                className="mt-2 bg-card/50 border-accent/20 focus:border-accent focus:ring-accent/20 text-sm"
                                min="1"
                                max="9999"
                                required
                            />
                            {maxTeams && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Tournament will accept up to <strong>{maxTeams}</strong> teams
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                                    <strong>Auto-Close Feature:</strong>
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    When the number of registered teams reaches the maximum allowed, registration will <strong>automatically close</strong>. Users won't be able to submit new registrations after this limit is reached.
                                </p>
                            </div>
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    <strong>Note:</strong> You can still manually toggle registration status using the button above, regardless of whether the max teams limit is reached.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSaving || !maxTeams}
                            className="w-full bg-gradient-to-r from-accent to-secondary text-white hover:shadow-lg gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                                    <span className="hidden sm:inline">Updating...</span>
                                    <span className="sm:hidden">Updating</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 flex-shrink-0" />
                                    Save Max Teams
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Set Deadline Card */}
            <Card className="border-2 border-secondary/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-secondary flex-shrink-0" />
                        <span className="truncate">Set Registration Deadline</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateDeadline} className="space-y-4 sm:space-y-6">
                        <div className="space-y-2 sm:space-y-3">
                            <Label htmlFor="deadline" className="text-sm sm:text-base font-semibold">
                                Registration Deadline Date & Time
                            </Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Select when you want to close registration. Users won't be able to submit forms after this time.
                            </p>
                            <Input
                                id="deadline"
                                type="datetime-local"
                                value={registrationDeadline}
                                onChange={(e) => setRegistrationDeadline(e.target.value)}
                                className="mt-2 bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-sm"
                                required
                            />
                            {registrationDeadline && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Selected: {new Date(registrationDeadline).toLocaleString()}
                                </p>
                            )}
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                <strong>Note:</strong> Once the deadline passes, users will see a "Registration Closed" message and won't be able to submit new registrations. You can manually toggle the registration status above.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSaving || !registrationDeadline}
                            className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                                    <span className="hidden sm:inline">Updating...</span>
                                    <span className="sm:hidden">Updating</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 flex-shrink-0" />
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
                    <CardTitle className="text-lg sm:text-xl">How Registration Deadline Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                    <p>
                        When you set a registration deadline, the system will automatically prevent users from submitting the tournament registration form after that time.
                    </p>
                    <p>You have two ways to control registration:</p>
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2 ml-2">
                        <li>
                            <strong>Using Deadline:</strong> Set a specific date and time. Registration closes automatically at that time.
                        </li>
                        <li>
                            <strong>Manual Toggle:</strong> Use the "Toggle Status" button to instantly open or close registration regardless of the deadline.
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
