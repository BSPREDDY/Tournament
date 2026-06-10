// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/src/components/ui/button"
// import { Input } from "@/src/components/ui/input"
// import Link from "next/link"
// import { toast } from "sonner"
// import { Eye, EyeOff, Loader2, Shield } from "lucide-react"

// export default function AdminSignupPage() {
//     const router = useRouter()
//     const [isLoading, setIsLoading] = useState(false)
//     const [showPassword, setShowPassword] = useState(false)
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//     })

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }))
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
//             toast.error("Please fill in all fields")
//             return
//         }

//         if (formData.password !== formData.confirmPassword) {
//             toast.error("Passwords do not match")
//             return
//         }

//         if (formData.password.length < 6) {
//             toast.error("Password must be at least 6 characters long")
//             return
//         }

//         setIsLoading(true)

//         try {
//             const response = await fetch("/api/auth/register", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     name: formData.name,
//                     email: formData.email,
//                     password: formData.password,
//                     role: "admin",
//                 }),
//             })

//             const data = await response.json()

//             if (response.ok) {
//                 toast.success("Admin account created successfully! Redirecting to login...")
//                 setTimeout(() => {
//                     router.push("/auth/admin/login")
//                 }, 1500)
//             } else {
//                 toast.error(data.error || "Registration failed")
//             }
//         } catch (error) {
//             console.error("[v0] Admin signup error:", error)
//             toast.error("An error occurred during registration")
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//                 <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
//             </div>

//             <div className="max-w-md w-full space-y-8 relative z-10">
//                 <div className="text-center">
//                     <div className="flex justify-center mb-4">
//                         <div className="p-3 bg-amber-500/20 rounded-full border border-amber-500/30">
//                             <Shield className="w-6 h-6 text-amber-400" />
//                         </div>
//                     </div>
//                     <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
//                         Create Admin Account
//                     </h2>
//                     <p className="text-gray-300">Set up your tournament management account</p>
//                 </div>

//                 <form
//                     className="mt-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-amber-500/20 shadow-2xl"
//                     onSubmit={handleSubmit}
//                 >
//                     <div className="space-y-4">
//                         <div>
//                             <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
//                                 Full Name
//                             </label>
//                             <Input
//                                 id="name"
//                                 name="name"
//                                 type="text"
//                                 autoComplete="name"
//                                 required
//                                 placeholder="Enter your full name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 className="w-full bg-white/5 border border-amber-500/20 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500/20"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
//                                 Admin Email
//                             </label>
//                             <Input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 autoComplete="email"
//                                 required
//                                 placeholder="Enter admin email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="w-full bg-white/5 border border-amber-500/20 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500/20"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <Input
//                                     id="password"
//                                     name="password"
//                                     type={showPassword ? "text" : "password"}
//                                     autoComplete="new-password"
//                                     required
//                                     placeholder="Create a strong password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     className="w-full bg-white/5 border border-amber-500/20 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
//                                 >
//                                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                 </button>
//                             </div>
//                         </div>

//                         <div>
//                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
//                                 Confirm Password
//                             </label>
//                             <div className="relative">
//                                 <Input
//                                     id="confirmPassword"
//                                     name="confirmPassword"
//                                     type={showConfirmPassword ? "text" : "password"}
//                                     autoComplete="new-password"
//                                     required
//                                     placeholder="Confirm your password"
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     className="w-full bg-white/5 border border-amber-500/20 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
//                                 >
//                                     {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <Button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/50"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                 Creating Account...
//                             </>
//                         ) : (
//                             "Create Admin Account"
//                         )}
//                     </Button>

//                     <div className="relative">
//                         <div className="absolute inset-0 flex items-center">
//                             <div className="w-full border-t border-amber-500/20"></div>
//                         </div>
//                         <div className="relative flex justify-center text-sm">
//                             <span className="px-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-400">
//                                 Admin Portal
//                             </span>
//                         </div>
//                     </div>

