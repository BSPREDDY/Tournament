"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { toast } from "sonner"
import { Users, Trophy, Phone, Mail, Gamepad2, Info, X } from "lucide-react"
import type { FormData, User } from "@/src/db/schema/schema"

interface TeamWithUser extends FormData {
    user?: User
    slot?: number
    matchNumber?: number
    positionInMatch?: number
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
    const [showSlotsAlert, setShowSlotsAlert] = useState(true)
    const [totalMatches, setTotalMatches] = useState(0)

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
                    console.log("[v0] Teams fetched successfully:", data?.teams?.length || 0)
                    // Use teams array from API response
                    const fetchedTeams = data.teams || data
                    setTotalMatches(data.totalMatches || Math.ceil(fetchedTeams.length / 25))
                    // Sort by team name
                    const sortedTeams = fetchedTeams.sort((a: TeamWithUser, b: TeamWithUser) => {
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
            <div className="min-h-screen pt-20 pb-12">
                {/* <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Registered Teams</h1>
                        <p className="text-muted-foreground mt-1">View all registered tournament teams</p>
                    </div>
                    <Card> */}
                <CardContent className="pt-28">
                    <p className="text-center text-muted-foreground">Loading teams...</p>
                </CardContent>
                {/* </Card>
                </div> */}
            </div>
        )
    }

    if (!user) {
        redirect("/auth/login")
    }

    if (teams.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-6 text-center">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-3 sm:mb-4">
                            Registered Teams
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base lg:text-lg">
                            View all registered tournament teams
                        </p>
                    </div>
                    <Card className="border-primary/10">
                        <CardContent className="pt-6">
                            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm sm:text-base text-muted-foreground">No teams registered yet</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Registered Teams</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">View all registered tournament teams</p>
                    </div>
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-sm text-muted-foreground">Loading teams...</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="w-full pb-8 sm:pb-12">
                <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Slots Info Alert */}
                        {showSlotsAlert && (
                            <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3 group hover:bg-blue-500/15 transition-all">
                                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                                        <strong>Match Slots:</strong> Each match accommodates 25 teams. The "Slot" column shows your team's position in the match. The "Players" column shows how many players have registered for your team (e.g., 3/4 means 3 out of 4 players have registered).
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowSlotsAlert(false)}
                                    className="flex-shrink-0 text-blue-600 hover:text-blue-700 mt-0.5"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Header */}
                        <div className="text-center mb-8 sm:mb-12">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-3 sm:mb-4">
                                Tournament Teams
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                                Explore all the teams registered for the BGMI tournament competition.
                            </p>
                        </div>

                        {/* Stats */}
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
                            <Card className="border-primary/10 bg-gradient-to-br from-purple-500/5 to-transparent">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Matches</p>
                                            <p className="text-3xl font-bold text-purple-600">{totalMatches}</p>
                                        </div>
                                        <Trophy className="w-8 h-8 text-purple-500/50" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div> */}

                        {/* Teams Table View */}
                        <Card className="border-primary/10 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-2 sm:pb-3">
                                <CardTitle className="text-base sm:text-lg">Team List</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs sm:text-sm">
                                        <thead className="bg-muted/50 border-b border-primary/10">
                                            <tr>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">No.</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Team Name</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground hidden sm:table-cell">IGL Name</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Slot</th>
                                                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Players</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/10">
                                            {teams.map((team, index) => {
                                                const players = [team.player1, team.player2, team.player3, team.player4].filter(Boolean).length
                                                return (
                                                    <tr
                                                        key={team.id}
                                                        className="hover:bg-primary/5 transition-colors group cursor-pointer"
                                                    >
                                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-foreground">{index + 1}</td>
                                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                                                            <div className="flex flex-col">
                                                                <span>{team.teamName}</span>
                                                                <span className="sm:hidden text-muted-foreground text-xs">IGL: {team.iglName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground flex items-center gap-2">
                                                            <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary/60 flex-shrink-0" />
                                                            <span className="truncate">{team.iglName}</span>
                                                        </td>
                                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">
                                                            <span className="inline-block px-2 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                                                                Slot {team.positionInMatch}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${players === 4 ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'}`}>
                                                                {players}/4
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </div>
        </>
    )
}
