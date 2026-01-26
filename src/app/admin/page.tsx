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
    <div className="space-y-6 px-2 sm:px-0">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Admin Dashboard</h2>
        <p className="text-xs sm:text-base text-muted-foreground mt-1">
          Welcome back! Here's an overview of your platform
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="card-glow hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-2xl sm:text-3xl font-bold text-primary">{userCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card className="card-glow hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Form Submissions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-2xl sm:text-3xl font-bold text-secondary">{formCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Teams registered</p>
          </CardContent>
        </Card>

        <Card className="card-glow hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Registration Status</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-lg sm:text-xl font-semibold text-primary break-words">{getRegistrationStatus()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current registration status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
