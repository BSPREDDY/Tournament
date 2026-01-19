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
    const [countryCode, setCountryCode] = useState("+91") // Default to India
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)

    // Initialize Firebase reCAPTCHA
    useEffect(() => {
        try {
            firebaseSMS.setupRecaptcha('recaptcha-container', true)
        } catch (error) {
            console.error('Failed to setup reCAPTCHA:', error)
        }

        return () => {
            firebaseSMS.cleanup()
        }
    }, [])

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validate phone number
            if (!phoneNumber || phoneNumber.trim() === "") {
                toast.error("Please enter a valid phone number")
                setIsLoading(false)
                return
            }

            // Format phone number with country code
            const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`

            // Validate phone number format
            if (!fullPhoneNumber.match(/^\+\d{10,15}$/)) {
                toast.error("Invalid phone number format")
                setIsLoading(false)
                return
            }

            // First, check if phone number exists in your database
            const checkResponse = await fetch("/api/auth/forgot-password/check-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
            })

            const checkData = await checkResponse.json()

            if (!checkResponse.ok) {
                toast.error(checkData.error || "Phone number not found")
                setIsLoading(false)
                return
            }

            // Send OTP via Firebase
            const result = await firebaseSMS.sendOTP(fullPhoneNumber)

            if (result.success) {
                setStep("otp")
                setCountdown(60)
                toast.success("OTP sent to your phone number")
            } else {
                toast.error(result.error || "Failed to send OTP")
            }
        } catch (error) {
            console.error("[Firebase] Send OTP error:", error)
            toast.error("Failed to send OTP. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!otp || otp.length !== 6) {
                toast.error("Please enter a valid 6-digit OTP")
                setIsLoading(false)
                return
            }

            // Verify OTP with Firebase
            const result = await firebaseSMS.verifyOTP(otp)

            if (result.success) {
                setStep("password")
                toast.success("Phone number verified successfully")
            } else {
                toast.error(result.error || "Invalid OTP code")
            }
        } catch (error) {
            console.error("[Firebase] Verify OTP error:", error)
            toast.error("Verification failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOTP = async () => {
        if (countdown > 0) return

        setIsLoading(true)
        try {
            const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`
            const result = await firebaseSMS.resendOTP(fullPhoneNumber)

            if (result.success) {
                setCountdown(60)
                setOtp("")
                toast.success("OTP resent successfully")
            } else {
                toast.error(result.error || "Failed to resend OTP")
            }
        } catch (error) {
            toast.error("Failed to resend OTP")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long")
            return
        }

        setIsLoading(true)

        try {
            const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`

            const response = await fetch("/api/auth/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phoneNumber: fullPhoneNumber,
                    newPassword
                }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Password reset successfully!")
                // Clean up Firebase
                firebaseSMS.cleanup()
                // Close the form
                onClose()
            } else {
                toast.error(data.error || "Failed to reset password")
            }
        } catch (error) {
            console.error("[Reset] Error:", error)
            toast.error("Reset failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {/* reCAPTCHA container (invisible) */}
            <div id="recaptcha-container"></div>

            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onClose}
                    className="hover:opacity-70 transition-opacity"
                    type="button"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">Reset Password</h2>
            </div>

            {/* Step 1: Phone Number */}
            {step === "phone" && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone Number
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="+91">🇮🇳 +91</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+44">🇬🇧 +44</option>
                                <option value="+61">🇦🇺 +61</option>
                                <option value="+971">🇦🇪 +971</option>
                            </select>
                            <Input
                                type="tel"
                                placeholder="9876543210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                required
                                className="flex-1"
                                maxLength={10}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            We will send an OTP to verify your number
                        </p>
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading || !phoneNumber.trim() || phoneNumber.length < 10}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending OTP...
                            </>
                        ) : (
                            "Send OTP"
                        )}
                    </Button>
                </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Enter OTP
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            OTP sent to {countryCode} {phoneNumber}
                        </p>
                        <Input
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            required
                            className="w-full text-center text-2xl tracking-widest"
                            autoFocus
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
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

                    {/* Resend OTP */}
                    <div className="text-center">
                        {countdown > 0 ? (
                            <p className="text-sm text-gray-500">
                                Resend OTP in {countdown}s
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isLoading}
                                className="text-sm text-purple-600 hover:text-purple-700 hover:underline disabled:text-gray-400"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setStep("phone")
                            setOtp("")
                            firebaseSMS.cleanup()
                        }}
                        className="w-full"
                    >
                        Change Phone Number
                    </Button>
                </form>
            )}

            {/* Step 3: New Password */}
            {step === "password" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                            ✓ Phone number verified successfully
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            New Password
                        </label>
                        <Input
                            type="password"
                            placeholder="Enter new password (min. 8 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full"
                            minLength={8}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <Input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full"
                            minLength={8}
                        />
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">
                                Passwords do not match
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={
                            isLoading ||
                            newPassword.length < 8 ||
                            newPassword !== confirmPassword
                        }
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
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