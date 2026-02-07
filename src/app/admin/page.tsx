"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Config {
  id: string
  registrationStopAt: string | null
  isRegistrationOpen: boolean
}

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0)
  const [formCount, setFormCount] = useState(0)
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      // Load config
      const configRes = await fetch("/api/admin/registration-config")
      if (configRes.ok) {
        const configData: Config = await configRes.json()
        setConfig(configData)
      }

      // Load counts
      const usersRes = await fetch("/api/admin/users")
      if (usersRes.ok) {
        const users = await usersRes.json()
        setUserCount(users.length)
      }

      const formsRes = await fetch("/api/admin/forms")
      if (formsRes.ok) {
        const forms = await formsRes.json()
        setFormCount(forms.length)
      }
    } catch (error) {
      console.error("Failed to load dashboard", error)
    }
  }

  const getRegistrationStatus = () => {
    if (!config) return "Loading..."
    if (!config.registrationStopAt) return "Open (No deadline)"

    const stopDate = new Date(config.registrationStopAt)
    const now = new Date()

    if (stopDate <= now) {
      return "Closed"
    }

    const daysLeft = Math.ceil((stopDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return `Open (${daysLeft} days left)`
  }

  return (
    <div className="space-y-8 px-2 sm:px-0">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="text-center sm:text-left slide-in">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-widest">Platform Overview</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Admin Dashboard</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back! Here's an overview of your platform
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="card-glow hover-lift rounded-2xl hover:shadow-2xl shadow-lg shadow-primary/10 transition-all duration-300 border-primary/20 slide-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-bold uppercase tracking-wider">Total Users</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-3 sm:text-4xl font-black gradient-text">{userCount}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Registered users</p>
          </CardContent>
        </Card>

        <Card className="card-glow hover-lift rounded-2xl hover:shadow-2xl shadow-lg shadow-secondary/10 transition-all duration-300 border-secondary/20 slide-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-bold uppercase tracking-wider">Form Submissions</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-3 sm:text-4xl font-black bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">{formCount}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Teams registered</p>
          </CardContent>
        </Card>

        <Card className="card-glow hover-lift rounded-2xl hover:shadow-2xl shadow-lg shadow-primary/10 transition-all duration-300 border-primary/20 sm:col-span-2 lg:col-span-1 slide-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-bold uppercase tracking-wider">Registration Status</CardTitle>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-xl">⏱️</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-lg sm:text-xl font-bold gradient-text break-words">{getRegistrationStatus()}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Current registration status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
