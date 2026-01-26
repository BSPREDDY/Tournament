"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { toast } from "sonner"
import { Users, Trophy, Phone, Mail, Gamepad2 } from "lucide-react"
import type { FormData, User } from "@/src/db/schema/schema"

interface TeamWithUser extends FormData {
    user?: User
}
// Player field keys from FormData
export type PlayerKey =
    | "player1"
    | "player2"
    | "player3"
    | "player4"

// Player ID field keys from FormData
export type PlayerIdKey =
    | "playerId1"
    | "playerId2"
    | "playerId3"
    | "playerId4"

export default function RegisteredTeamsPage() {
    const [teams, setTeams] = useState<TeamWithUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUserAndTeams = async () => {
            try {
                // Get current user
                const userResponse = await fetch("/api/auth/check")
                if (!userResponse.ok) {
                    redirect("/auth/login")
                }
                const userData = await userResponse.json()
                setUser(userData.user)

                // Load teams from the form API
                const response = await fetch("/api/teams")
                if (response.ok) {
                    const data = await response.json()
                    console.log("[v0] Teams fetched successfully:", data?.length || 0)
                    // Sort by team name
                    const sortedTeams = data.sort((a: FormData, b: FormData) => {
                        return a.teamName.localeCompare(b.teamName)
                    })
                    setTeams(sortedTeams)
                } else {
                    console.log("[v0] Failed to fetch teams, status:", response.status)
                }
            } catch (error) {
                console.log("[v0] Error fetching teams:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUserAndTeams()
    }, [])

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Registered Teams</h1>
                        <p className="text-muted-foreground mt-1">View all registered tournament teams</p>
                    </div>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">Loading teams...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!user) {
        redirect("/auth/login")
    }

    if (teams.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-6 text-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
                            Registered Teams
                        </h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            View all registered tournament teams
                        </p>
                    </div>
                    <Card className="border-primary/10">
                        <CardContent className="pt-6">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No teams registered yet</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
                                Tournament Teams
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Explore all the teams registered for the BGMI tournament competition.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <Card className="border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Teams</p>
                                            <p className="text-3xl font-bold text-primary">{teams.length}</p>
                                        </div>
                                        <Trophy className="w-8 h-8 text-primary/50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-primary/10 bg-gradient-to-br from-secondary/5 to-transparent">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Players</p>
                                            <p className="text-3xl font-bold text-secondary">{teams.length * 4}</p>
                                        </div>
                                        <Users className="w-8 h-8 text-secondary/50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-primary/10 bg-gradient-to-br from-accent/5 to-transparent">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Game Leaders</p>
                                            <p className="text-3xl font-bold">{teams.length}</p>
                                        </div>
                                        <Gamepad2 className="w-8 h-8 text-accent/50" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Teams Table View */}
                        <Card className="border-primary/10 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-3">
                                <CardTitle>Team Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50 border-b border-primary/10">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">No.</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Team Name</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">IGL Name</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">IGL Contact</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/10">
                                            {teams.map((team, index) => (
                                                <tr
                                                    key={team.id}
                                                    className="hover:bg-primary/5 transition-colors group cursor-pointer"
                                                >
                                                    <td className="px-4 py-3 text-sm font-medium text-foreground">{index + 1}</td>
                                                    <td className="px-4 py-3 text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                                                        {team.teamName}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-foreground flex items-center gap-2">
                                                        <Gamepad2 className="w-4 h-4 text-primary/60" />
                                                        {team.iglName}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="space-y-1">
                                                            <a
                                                                href={`mailto:${team.iglMail}`}
                                                                className="text-primary hover:underline block text-xs"
                                                            >
                                                                {team.iglMail}
                                                            </a>
                                                            <a
                                                                href={`tel:${team.iglNumber}`}
                                                                className="text-primary hover:underline block text-xs"
                                                            >
                                                                {team.iglNumber}
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Teams Grid - Detailed View */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-6">Team Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teams.map((team) => (
                                    <Card
                                        key={team.id}
                                        className="border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg overflow-hidden group"
                                    >
                                        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                                                        {team.teamName}
                                                    </CardTitle>
                                                    <CardDescription className="mt-1 flex items-center gap-1">
                                                        <Gamepad2 className="w-3 h-3" />
                                                        IGL: {team.iglName}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant="secondary" className="flex-shrink-0">
                                                    Registered
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* IGL Section */}
                                            <div className="border-b border-primary/10 pb-4">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                                    In-Game Leader
                                                </p>
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground text-xs">Name</p>
                                                        <p className="font-medium text-foreground">{team.iglName}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3 h-3 text-primary" />
                                                        <a
                                                            href={`mailto:${team.iglMail}`}
                                                            className="text-primary hover:underline break-all text-xs font-medium"
                                                        >
                                                            {team.iglMail}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3 h-3 text-primary" />
                                                        <a
                                                            href={`tel:${team.iglNumber}`}
                                                            className="text-primary hover:underline text-xs font-medium"
                                                        >
                                                            {team.iglNumber}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Players Section */}
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                                    Players
                                                </p>
                                                <div className="space-y-2">
                                                    {[1, 2, 3, 4].map((playerNum) => {
                                                        const playerKey = `player${playerNum}` as PlayerKey
                                                        const playerIdKey = `playerId${playerNum}` as PlayerIdKey

                                                        const playerName = team[playerKey]
                                                        const playerId = team[playerIdKey]


                                                        return (
                                                            <div
                                                                key={playerNum}
                                                                className="text-sm bg-gradient-to-r from-primary/5 to-secondary/5 p-2 rounded-md border border-primary/10 hover:border-primary/20 transition-colors"
                                                            >
                                                                <p className="font-medium truncate text-foreground">{playerName}</p>
                                                                <p className="text-xs text-muted-foreground">ID: {playerId}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
