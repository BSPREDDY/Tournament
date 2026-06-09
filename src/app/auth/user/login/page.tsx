// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/src/components/ui/button"
// import { Input } from "@/src/components/ui/input"
// import Link from "next/link"
// import { toast } from "sonner"
// import { Eye, EyeOff, Loader2, Users } from "lucide-react"
// import ForgotPasswordForm from "@/src/components/auth/forgot-password-form"

// export default function UserLoginPage() {
//     const router = useRouter()
//     const [isLoading, setIsLoading] = useState(false)
//     const [showPassword, setShowPassword] = useState(false)
//     const [showForgotPassword, setShowForgotPassword] = useState(false)
//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     })

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setIsLoading(true)

//         try {
//             const guestUserId = localStorage.getItem("guest_user_id")
//             const response = await fetch("/api/auth/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(guestUserId && { "x-guest-user-id": guestUserId })
//                 },
//                 body: JSON.stringify(formData),
//             })

//             const data = await response.json()

//             if (response.ok) {
//                 // Check if user is admin - if so, redirect to user login selector
//                 if (data.user?.role === "admin") {
//                     toast.error("Admin accounts cannot login here. Please use admin login.")
//                     return
//                 }
//                 toast.success("Login successful")
//                 router.push("/dashboard")
//             } else {
//                 toast.error(data.error || "Login failed")
//             }
//         } catch (error) {
//             toast.error("An error occurred")
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     if (showForgotPassword) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
//                 <div className="w-full max-w-md">
//                     <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//                 <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
//             </div>

//             <div className="max-w-md w-full space-y-8 relative z-10">
//                 <div className="text-center">
//                     <div className="flex justify-center mb-4">
//                         <div className="p-3 bg-blue-100 rounded-full">
//                             <Users className="w-6 h-6 text-blue-600" />
//                         </div>
//                     </div>
//                     <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
//                         Player Login
//                     </h2>
//                     <p className="text-gray-600">Sign in to your tournament account</p>
//                 </div>

//                 <form
//                     className="mt-8 space-y-6 bg-white rounded-2xl p-8 border border-blue-100 shadow-lg"
//                     onSubmit={handleSubmit}
//                 >
//                     <div className="space-y-4">
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Email Address
//                             </label>
//                             <Input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 autoComplete="email"
//                                 required
//                                 placeholder="Enter your email"
//                                 value={formData.email}
//                                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                 className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500/20"
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <Input
//                                     id="password"
//                                     name="password"
//                                     type={showPassword ? "text" : "password"}
//                                     autoComplete="current-password"
//                                     required
//                                     placeholder="Enter your password"
//                                     value={formData.password}
//                                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                                     className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                                 >
//                                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <Button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                 Signing in...
//                             </>
//                         ) : (
//                             "Sign In"
//                         )}
//                     </Button>

//                     <div className="relative">
//                         <div className="absolute inset-0 flex items-center">
//                             <div className="w-full border-t border-gray-200"></div>
//                         </div>
//                         <div className="relative flex justify-center text-sm">
//                             <span className="px-2 bg-white text-gray-500">Or</span>
//                         </div>
//                     </div>

//                     <div className="text-center text-sm">
//                         <p className="text-gray-600">
//                             Don&apos;t have an account?{" "}
//                             <Link
//                                 href="/auth/user/signup"
//                                 className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
//                             >
//                                 Create one
//                             </Link>
//                         </p>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Trophy } from "lucide-react"
import ForgotPasswordForm from "@/src/components/auth/forgot-password-form"
import { GoogleLogin } from "@react-oauth/google"
import FacebookLogin from "react-facebook-login"

export default function UserLoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [googleClientId, setGoogleClientId] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    useEffect(() => {
        // Get Google Client ID from environment
        setGoogleClientId(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "")
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const guestUserId = localStorage.getItem("guest_user_id")
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(guestUserId && { "x-guest-user-id": guestUserId })
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                // Check if user is admin - if so, redirect to user login selector
                if (data.user?.role === "admin") {
                    toast.error("Admin accounts cannot login here. Please use admin login.")
                    return
                }
                toast.success("Login successful")
                router.push("/dashboard")
            } else {
                toast.error(data.error || "Login failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/auth/oauth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential }),
            })

            const data = await response.json()

            if (response.ok) {
                if (data.user?.role === "admin") {
                    toast.error("Admin accounts cannot login here. Please use admin login.")
                    return
                }
                toast.success("Login successful")
                router.push("/dashboard")
            } else {
                toast.error(data.error || "Google login failed")
            }
        } catch (error) {
            console.error("[v0] Google login error:", error)
            toast.error("An error occurred during Google login")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleError = () => {
        toast.error("Google login failed")
    }

    const handleFacebookResponse = async (response: any) => {
        if (!response.accessToken) {
            toast.error("Facebook login failed")
            return
        }

        setIsLoading(true)
        try {
            const authResponse = await fetch("/api/auth/oauth/facebook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accessToken: response.accessToken,
                    userID: response.userID,
                    name: response.name,
                    email: response.email,
                }),
            })

            const data = await authResponse.json()

            if (authResponse.ok) {
                if (data.user?.role === "admin") {
                    toast.error("Admin accounts cannot login here. Please use admin login.")
                    return
                }
                toast.success("Login successful")
                router.push("/dashboard")
            } else {
                toast.error(data.error || "Facebook login failed")
            }
        } catch (error) {
            console.error("[v0] Facebook login error:", error)
            toast.error("An error occurred during Facebook login")
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
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-lg shadow-amber-400/20">
                            <Trophy className="w-8 h-8 text-amber-900" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-2 font-serif tracking-tight">
                        Tournament
                    </h1>
                    <p className="text-amber-200 text-sm font-medium tracking-wide uppercase">Elite Competition Platform</p>
                    <p className="text-slate-300 mt-3 text-base">Sign in to your player account and compete</p>
                </div>

                {/* Main form card */}
                <div className="glassmorphism-dark space-y-6 p-8 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-amber-200">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20"
                            />
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-amber-200">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-xs text-amber-300 hover:text-amber-200 transition-colors font-medium"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Sign in button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-bold py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700/50"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-slate-900/50 text-slate-400 uppercase tracking-wide font-medium">Or continue with</span>
                        </div>
                    </div>

                    {/* OAuth buttons */}
                    <div className="space-y-3">
                        {googleClientId && (
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    width="100"
                                />
                            </div>
                        )}

                        <FacebookLogin
                            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
                            fields="name,email,picture"
                            callback={handleFacebookResponse}
                            scope="public_profile,email"
                            render={(renderProps: any) => (
                                <Button
                                    type="button"
                                    onClick={renderProps.onClick}
                                    disabled={isLoading || renderProps.isProcessing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                            Facebook
                                        </>
                                    )}
                                </Button>
                            )}
                        />
                    </div>

                    {/* Sign up link */}
                    <div className="text-center pt-2">
                        <p className="text-slate-400 text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/auth/user/signup"
                                className="text-amber-300 hover:text-amber-200 font-semibold transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>

                    {/* Admin login link */}
                    <div className="text-center border-t border-slate-700/50 pt-4">
                        <p className="text-slate-400 text-xs">
                            Are you an admin?{" "}
                            <Link
                                href="/auth/admin/login"
                                className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors"
                            >
                                Admin Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
