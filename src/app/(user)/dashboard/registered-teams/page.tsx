"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
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

// Memoized table row component to prevent unnecessary re-renders
const TeamTableRow = memo(({
    team,
    index,
    maxSlots
}: {
    team: TeamWithUser
    index: number
    maxSlots: number
}) => {
    const players = [team.player1, team.player2, team.player3, team.player4].filter(Boolean).length

    // ✅ FIXED HERE
    const slotNumber = 25 - (index % 25)

    const getSlotColor = useCallback((slot: number) => {
        if (slot <= 3) return 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
        if (slot <= 8) return 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30'
        return 'bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30'
    }, [])

    return (
        <tr
            key={team.id}
            className="hover:bg-primary/10 transition-all duration-300 group cursor-pointer border-b border-primary/5 hover:border-primary/20"
        >
            <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">{index + 1}</td>
            <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-foreground font-semibold group-hover:text-primary transition-colors">
                <div className="flex flex-col gap-0.5">
                    <span className="line-clamp-1">{team.teamName}</span>
                    <span className="sm:hidden text-muted-foreground text-xs">IGL: {team.iglName}</span>
                </div>
            </td>
            <td className="hidden sm:table-cell px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-foreground flex items-center gap-2">
                <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary/50 flex-shrink-0" />
                <span className="truncate text-muted-foreground group-hover:text-foreground transition-colors">{team.iglName}</span>
            </td>
            <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-bold">
                <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${getSlotColor(slotNumber)}`}>
                    {slotNumber}
                </span>
            </td>
            <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold">
                <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${players === 4
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}>
                    {players}/4
                </span>
            </td>
        </tr>
    )
})

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
                const userResponse = await fetch("/api/auth/check", { cache: 'no-store' })
                if (!userResponse.ok) {
                    redirect("/auth/login")
                }
                const userData = await userResponse.json()
                setUser(userData.user)

                // Load teams from the form API
                const response = await fetch("/api/teams", { cache: 'no-store' })
                if (response.ok) {
                    const data = await response.json()
                    // Use teams array from API response
                    const fetchedTeams = data.teams || data
                    setTotalMatches(data.totalMatches || Math.ceil(fetchedTeams.length / 25))
                    // Sort by team name
                    const sortedTeams = fetchedTeams.sort((a: TeamWithUser, b: TeamWithUser) => {
                        return a.teamName.localeCompare(b.teamName)
                    })
                    setTeams(sortedTeams)
                }
            } catch (error) {
                // Silent fail - user will see empty state
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
                            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-500/40 rounded-xl flex items-start gap-3 group hover:border-blue-500/60 transition-all duration-300 shadow-lg shadow-blue-500/10 animate-[slideInDown_0.5s_ease-out]">
                                <Info className="w-5 h-5 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5 animate-pulse" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-1 text-sm sm:text-base">Slot Information</h3>
                                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
                                        Tournament slots are numbered <strong>25 down to 1</strong>, where slot 1 is the last available position. The "Slot" column shows your team's registration sequence. The "Players" column shows your team's completion status (e.g., 3/4 means 3 out of 4 players have registered). Login to view team details and player slots.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowSlotsAlert(false)}
                                    className="flex-shrink-0 text-blue-600 hover:text-blue-700 dark:hover:text-blue-300 mt-0.5 transition-colors hover:bg-blue-500/20 p-1 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Header */}
                        <div className="text-center mb-10 sm:mb-14 slide-in">
                            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
                                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-bounce" />
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                                    Tournament Teams
                                </h1>
                                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-2 leading-relaxed">
                                Explore all registered teams competing in the tournament. Login to register your team and secure your slot.
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
                        <Card className="border-primary/20 overflow-hidden card-glow hover-lift animate-[slideInUp_0.5s_ease-out]">
                            <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent pb-3 sm:pb-4 border-b border-primary/10">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg sm:text-xl font-bold">Registered Teams</CardTitle>
                                    <span className="ml-auto px-3 py-1 bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-semibold">
                                        {teams.length} Teams
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs sm:text-sm">
                                        <thead className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-primary/15 sticky top-0">
                                            <tr>
                                                <th className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">No.</th>
                                                <th className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Team Name</th>
                                                <th className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">IGL Name</th>
                                                <th className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Slot</th>
                                                <th className="px-2 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Players</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-primary/5">
                                            {teams.map((team, index) => {
                                                const totalTeams = teams.length
                                                const maxSlots = Math.min(totalTeams, 25)

                                                return <TeamTableRow key={team.id} team={team} index={index} maxSlots={maxSlots} />
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
