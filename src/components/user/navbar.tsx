"use client"

import { useState } from "react"
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
import { X, UserCircle, Lock, LayoutDashboard, LogOut } from "lucide-react"
import type { User } from "@/src/db/schema/schema"

interface UserNavbarProps {
    user: User
}

export function UserNavbar({ user }: UserNavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" })
            window.location.href = "/"
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const getInitials = () => {
        const firstName = user.firstName?.[0]?.toUpperCase() || "U"
        const lastName = user.lastName?.[0]?.toUpperCase() || "S"
        return `${firstName}${lastName}`
    }

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-card via-card to-card border-b border-primary/10 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white">
                            <span className="text-xl font-bold">T</span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold hidden sm:block">Tournament</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-sm">
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/form">
                            <Button variant="ghost" className="text-sm">
                                Register
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button - Removed lucide-menu SVG, using only X icon */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md hover:bg-primary/10 transition-colors"
                        >
                            {mobileMenuOpen && <X className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* User Dropdown */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
                                >
                                    <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                                        <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold text-xs">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                                        <UserCircle className="w-4 h-4" />
                                        <span>My Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/security" className="flex items-center gap-2 cursor-pointer">
                                        <Lock className="w-4 h-4" />
                                        <span>Security</span>
                                    </Link>
                                </DropdownMenuItem>
                                {user.role === "admin" && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-primary">
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-primary/10 bg-card/95">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            <Link href="/dashboard">
                                <Button variant="ghost" className="w-full justify-start">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/form">
                                <Button variant="ghost" className="w-full justify-start">
                                    Register
                                </Button>
                            </Link>
                            <Link href="/dashboard/profile">
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <UserCircle className="w-4 h-4" />
                                    My Profile
                                </Button>
                            </Link>
                            <Link href="/dashboard/security">
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <Lock className="w-4 h-4" />
                                    Security
                                </Button>
                            </Link>
                            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2 text-destructive">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
