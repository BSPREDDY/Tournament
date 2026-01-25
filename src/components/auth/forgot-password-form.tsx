"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import MSG91OTPWidget from "@/src/components/msg91-otp-widget"

interface ForgotPasswordFormProps {
    onClose: () => void
}

export default function ForgotPasswordForm({ onClose }: ForgotPasswordFormProps) {
    const [step, setStep] = useState<"phone" | "otp" | "password">("phone")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [countryCode, setCountryCode] = useState("+91")
    const [widgetToken, setWidgetToken] = useState("")
    const [verifiedPhone, setVerifiedPhone] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    /* ----------------------------------
       SEND OTP - Generate Widget Token
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

            // Get widget token from backend
            const response = await fetch("/api/auth/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: fullPhone }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Failed to initialize OTP")
                return
            }

            setWidgetToken(data.token)
            setStep("otp")
            toast.success("OTP widget ready")
        } catch (err) {
            console.error("[v0] Send OTP error:", err)
            toast.error("Failed to initialize OTP")
        } finally {
            setIsLoading(false)
        }
    }

    /* ----------------------------------
       OTP WIDGET SUCCESS
    ----------------------------------- */
    const handleWidgetSuccess = async (data: { token: string; phone: string }) => {
        try {
            console.log("[v0] Widget returned token:", data.token)

            // Verify the widget token with backend
            const response = await fetch("/api/auth/forgot-password/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken: data.token }),
            })

            const result = await response.json()

            if (!response.ok) {
                toast.error(result.error || "OTP verification failed")
                return
            }

            // Store verified phone and move to password reset
            setVerifiedPhone(result.phone || data.phone)
            setStep("password")
            toast.success("Phone verified successfully")
        } catch (err) {
            console.error("[v0] Widget verification error:", err)
            toast.error("Verification failed")
        }
    }

    /* ----------------------------------
       OTP WIDGET FAILURE
    ----------------------------------- */
    const handleWidgetFailure = (error: string) => {
        console.error("[v0] Widget error:", error)
        toast.error(error || "OTP failed")
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
            const fullPhone = verifiedPhone || `${countryCode}${phoneNumber}`

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
                <button
                    onClick={onClose}
                    type="button"
                    className="hover:opacity-70 transition-opacity"
                >
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
                                Initializing...
                            </>
                        ) : (
                            "Get OTP"
                        )}
                    </Button>
                </form>
            )}

            {step === "otp" && widgetToken && (
                <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                        Enter the OTP sent to {countryCode}
                        {phoneNumber}
                    </div>

                    <MSG91OTPWidget
                        widgetId={process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || ""}
                        token={widgetToken}
                        phoneNumber={`${countryCode}${phoneNumber}`}
                        onSuccess={handleWidgetSuccess}
                        onFailure={handleWidgetFailure}
                    />
                </div>
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
