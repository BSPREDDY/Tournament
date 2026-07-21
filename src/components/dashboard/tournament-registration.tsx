"use client"

import { useState } from "react"
import { Trophy, Users, Calendar, MapPin, Zap, Play, TrendingUp } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"

interface TournamentRegistrationProps {
    formData?: any
    loading?: boolean
}

export default function TournamentRegistration({
    formData,
    loading = false,
}: TournamentRegistrationProps) {
    const [expandedSection, setExpandedSection] = useState<string | null>("overview")

    // Sample channel data with related videos
    const channelData = [
        {
            id: 1,
            name: "NAG IronmanYT",
            subscribers: "250K",
            videos: 128,
            thumbnail:
                "https://images.unsplash.com/photo-1577720643272-265f434885b4?w=300&h=300&fit=crop",
            description: "Official tournament channel",
            url: "https://youtube.com/@nagironmanyt",
            featured: true,
        },
        {
            id: 2,
            name: "BGMI Pro League",
            subscribers: "185K",
            videos: 89,
            thumbnail:
                "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&h=300&fit=crop",
            description: "Competitive gaming streams",
            url: "https://youtube.com/bgmiproleague",
            featured: true,
        },
        {
            id: 3,
            name: "Gaming Elite",
            subscribers: "420K",
            videos: 156,
            thumbnail:
                "https://images.unsplash.com/photo-1598050108023-dffb3c3d1742?w=300&h=300&fit=crop",
            description: "Tournament analysis & highlights",
            url: "https://youtube.com/@gamingelite",
            featured: false,
        },
    ]

    const relatedVideos = [
        {
            id: 1,
            title: "How to Register for NAG Tournament",
            duration: "8:45",
            channel: "NAG IronmanYT",
            views: "15.2K",
            thumbnail:
                "https://images.unsplash.com/photo-1577720643272-265f434885b4?w=400&h=225&fit=crop",
        },
        {
            id: 2,
            title: "Tournament Rules & Guidelines",
            duration: "12:30",
            channel: "BGMI Pro League",
            views: "8.9K",
            thumbnail:
                "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=225&fit=crop",
        },
        {
            id: 3,
            title: "Team Registration Complete Guide",
            duration: "15:20",
            channel: "Gaming Elite",
            views: "22.5K",
            thumbnail:
                "https://images.unsplash.com/photo-1598050108023-dffb3c3d1742?w=400&h=225&fit=crop",
        },
        {
            id: 4,
            title: "5 Tips for Tournament Success",
            duration: "10:15",
            channel: "NAG IronmanYT",
            views: "18.7K",
            thumbnail:
                "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=225&fit=crop",
        },
    ]

    return (
        <div className="space-y-6">
            {/* Main Registration Card */}
            <div className="card-glow hover-lift rounded-2xl border border-amber-500/20 p-6 md:p-8 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text">
                                Tournament Registration
                            </h2>
                        </div>
                        <p className="text-amber-100/70">
                            Manage your team entry and real-time tournament status
                        </p>
                    </div>
                    {!formData && (
                        <Link href="/dashboard/form" className="w-full md:w-auto">
                            <Button className="w-full md:w-auto bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/40 font-bold rounded-full px-8 hover:scale-105 transition-all duration-300">
                                Register Now
                            </Button>
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="h-48 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500/30 border-t-amber-400" />
                    </div>
                ) : formData ? (
                    <div className="space-y-6">
                        {/* Team Overview */}
                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-amber-100/60 text-sm font-medium mb-2">
                                        Team Name
                                    </p>
                                    <p className="text-xl font-bold text-amber-300">
                                        {formData.teamName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-amber-100/60 text-sm font-medium mb-2">
                                        Status
                                    </p>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50 text-green-300 text-xs font-bold rounded-full">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        Confirmed
                                    </span>
                                </div>
                                <div>
                                    <p className="text-amber-100/60 text-sm font-medium mb-2">
                                        Players
                                    </p>
                                    <p className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                                        <Users className="w-4 h-4" /> 4
                                    </p>
                                </div>
                                <div>
                                    <p className="text-amber-100/60 text-sm font-medium mb-2">
                                        Entry Fee
                                    </p>
                                    <p className="text-lg font-bold text-emerald-300">₹5,000</p>
                                </div>
                            </div>
                        </div>

                        {/* Team Members Grid */}
                        <div>
                            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5" /> Team Members
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    {
                                        name: formData.iglName,
                                        id: formData.playerId1,
                                        role: "IGL",
                                    },
                                    {
                                        name: formData.player2,
                                        id: formData.playerId2,
                                        role: "Player",
                                    },
                                    {
                                        name: formData.player3,
                                        id: formData.playerId3,
                                        role: "Player",
                                    },
                                    {
                                        name: formData.player4,
                                        id: formData.playerId4,
                                        role: "Player",
                                    },
                                ].map((member, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-black/30 border border-amber-500/20 rounded-lg p-4 hover:border-amber-500/50 transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {(idx + 1).toString()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-white">{member.name}</p>
                                                <p className="text-xs text-amber-300/70">ID: {member.id}</p>
                                                <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                                                    {member.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-amber-500/20 rounded-xl">
                        <Trophy className="w-16 h-16 text-amber-500/30 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-amber-300 mb-2">
                            No team registered yet
                        </h3>
                        <p className="text-amber-100/60 mb-6">
                            Start your tournament journey by registering your squad
                        </p>
                        <Link href="/dashboard/form">
                            <Button className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 font-bold rounded-full px-8">
                                Register Your Team
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Featured Channels Section */}
            <div className="card-glow rounded-2xl border border-cyan-500/20 p-6 md:p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-cyan-300 mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5" /> Tournament Channels
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {channelData.map((channel) => (
                        <a
                            key={channel.id}
                            href={channel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`relative overflow-hidden rounded-xl border transition-all duration-300 group cursor-pointer ${channel.featured
                                ? "border-cyan-500/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 hover:shadow-lg hover:shadow-cyan-500/30"
                                : "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/50"
                                }`}
                        >
                            <div className="aspect-square relative overflow-hidden">
                                <img
                                    src={channel.thumbnail}
                                    alt={channel.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                                {channel.featured && (
                                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold">
                                        Featured
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1">
                                    {channel.name}
                                </h4>
                                <p className="text-xs text-gray-400 mb-3">{channel.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-300">
                                    <span>{channel.subscribers} subscribers</span>
                                    <span>{channel.videos} videos</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Related Videos Section */}
            <div className="card-glow rounded-2xl border border-emerald-500/20 p-6 md:p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-emerald-300 mb-6 flex items-center gap-2">
                    <Play className="w-5 h-5" /> Related Tournament Guides
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {relatedVideos.map((video) => (
                        <a
                            key={video.id}
                            href="#"
                            className="group overflow-hidden rounded-lg border border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300"
                        >
                            <div className="aspect-video relative overflow-hidden bg-black/50">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Play className="w-5 h-5 text-white fill-white" />
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-bold">
                                    {video.duration}
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-white text-xs font-bold line-clamp-2 group-hover:text-emerald-300 transition-colors mb-1">
                                    {video.title}
                                </p>
                                <p className="text-gray-400 text-xs mb-2">{video.channel}</p>
                                <div className="flex items-center gap-1 text-emerald-300 text-xs">
                                    <TrendingUp className="w-3 h-3" />
                                    {video.views}
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}