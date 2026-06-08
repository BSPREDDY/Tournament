"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Shield } from "lucide-react"
import ForgotPasswordForm from "@/src/components/auth/forgot-password-form"

export default function AdminLoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                // Check if user is admin
                if (data.user?.role !== "admin") {
                    toast.error("Only admin accounts can access this page. Please use player login.")
                    return
                }
                toast.success("Admin login successful")
                router.push("/admin")
            } else {
                toast.error(data.error || "Login failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    if (showForgotPassword) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-amber-500/20 rounded-full border border-amber-500/30">
                            <Shield className="w-6 h-6 text-amber-400" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                        Admin Portal
                    </h2>
                    <p className="text-gray-300">Tournament management & control</p>
                </div>

                <form
                    className="mt-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-amber-500/20 shadow-2xl"
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                Admin Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="Enter admin email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-amber-500/20 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500/20"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                Admin Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-amber-500/20 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            "Admin Login"
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-amber-500/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-400">
                                Restricted Access
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                            <p className="text-xs text-amber-300">
                                <strong>Admin Access Only:</strong> Only authorized administrators can access this portal.
                            </p>
                        </div>

                        {/* <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="w-full text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            Forgot Password?
                        </button> */}
                        <p className="text-center text-gray-300">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/auth/admin/signup"
                                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                            >
                                Register here
                            </Link>
                        </p>
                        <p className="text-center text-gray-300">
                            Player?{" "}
                            <Link
                                href="/auth/user/login"
                                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
