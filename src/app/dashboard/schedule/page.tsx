"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/src/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"

import { toast } from "sonner"
import { Calendar, Clock, Map, Zap } from "lucide-react"
import type { BgmiSchedule, User } from "@/src/db/schema/schema"

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<BgmiSchedule[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUserAndSchedules = async () => {
            try {
                // Get current user - this is client side, so we need to fetch it
                const userResponse = await fetch("/api/auth/check")
                if (!userResponse.ok) {
                    redirect("/auth/login")
                }
                const userData = await userResponse.json()
                setUser(userData.user)

                // Load schedules
                const response = await fetch("/api/admin/bgmi-schedule")
                if (response.ok) {
                    const data = await response.json()
                    setSchedules(data)
                }
            } catch (error) {
                toast.error("Failed to load schedules")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUserAndSchedules()
    }, [])

    if (isLoading || !user) {
        return (
            <div className="min-h-screen pt-20 pb-12">
                {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold">BGMI Schedule</h1>
                            <p className="text-muted-foreground mt-1">View tournament schedules</p>
                        </div>
                        <Card>*/}
                <CardContent className="pt-28">
                    <p className="text-center text-muted-foreground">Loading schedules...</p>
                </CardContent>
                {/* </Card>
                    </div>
                </div> */}
            </div>
        )
    }

    if (schedules.length === 0) {
        return (
            <>
                <div className="min-h-screen pt-20 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-2">
                                    BGMI Schedule
                                </h1>
                                <p className="text-muted-foreground mt-1">View tournament schedules</p>
                            </div>
                            <Card className="border-primary/10">
                                <CardContent className="pt-6">
                                    <p className="text-center text-muted-foreground">No schedules available yet</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="min-h-screen pt-5 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
                                BGMI Tournament Schedule
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Stay updated with the latest tournament dates, timings, maps, and match types.
                            </p>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <div className="min-w-full border border-primary/20 rounded-lg overflow-hidden shadow-lg">
                                <div className="grid grid-cols-4 gap-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                                    <div className="font-semibold p-4 text-center flex items-center justify-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Date
                                    </div>
                                    <div className="font-semibold p-4 text-center border-l border-primary/30 flex items-center justify-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Time
                                    </div>
                                    <div className="font-semibold p-4 text-center border-l border-primary/30 flex items-center justify-center gap-2">
                                        <Map className="w-4 h-4" />
                                        Maps
                                    </div>
                                    <div className="font-semibold p-4 text-center border-l border-primary/30 flex items-center justify-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        Type
                                    </div>
                                </div>

                                {/* Schedule Rows */}
                                {schedules.map((schedule, index) => (
                                    <div
                                        key={schedule.id}
                                        className={`grid grid-cols-4 gap-0 transition-colors hover:bg-primary/5 ${index % 2 === 0 ? "bg-background/50" : "bg-background"
                                            }`}
                                    >
                                        <div className="p-4 text-center text-sm font-medium border-t border-primary/10">
                                            {schedule.date}
                                        </div>
                                        <div className="p-4 text-center text-sm border-t border-l border-primary/10 whitespace-pre-wrap">
                                            {schedule.time}
                                        </div>
                                        <div className="p-4 text-center text-sm border-t border-l border-primary/10 whitespace-pre-wrap">
                                            {schedule.maps}
                                        </div>
                                        <div className="p-4 text-center text-sm border-t border-l border-primary/10">
                                            <Badge variant="outline">{schedule.type}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {schedules.map((schedule) => (
                                <Card key={schedule.id} className="border-primary/10 hover:border-primary/30 transition-colors">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                    {schedule.date}
                                                </CardTitle>
                                                <CardDescription className="mt-2">
                                                    <Badge variant="secondary">{schedule.type}</Badge>
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Clock className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                        Time
                                                    </p>
                                                    <p className="text-sm whitespace-pre-wrap mt-1">{schedule.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Map className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                        Maps
                                                    </p>
                                                    <p className="text-sm whitespace-pre-wrap mt-1">{schedule.maps}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
