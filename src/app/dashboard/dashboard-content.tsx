"use client"

import { useState, useEffect, useMemo } from "react"
import type { User } from "@/src/db/schema/schema"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { Instagram, Trophy, Youtube, Clock } from "lucide-react"

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

      {/* Room Credentials Notification
      {formData && (
        <div className="mb-8 p-4 sm:p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 slide-in">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base mb-2 text-amber-900 dark:text-amber-300">
                Important: Match Room Credentials
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-400 mb-3 leading-relaxed">
                Your match room credentials will be shared approximately 20 minutes before the tournament begins. Please ensure all team members are ready at least 15 minutes before the scheduled start time to join the room with your credentials.
              </p>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 text-xs sm:text-sm">
                <p className="text-amber-700 dark:text-amber-300">
                  <span className="font-semibold">Status:</span> Waiting for room assignment. Check back soon for your Room ID and Password.
                </p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card-glow hover-lift rounded-2xl border p-4 sm:p-6 slide-in backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Tournament Registration</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your team entry and status</p>
              </div>
              {!formData && (
                <Link href="/dashboard/form" className="w-full sm:w-auto">
                  <Button className="shadow-lg hover:shadow-2xl shadow-primary/30 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold transition-all duration-300 w-full sm:w-auto hover:scale-105">
                    Register Team
                  </Button>
                </Link>
              )}
            </div>

            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/30 border-t-primary"></div>
              </div>
            ) : formData ? (
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 sm:p-6 border border-primary/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h4 className="text-lg sm:text-xl font-bold text-primary">{formData.teamName}</h4>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
                    Confirmed
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card/50 rounded-lg p-3 border border-primary/5">
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground">IGL</label>
                    <p className="font-medium text-sm break-words">{formData.iglName}</p>
                  </div>
                  <div className="bg-card/50 rounded-lg p-3 border border-primary/5">
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground">Players</label>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p>
                        1. {formData.player1} ({formData.playerId1})
                      </p>
                      <p>
                        2. {formData.player2} ({formData.playerId2})
                      </p>
                      <p>
                        3. {formData.player3} ({formData.playerId3})
                      </p>
                      <p>
                        4. {formData.player4} ({formData.playerId4})
                      </p>
                    </div>
                  </div>
                  <div className="bg-card/50 rounded-lg p-3 border border-primary/5">
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground">Contact</label>
                    <p className="text-xs sm:text-sm break-words">Email: {formData.iglMail}</p>
                    <p className="text-xs sm:text-sm break-words">Alt: {formData.iglAlternateMail}</p>
                  </div>
                  <div className="bg-card/50 rounded-lg p-3 border border-primary/5">
                    <label className="block text-xs sm:text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-xs sm:text-sm">Primary: {formData.iglNumber}</p>
                    <p className="text-xs sm:text-sm">Alt: {formData.iglAlternateNumber}</p>
                  </div>
                  {dynamicFields.map(
                    (field) =>
                      formData[field.name] && (
                        <div key={field.name} className="bg-card/50 rounded-lg p-3 border border-primary/5">
                          <label className="block text-xs sm:text-sm font-medium text-muted-foreground">
                            {field.label}
                          </label>
                          <p className="text-xs sm:text-sm break-words">{formData[field.name]}</p>
                        </div>
                      ),
                  )}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Submitted on: {new Date(formData.createdAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/40 transition-colors">
                <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium">No team registered</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6 px-4">
                  Ready to compete? Start by registering your squad.
                </p>
                <Link href="/dashboard/form">
                  <Button
                    variant="outline"
                    className="hover:bg-primary/5 bg-transparent text-sm w-full sm:w-auto px-4"
                  >
                    Register Your Team
                  </Button>
                </Link>
              </div>
            )}
          </div>
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
            <h3 className="text-base sm:text-lg font-bold mb-4 gradient-text">Connect With Us</h3>
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
