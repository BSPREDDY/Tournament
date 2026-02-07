"use client"

import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import {
    LayoutDashboard,
    FileText,
    Calendar,
    Users,
    Mail,
    UserCircle,
    Lock,
    Shield,
    LogOut,
    Trophy,
} from "lucide-react"
import type { User } from "@/src/db/schema/schema"

interface UserNavbarProps {
    user: User
}

export function UserNavbar({ user }: UserNavbarProps) {
    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        window.location.href = "/"
    }

    const getInitials = () => {
        const firstName = user.firstName?.[0]?.toUpperCase() || "U"
        const lastName = user.lastName?.[0]?.toUpperCase() || "S"
        return `${firstName}${lastName}`
    }

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 w-full
      bg-card/70 backdrop-blur-xl border-b border-primary/10
      shadow-[0_10px_35px_rgba(0,0,0,0.12)]"
        >
            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">

                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-bold gradient-text">Nag • IronmanTY</h1>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="gap-2 rounded-full px-4 text-sm hover:bg-primary/80">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Button>
                        </Link>

                        <Link href="/dashboard/form">
                            <Button variant="ghost" className="gap-2 rounded-full px-4 text-sm hover:bg-primary/80">
                                <FileText className="w-4 h-4" />
                                Register
                            </Button>
                        </Link>

                        <Link href="/dashboard/rules">
                            <Button variant="ghost" className="gap-2 rounded-full px-4 text-sm hover:bg-primary/80">
                                <Shield className="w-4 h-4" />
                                Rules
                            </Button>
                        </Link>

                        <Link href="/dashboard/schedule">
                            <Button variant="ghost" className="gap-2 rounded-full px-4 text-sm hover:bg-primary/80">
                                <Calendar className="w-4 h-4" />
                                Schedule
                            </Button>
                        </Link>

                        <Link href="/dashboard/registered-teams">
                            <Button variant="ghost" className="gap-2 rounded-full px-4 text-sm hover:bg-primary/80">
                                <Users className="w-4 h-4" />
                                Teams
                            </Button>
                        </Link>

                        <Link href="/dashboard/contact">
                            <Button variant="ghost" className="gap-2 rounded-full px-4 text-sm hover:bg-primary/80">
                                <Mail className="w-4 h-4" />
                                Contact
                            </Button>
                        </Link>

                    </div>

                    {/* User Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-10 w-10 rounded-full hover:bg-primary/10 transition-all"
                            >
                                <Avatar className="h-9 w-9 border border-primary/20">
                                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                                    <AvatarFallback
                                        className="bg-gradient-to-br from-primary to-secondary
                    text-white text-xs font-bold"
                                    >
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-56 rounded-xl border border-primary/10
              bg-card/95 backdrop-blur-xl shadow-xl"
                        >
                            <DropdownMenuLabel>
                                <p className="text-sm font-semibold">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile" className="flex items-center gap-2">
                                    <UserCircle className="w-4 h-4" />
                                    My Profile
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/security" className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Security
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/form" className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Register
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/rules" className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Rules & Guidelines
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/schedule" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Schedule
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/registered-teams" className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Registered Teams
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/contact" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Contact
                                </Link>
                            </DropdownMenuItem>

                            {user.role === "admin" && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin" className="flex items-center gap-2 text-primary">
                                            <Shield className="w-4 h-4" />
                                            Admin Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-destructive cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </nav>
    )
}
