"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"

interface ForgotPasswordFormProps {
    onClose: () => void
}

export default function ForgotPasswordForm({ onClose }: ForgotPasswordFormProps) {
    const [step, setStep] = useState<"phone" | "otp" | "password">("phone")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [countryCode, setCountryCode] = useState("+91")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)

    /* ----------------------------------
       RESEND COUNTDOWN
    ----------------------------------- */
    useEffect(() => {
        if (countdown <= 0) return
        const timer = setInterval(() => {
            setCountdown((c) => c - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [countdown])

    /* ----------------------------------
       SEND OTP
    ----------------------------------- */
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!phoneNumber.trim()) {
                toast.error("Please enter phone number")
                return
            }

            const fullPhone = `${countryCode}${phoneNumber}`

            if (!/^\+\d{10,15}$/.test(fullPhone)) {
                toast.error("Invalid phone number format")
                return
            }

            // Send OTP via backend route
            const response = await fetch("/api/auth/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: fullPhone }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Failed to send OTP")
                return
            }

            setStep("otp")
            setCountdown(60)
            toast.success("OTP sent successfully")
        } catch (err) {
            console.error("[v0] Send OTP error:", err)
            toast.error("Failed to send OTP")
        } finally {
            setIsLoading(false)
        }
    }

    /* ----------------------------------
       VERIFY OTP
    ----------------------------------- */
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (otp.length !== 6) {
                toast.error("Enter valid 6-digit OTP")
                return
            }

            const fullPhone = `${countryCode}${phoneNumber}`

            // Verify OTP via backend route
            const response = await fetch("/api/auth/forgot-password/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: fullPhone, otp }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Invalid OTP")
                return
            }

            setStep("password")
            toast.success("Phone verified successfully")
        } catch (err) {
            console.error("[v0] Verify OTP error:", err)
            toast.error("OTP verification failed")
        } finally {
            setIsLoading(false)
        }
    }

    /* ----------------------------------
       RESEND OTP
    ----------------------------------- */
    const handleResendOTP = async () => {
        if (countdown > 0) return

        setIsLoading(true)
        try {
            const fullPhone = `${countryCode}${phoneNumber}`

            const response = await fetch("/api/auth/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: fullPhone }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Failed to resend OTP")
                return
            }

            setOtp("")
            setCountdown(60)
            toast.success("OTP resent")
        } catch (err) {
            console.error("[v0] Resend OTP error:", err)
            toast.error("Failed to resend OTP")
        } finally {
            setIsLoading(false)
        }
    }

    /* ----------------------------------
       RESET PASSWORD
    ----------------------------------- */
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }

        setIsLoading(true)

        try {
            const fullPhone = `${countryCode}${phoneNumber}`

            const response = await fetch("/api/auth/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phoneNumber: fullPhone,
                    newPassword,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Password reset failed")
                return
            }

            toast.success("Password reset successfully")
            onClose()
        } catch (err) {
            console.error("[v0] Reset password error:", err)
            toast.error("Password reset failed")
        } finally {
            setIsLoading(false)
        }
    }

    /* ----------------------------------
       UI
    ----------------------------------- */
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onClose} type="button" className="hover:opacity-70">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">Reset Password</h2>
            </div>

            {step === "phone" && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="flex gap-2">
                        <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-24 border rounded-lg px-2 py-2 bg-white"
                        >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+61">🇦🇺 +61</option>
                        </select>

                        <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={(e) =>
                                setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 15))
                            }
                            maxLength={15}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || phoneNumber.length < 10}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send OTP"
                        )}
                    </Button>
                </form>
            )}

            {step === "otp" && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                            Enter 6-digit OTP
                        </label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            className="text-center text-2xl tracking-widest font-mono"
                            maxLength={6}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify OTP"
                        )}
                    </Button>

                    <div className="text-center">
                        {countdown > 0 ? (
                            <p className="text-sm text-gray-600">Resend in {countdown}s</p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isLoading}
                                className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </form>
            )}

            {step === "password" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                            New Password
                        </label>
                        <Input
                            type="password"
                            placeholder="At least 8 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                            Confirm Password
                        </label>
                        <Input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || newPassword.length < 8}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>
            )}
        </div>
    )
}
