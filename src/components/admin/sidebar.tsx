"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, LayoutDashboard, Users, FileText, Settings, Menu, X, Calendar, Mail, Lock } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ThemeToggle } from "@/src/components/theme-toggle"

interface Config {
  id: string
  registrationStopAt: string | null
  isRegistrationOpen: boolean
}

export function Sidebar() {
  const pathname = usePathname()
  const [userCount, setUserCount] = useState(0)
  const [formCount, setFormCount] = useState(0)
  const [config, setConfig] = useState<Config | null>(null)
  const [registrationStopAt, setRegistrationStopAt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
        if (configData.registrationStopAt) {
          const date = new Date(configData.registrationStopAt)
          const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
          setRegistrationStopAt(localDateTime)
        }
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

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/registration-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationStopAt: registrationStopAt ? new Date(registrationStopAt).toISOString() : null,
          isRegistrationOpen: !registrationStopAt || new Date(registrationStopAt) > new Date(),
        }),
      })

      if (response.ok) {
        await loadDashboard()
        setOpen(false)
        toast.success("Registration settings updated")
      } else {
        toast.error("Failed to update settings")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
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

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    // { href: "/admin/room-management", label: "Room Management", icon: Lock },
    { href: "/admin/form-management", label: "Form Management", icon: FileText },
    { href: "/admin/bgmi-schedule", label: "BGMI Schedule", icon: Calendar },
    { href: "/admin/user-contact-forms", label: "Contact Forms", icon: Mail },
    { href: "/admin/registration-status", label: "Registration Status", icon: Settings },
  ]

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-b border-primary/10 z-40 h-16 flex items-center px-4 shadow-sm">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-primary/10 rounded-lg transition-all duration-200 hover:scale-110"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
          <h1 className="text-lg font-bold gradient-text">Admin Panel</h1>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30 top-16" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop + Mobile Sidebar - Fixed positioning, only main content scrolls */}
      <aside
        className={`${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } lg:fixed fixed left-0 top-16 lg:top-0 w-64 h-[calc(100vh-64px)] lg:h-screen bg-gradient-to-b from-card to-card/80 border-r border-primary/10 p-4 sm:p-6 flex flex-col transition-all duration-300 ease-in-out z-30`}
      >
        <div className="mb-8 hidden lg:block flex-shrink-0 slide-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
            <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
          </div>
          <p className="text-xs text-muted-foreground ml-5 tracking-wide uppercase">Tournament Manager</p>
        </div>

        <nav className="space-y-1.5 flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{ animationDelay: `${index * 0.05}s` }}
                className="block slide-in"
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 text-sm sm:text-base mb-1 transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-primary/80 to-secondary/80 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    : "hover:bg-primary/80 hover:translate-x-1"
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden text-xs">{item.label.split(" ")[0]}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="space-y-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-3 text-sm hover:bg-primary/10 transition-all duration-300"
            >
              <span className="text-xs sm:text-sm">Theme</span>
            </Button>
            <ThemeToggle />
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-destructive/20 border-destructive/30 hover:border-destructive/50"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden text-xs">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
