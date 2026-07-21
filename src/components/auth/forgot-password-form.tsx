"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, Loader2, RotateCw } from "lucide-react"

interface ForgotPasswordFormProps {
    onClose: () => void
}

export default function ForgotPasswordForm({ onClose }: ForgotPasswordFormProps) {
    const [step, setStep] = useState<"email" | "otp" | "password">("email")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [verifiedEmail, setVerifiedEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)
    const [canResend, setCanResend] = useState(false)
    const [otpExpiryTime, setOtpExpiryTime] = useState<number | null>(null)
    const [otpTimeRemaining, setOtpTimeRemaining] = useState(0)

    /* ----------------------------------
       TIMER EFFECT - Countdown for resend
    ----------------------------------- */
    useEffect(() => {
        if (resendTimer <= 0) {
            setCanResend(true)
            return
        }

        const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [resendTimer])

    /* ----------------------------------
       OTP EXPIRY TIMER EFFECT
    ----------------------------------- */
    useEffect(() => {
        if (!otpExpiryTime || step !== "otp") return

        const updateTimer = () => {
            const now = Date.now()
            const remaining = Math.max(0, Math.floor((otpExpiryTime - now) / 1000))
            setOtpTimeRemaining(remaining)

            if (remaining === 0) {
                console.log("[v0] OTP has expired")
            }
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [otpExpiryTime, step])

    /* ----------------------------------
       SEND OTP - Send email with OTP
    ----------------------------------- */
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!email.trim()) {
                toast.error("Please enter your email")
                return
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                toast.error("Invalid email format")
                return
            }

            // Send OTP to email
            const response = await fetch("/api/auth/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Failed to send OTP")
                return
            }

            setStep("otp")
            setCanResend(false)
            setResendTimer(60) // 60 second resend timer
            setOtpExpiryTime(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
            toast.success("OTP sent to your email")
        } catch (err) {
            console.error("[v0] Send OTP error:", err)
            toast.error("Failed to send OTP")
        } finally {
            setIsLoading(false)
        }
    }

    /* ----------------------------------
       RESEND OTP
    ----------------------------------- */
    const handleResendOTP = async () => {
        if (!canResend || resendTimer > 0) return
        await handleSendOTP({ preventDefault: () => { } } as React.FormEvent)
    }

    /* ----------------------------------
       VERIFY OTP
    ----------------------------------- */
    const verifyOTP = async (otpValue: string) => {
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/forgot-password/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpValue }),
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error(result.error || "Invalid 6-digit OTP code. Please check your inbox and try again.")
                return
            }

            setVerifiedEmail(email)
            setStep("password")
            toast.success("Email verified successfully! Please set your new password.")
        } catch (err) {
            console.error("[v0] Verify OTP error:", err)
            toast.error("Unable to verify OTP. Please check your internet connection and try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otp.trim()) {
            toast.error("Please enter the OTP")
            return
        }
        await verifyOTP(otp)
    }

    // Real-time automatic verification when the OTP reaches 6 digits
    useEffect(() => {
        if (otp.length === 6 && step === "otp" && !isLoading) {
            verifyOTP(otp)
        }
    }, [otp, step, isLoading])

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
            const response = await fetch("/api/auth/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: verifiedEmail,
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
                <button
                    onClick={onClose}
                    type="button"
                    className="hover:opacity-70 transition-opacity"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">Reset Password</h2>
            </div>

            {step === "email" && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">Email Address</label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !email.trim()}
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
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            Enter the OTP sent to <span className="font-medium">{email}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            OTP expires in {otpTimeRemaining} seconds
                            {otpTimeRemaining > 300 && ` (${Math.floor(otpTimeRemaining / 60)}:${String(otpTimeRemaining % 60).padStart(2, '0')})`}
                        </div>
                    </div>

                    <Input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        maxLength={6}
                        autoFocus
                    />

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="flex-1"
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

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResendOTP}
                            disabled={!canResend || resendTimer > 0}
                            className="flex-1"
                        >
                            {resendTimer > 0 ? (
                                <>
                                    <RotateCw className="w-4 h-4 mr-2" />
                                    Resend in {resendTimer}s
                                </>
                            ) : (
                                <>
                                    <RotateCw className="w-4 h-4 mr-2" />
                                    Resend OTP
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}

            {step === "password" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">New Password</label>
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