//                     <div className="space-y-3 text-sm">
//                         <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
//                             <p className="text-xs text-amber-300">
//                                 <strong>Admin Registration:</strong> This account is for tournament administrators only. Use the player signup for participants.
//                             </p>
//                         </div>
//                         <p className="text-center text-gray-300">
//                             Already have an account?{" "}
//                             <Link
//                                 href="/auth/admin/login"
//                                 className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
//                             >
//                                 Login here
//                             </Link>
//                         </p>
//                         <p className="text-center text-gray-400 text-xs">
//                             Player?{" "}
//                             <Link
//                                 href="/auth/user/signup"
//                                 className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
//                             >
//                                 Create player account
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
import { Eye, EyeOff, Loader2, Crown, Shield } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"
import FacebookLogin from "react-facebook-login"

export default function AdminSignupPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [googleClientId, setGoogleClientId] = useState("")
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
    })

    useEffect(() => {
        setGoogleClientId(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "")
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/admin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Admin registration submitted! Awaiting approval.")
                router.push("/auth/admin/login")
            } else {
                toast.error(data.error || "Registration failed")
            }
        } catch (error) {
            toast.error("An error occurred during registration")
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
                if (data.user?.role !== "admin") {
                    toast.error("Google signup is for player accounts only. Use player signup.")
                    return
                }
                toast.success("Admin account created!")
                router.push("/admin")
            } else {
                toast.error(data.error || "Google signup failed")
            }
        } catch (error) {
            console.error("[v0] Google admin signup error:", error)
            toast.error("An error occurred during Google signup")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleError = () => {
        toast.error("Google signup failed")
    }

    const handleFacebookResponse = async (response: any) => {
        if (!response.accessToken) {
            toast.error("Facebook signup failed")
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
                if (data.user?.role !== "admin") {
                    toast.error("Facebook signup is for player accounts only. Use player signup.")
                    return
                }
                toast.success("Admin account created!")
                router.push("/admin")
            } else {
                toast.error(data.error || "Facebook signup failed")
            }
        } catch (error) {
            console.error("[v0] Facebook admin signup error:", error)
            toast.error("An error occurred during Facebook signup")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg shadow-emerald-400/20">
                            <Crown className="w-8 h-8 text-emerald-900" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-2 font-serif tracking-tight">
                        Admin Portal
                    </h1>
                    <p className="text-emerald-200 text-sm font-medium tracking-wide uppercase">Register as Administrator</p>
                    <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-300" />
                        <p className="text-xs text-emerald-300">Secure admin registration</p>
                    </div>
                </div>

                {/* Main card */}
                <div className="glassmorphism-dark space-y-6 p-8 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                                    First Name
                                </label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    placeholder="Admin"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                                    Last Name
                                </label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    placeholder="User"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 text-sm"
                                />
                            </div>
                        </div>

                        {/* Email field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="admin@tournament.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                            />
                        </div>

                        {/* Phone field */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                                Phone Number
                            </label>
                            <Input
                                id="phone"
                                name="phoneNumber"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20"
                            />
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-400">Minimum 12 characters with uppercase, number, and symbol</p>
                        </div>

                        {/* Sign up button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-emerald-950 font-bold py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-400/20 hover:shadow-emerald-400/40 mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-4 h-4 mr-2 inline" />
                                    Register as Admin
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700/50"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-slate-900/50 text-slate-400 uppercase tracking-wide font-medium">Or register with</span>
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

                        {/* <FacebookLogin
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
                                            Registering...
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
                        /> */}
                    </div>

                    {/* Navigation links */}
                    <div className="space-y-3 border-t border-slate-700/50 pt-4">
                        <div className="text-center">
                            <p className="text-slate-400 text-sm">
                                Already an admin?{" "}
                                <Link
                                    href="/auth/admin/login"
                                    className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-slate-400 text-xs">
                                Player?{" "}
                                <Link
                                    href="/auth/user/signup"
                                    className="text-amber-300 hover:text-amber-200 font-semibold transition-colors"
                                >
                                    Player Signup
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
