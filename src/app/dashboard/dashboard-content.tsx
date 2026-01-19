"use client"

import { useState, useEffect } from "react"
import type { User } from "@/src/db/schema/schema"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { Trophy } from "lucide-react"
import { UserNavbar } from "@/src/components/user/navbar"

interface DashboardContentProps {
  user: User
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [formData, setFormData] = useState<any>(null)
  const [dynamicFields, setDynamicFields] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await fetchFormData()
      setLoading(false)
    }
    loadData()
  }, [])

  const fetchFormData = async () => {
    try {
      const response = await fetch("/api/form")
      const data = await response.json()
      if (response.ok) {
        setFormData(data.formData)
      }
    } catch (error) {
      console.error("Error fetching form data:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar user={user} />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-glow rounded-xl border p-4 sm:p-6 slide-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Tournament Registration</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage your team entry and status</p>
                </div>
                {!formData && (
                  <Link href="/form" className="w-full sm:w-auto">
                    <Button className="shadow-lg bg-gradient-to-r from-primary to-secondary hover:shadow-xl transition-shadow w-full sm:w-auto">
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
                  <Link href="/form">
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
            <div className="card-glow rounded-xl border p-4 sm:p-6 slide-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-base sm:text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all duration-200 group text-sm"
                >
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-2 rounded-md group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors flex-shrink-0">
                    <span className="text-lg">👤</span>
                  </div>
                  <span className="font-medium">My Profile</span>
                </Link>
                <Link
                  href="/dashboard/security"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-500/5 transition-all duration-200 group text-sm"
                >
                  <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-md group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors flex-shrink-0">
                    <span className="text-lg">🔒</span>
                  </div>
                  <span className="font-medium">Security</span>
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="card-glow rounded-xl border p-4 sm:p-6 slide-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-base sm:text-lg font-bold mb-4">Connect With Us</h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://www.instagram.com/nagironman?igsh=b3NvMmhsdHFkaWVh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950 dark:to-orange-950 hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-xs"
                >
                  <span className="text-xl">📷</span>
                  <span className="font-bold uppercase tracking-widest text-pink-700 dark:text-pink-300">
                    Instagram
                  </span>
                </a>
                <a
                  href="https://www.youtube.com/@nagironmanyt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-xs"
                >
                  <span className="text-xl">▶️</span>
                  <span className="font-bold uppercase tracking-widest text-red-700 dark:text-red-300">YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
