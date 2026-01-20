"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import { firebaseSMS } from "@/src/lib/sms-service"

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
       reCAPTCHA INIT (CLIENT SAFE)
    ----------------------------------- */
    useEffect(() => {
        return () => {
            firebaseSMS.cleanup()
        }
    }, [])

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

            const check = await fetch("/api/auth/forgot-password/check-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: fullPhone }),
            })

            const checkData = await check.json()

            if (!check.ok) {
                toast.error(checkData.error || "Phone number not found")
                return
            }

            const result = await firebaseSMS.sendOTP(fullPhone)

            if (!result.success) {
                toast.error(result.error || "Failed to send OTP")
                return
            }

            setStep("otp")
            setCountdown(60)
            toast.success("OTP sent successfully")
        } catch (err) {
            console.error(err)
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

            const result = await firebaseSMS.verifyOTP(otp)

            if (!result.success) {
                toast.error(result.error || "Invalid OTP")
                return
            }

            setStep("password")
            toast.success("Phone verified")
        } catch {
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
            const result = await firebaseSMS.sendOTP(fullPhone)

            if (!result.success) {
                toast.error(result.error || "Failed to resend OTP")
                return
            }

            setOtp("")
            setCountdown(60)
            toast.success("OTP resent")
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
            const response = await fetch("/api/auth/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phoneNumber: `${countryCode}${phoneNumber}`,
                    newPassword,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Reset failed")
                return
            }

            toast.success("Password reset successfully")
            firebaseSMS.cleanup()
            onClose()
        } catch {
            toast.error("Reset failed")
        } finally {
            setIsLoading(false)
        }
    }

    /* ----------------------------------
       UI
    ----------------------------------- */
    return (
        <div className="w-full max-w-md mx-auto">
            <div id="recaptcha-container" />

            <div className="flex items-center gap-3 mb-6">
                <button onClick={onClose} type="button">
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
                            className="w-24 border rounded-lg px-2"
                        >
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                        </select>

                        <Input
                            type="tel"
                            placeholder="9876543210"
                            value={phoneNumber}
                            onChange={(e) =>
                                setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                            }
                        />
                    </div>

                    <Button disabled={isLoading || phoneNumber.length < 10} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
                    </Button>
                </form>
            )}

            {step === "otp" && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="text-center text-xl tracking-widest"
                    />

                    <Button disabled={isLoading || otp.length !== 6} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
                    </Button>

                    {countdown > 0 ? (
                        <p className="text-center text-sm">Resend in {countdown}s</p>
                    ) : (
                        <button type="button" onClick={handleResendOTP} className="text-sm text-purple-600">
                            Resend OTP
                        </button>
                    )}
                </form>
            )}

            {step === "password" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                    </Button>
                </form>
            )}
        </div>
    )
}
