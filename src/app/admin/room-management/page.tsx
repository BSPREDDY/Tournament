'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { AlertCircle, Copy, Check, Users, Lock } from 'lucide-react'
import { useToast } from '@/src/hooks/use-toast'

interface RoomData {
    id: string
    matchNumber: string
    roomId: string
    roomPassword: string
    registeredTeams: number
    maxTeams: number
    isLocked: boolean
    visibleToAll: boolean
    createdAt: string
}

export default function RoomManagementPage() {
    const [rooms, setRooms] = useState<RoomData[]>([])
    const [newRoomId, setNewRoomId] = useState('')
    const [newRoomPassword, setNewRoomPassword] = useState('')
    const [showRegisteredOnly, setShowRegisteredOnly] = useState(false)
    const [loading, setLoading] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/room-management')
            if (!response.ok) throw new Error('Failed to fetch rooms')
            const data = await response.json()
            setRooms(data)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load rooms',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newRoomId.trim() || !newRoomPassword.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Please enter both Room ID and Password',
                variant: 'destructive',
            })
            return
        }

        try {
            setLoading(true)
            const response = await fetch('/api/admin/room-management', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: newRoomId,
                    roomPassword: newRoomPassword,
                }),
            })

            if (!response.ok) throw new Error('Failed to create room')

            toast({
                title: 'Success',
                description: 'Room created successfully',
            })

            setNewRoomId('')
            setNewRoomPassword('')
            fetchRooms()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create room',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCopyToClipboard = (text: string, roomId: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(roomId)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleToggleVisibility = async (roomId: string, currentVisibility: boolean) => {
        try {
            const response = await fetch(`/api/admin/room-management/${roomId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visibleToAll: !currentVisibility }),
            })

            if (!response.ok) throw new Error('Failed to update visibility')

            toast({
                title: 'Success',
                description: `Room visibility updated to ${!currentVisibility ? 'Everyone' : 'Registered teams only'}`,
            })

            fetchRooms()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update room visibility',
                variant: 'destructive',
            })
        }
    }

    const filteredRooms = showRegisteredOnly
        ? rooms.filter((room) => room.registeredTeams > 0)
        : rooms

    return (
        <div className="space-y-8 px-2 sm:px-0">
            <div className="text-center sm:text-left slide-in">
                <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
                    <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-widest">Tournament Management</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">Room Management</h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    Create and manage match rooms with 25 teams each. Auto-create new matches when full.
                </p>
            </div>

            {/* Create Room Form */}
            <Card className="card-glow rounded-2xl border slide-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold gradient-text">Create New Room</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Generate Room ID and Password for tournament matches</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateRoom} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs sm:text-sm font-semibold mb-2 block">Room ID</label>
                                <Input
                                    placeholder="e.g., MATCH-25-001"
                                    value={newRoomId}
                                    onChange={(e) => setNewRoomId(e.target.value)}
                                    className="text-xs sm:text-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm font-semibold mb-2 block">Room Password</label>
                                <Input
                                    placeholder="e.g., Pass@1234"
                                    type="password"
                                    value={newRoomPassword}
                                    onChange={(e) => setNewRoomPassword(e.target.value)}
                                    className="text-xs sm:text-sm rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 sm:flex-initial text-xs sm:text-sm font-bold rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
                            >
                                Create Room
                            </Button>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2 text-xs sm:text-sm">
                            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-blue-800 dark:text-blue-300">
                                Each room supports 25 teams. When a room is full, a new match will be automatically created.
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Filter Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                    variant={!showRegisteredOnly ? 'default' : 'outline'}
                    onClick={() => setShowRegisteredOnly(false)}
                    className="text-xs sm:text-sm rounded-lg flex-1 sm:flex-initial"
                >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    All Rooms
                </Button>
                <Button
                    variant={showRegisteredOnly ? 'default' : 'outline'}
                    onClick={() => setShowRegisteredOnly(true)}
                    className="text-xs sm:text-sm rounded-lg flex-1 sm:flex-initial"
                >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Registered Teams Only
                </Button>
            </div>

            {/* Rooms List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredRooms.map((room, index) => (
                    <Card
                        key={room.id}
                        className="card-glow hover-lift rounded-2xl border slide-in"
                        style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                    <CardTitle className="text-base sm:text-lg font-bold gradient-text break-words">{room.matchNumber}</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm mt-1">Room {room.roomId}</CardDescription>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {room.registeredTeams >= 25 && (
                                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs whitespace-nowrap">Full</Badge>
                                    )}
                                    <Badge className={`text-xs whitespace-nowrap ${room.visibleToAll ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                                        {room.visibleToAll ? 'Public' : 'Registered'}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Team Count */}
                            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3">
                                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Teams Registered</div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl sm:text-2xl font-bold gradient-text">{room.registeredTeams}</span>
                                    <span className="text-xs sm:text-sm text-muted-foreground">/ {room.maxTeams}</span>
                                </div>
                                <div className="mt-2 w-full bg-secondary/20 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(room.registeredTeams / room.maxTeams) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Room ID & Password */}
                            <div className="space-y-2">
                                <div className="bg-muted rounded-lg p-2 flex justify-between items-center gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-0.5">Room ID</p>
                                        <p className="text-xs sm:text-sm font-mono font-bold break-all">{room.roomId}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(room.roomId, room.id)}
                                        className="p-1.5 sm:p-2 hover:bg-primary/10 rounded transition-colors flex-shrink-0"
                                    >
                                        {copiedId === room.id ? (
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                        )}
                                    </button>
                                </div>

                                <div className="bg-muted rounded-lg p-2 flex justify-between items-center gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> Password
                                        </p>
                                        <p className="text-xs sm:text-sm font-mono font-bold break-all">{room.roomPassword}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(room.roomPassword, room.id)}
                                        className="p-1.5 sm:p-2 hover:bg-primary/10 rounded transition-colors flex-shrink-0"
                                    >
                                        {copiedId === room.id ? (
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground mb-4">
                                Created: {new Date(room.createdAt).toLocaleDateString()}
                            </div>

                            {/* Visibility Toggle Button */}
                            <Button
                                onClick={() => handleToggleVisibility(room.id, room.visibleToAll)}
                                variant="outline"
                                className="w-full text-xs sm:text-sm rounded-lg hover:bg-primary/10 transition-all"
                            >
                                {room.visibleToAll ? 'Show to Everyone' : 'Show to Registered Teams Only'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredRooms.length === 0 && (
                <Card className="card-glow rounded-2xl border text-center py-12">
                    <CardContent>
                        <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <p className="text-sm sm:text-base text-muted-foreground">No rooms available</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
