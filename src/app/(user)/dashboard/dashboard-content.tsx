"use client"

import { useState, useEffect, useMemo } from "react"
import type { User } from "@/src/db/schema/schema"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { Instagram, Trophy, Youtube, Clock, Play, Users, TrendingUp } from "lucide-react"
import { tournamentChannels, tournamentVideos, tournamentStats } from "@/src/lib/tournament-data"
import Hero3D from "@/src/components/dashboard/hero-3d"
import TournamentRegistration from "@/src/components/dashboard/tournament-registration"

interface DashboardContentProps {
  user: User
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [formData, setFormData] = useState<any>(null)
  const [dynamicFields, setDynamicFields] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [roomCredentials, setRoomCredentials] = useState<any>(null)

  // Use useMemo to prevent recalculation of memoized values
  const memoizedUser = useMemo(() => user, [user])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (isMounted) {
        await fetchFormData()
        if (isMounted) setLoading(false)
      }
    }
    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const fetchFormData = async () => {
    try {
      const response = await fetch("/api/form")
      if (!response.ok) {
        if (response.status === 401) {
          console.warn("[v0] Unauthorized form fetch")
          setLoading(false)
          return
        }
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      if (data.formData) {
        setFormData(data.formData)
      }
    } catch (error) {
      console.error("[v0] Error fetching form data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoomCredentials = async () => {
    try {
      const response = await fetch("/api/room-credentials")
      if (response.ok) {
        const data = await response.json()
        if (data.roomId && data.roomPassword) {
          setRoomCredentials(data)
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching room credentials:", error)
    }
  }

  return (
    <main className="w-full max-w-7xl mx-auto py-6 sm:py-8 md:py-10 px-2 sm:px-4 md:px-6 lg:px-8 flex-1">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* 3D Hero Section with Videos */}
      <Hero3D
        videos={tournamentVideos.slice(0, 6).map((v) => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          duration: v.duration,
          views: v.views,
        }))}
      />

      {/* Enhanced Tournament Registration Section */}
      {/* <TournamentRegistration formData={formData} loading={loading} /> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Tournament Channels */}
          <div className="card-glow hover-lift rounded-2xl border p-4 sm:p-6 slide-in backdrop-blur-sm" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Featured Channels</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Follow tournament broadcasts and updates</p>
              </div>
              <Youtube className="w-8 h-8 text-red-500 opacity-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tournamentChannels.map((channel) => (
                <a
                  key={channel.id}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl border border-primary/10 hover:border-primary/50 bg-gradient-to-br from-black/40 to-black/20 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={channel.thumbnail}
                      alt={channel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/90 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2 flex-1">{channel.name}</h3>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-500/20 text-red-400 whitespace-nowrap ml-2">
                        {channel.platform}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{channel.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {channel.subscribers}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Tournament Videos */}
          <div className="card-glow hover-lift rounded-2xl border p-4 sm:p-6 slide-in backdrop-blur-sm" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Tournament Videos</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Watch latest tournament highlights and analysis</p>
              </div>
              <Play className="w-8 h-8 text-amber-500 opacity-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournamentVideos.slice(0, 4).map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl border border-primary/10 hover:border-primary/50 bg-gradient-to-br from-black/40 to-black/20 hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/90 transition-all" />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {video.views}
                      </span>
                      <span>{video.uploadedAt}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <Link href="#" className="inline-flex items-center justify-center w-full mt-6">
              <Button variant="outline" className="w-full hover:bg-primary/10">
                View All Videos
              </Button>
            </Link>
          </div>

          {/* Tournament Stats */}
          {/* <div className="card-glow hover-lift rounded-2xl border p-4 sm:p-6 slide-in backdrop-blur-sm" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">Tournament Statistics</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20 hover:border-primary/50 transition-all">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Total Teams</div>
                <div className="text-2xl sm:text-3xl font-black text-primary mt-2">{tournamentStats.totalTeams}</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/50 transition-all">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Players</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-2">{tournamentStats.registeredPlayers}</div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Days</div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-500 mt-2">{tournamentStats.tournamentDays}</div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/50 transition-all">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Prize Pool</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-500 mt-2">{tournamentStats.totalPrizePool}</div>
              </div>

              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/50 transition-all">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Channels</div>
                <div className="text-2xl sm:text-3xl font-black text-pink-500 mt-2">{tournamentStats.channels}</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/50 transition-all">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Videos</div>
                <div className="text-2xl sm:text-3xl font-black text-purple-500 mt-2">{tournamentStats.totalVideos}</div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Links */}
          <div className="card-glow hover-lift rounded-2xl border p-4 sm:p-6 slide-in backdrop-blur-sm" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-base sm:text-lg font-bold mb-4 gradient-text">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-300 group text-sm scale-hover"
              >
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-2.5 rounded-lg group-hover:from-primary/40 group-hover:to-secondary/40 transition-all duration-300 flex-shrink-0 group-hover:shadow-lg group-hover:shadow-primary/20">
                  <span className="text-lg">👤</span>
                </div>
                <span className="font-medium group-hover:text-primary transition-colors">My Profile</span>
              </Link>
              <Link
                href="/dashboard/security"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-500/10 transition-all duration-300 group text-sm scale-hover"
              >
                <div className="bg-gradient-to-br from-orange-100/50 to-orange-200/50 dark:from-orange-900/30 dark:to-orange-800/30 p-2.5 rounded-lg group-hover:from-orange-200 dark:group-hover:from-orange-800 group-hover:to-orange-300 dark:group-hover:to-orange-700 transition-all duration-300 flex-shrink-0 group-hover:shadow-lg group-hover:shadow-orange-500/20">
                  <span className="text-lg">🔒</span>
                </div>
                <span className="font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Security</span>
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="card-glow hover-lift rounded-2xl border p-4 sm:p-6 slide-in backdrop-blur-sm" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-base sm:text-lg font-bold mb-4 gradient-text">Follow Us</h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://www.instagram.com/nagironman?igsh=b3NvMmhsdHFkaWVh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-pink-200/50 dark:border-pink-800/50 bg-gradient-to-br from-pink-50/80 to-orange-50/80 dark:from-pink-950/50 dark:to-orange-950/50 hover:from-pink-100 hover:to-orange-100 dark:hover:from-pink-900 dark:hover:to-orange-900 hover:border-pink-400 dark:hover:border-pink-600 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 transform hover:scale-110 text-xs group scale-hover"
              >
                <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold uppercase tracking-widest text-pink-700 dark:text-pink-300 text-xs">
                  Instagram
                </span>
              </a>
              <a
                href="https://www.youtube.com/@nagironmanyt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-950/50 dark:to-rose-950/50 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900 dark:hover:to-rose-900 hover:border-red-400 dark:hover:border-red-600 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-110 text-xs group scale-hover"
              >
                <Youtube className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold uppercase tracking-widest text-red-700 dark:text-red-300 text-xs">YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
