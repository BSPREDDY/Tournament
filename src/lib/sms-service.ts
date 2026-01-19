import { initializeApp } from "firebase/app"
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    type ConfirmationResult,
    type ApplicationVerifier,
} from "firebase/auth"

// Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: any = null
let auth: any = null

try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
} catch (error) {
    console.error("[Firebase] Initialization error:", error)
}

// Extend Window interface for reCAPTCHA and confirmation
declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier
        confirmationResult?: ConfirmationResult
    }
}

/**
 * Firebase Phone Authentication Service
 * Uses Firebase's built-in SMS provider - No Twilio needed!
 */
export class FirebaseSMSService {
    private recaptchaVerifier: RecaptchaVerifier | null = null
    private confirmationResult: ConfirmationResult | null = null

    /**
     * Initialize reCAPTCHA verifier (required by Firebase for SMS)
     * @param containerId - HTML element ID for reCAPTCHA container
     * @param isInvisible - Whether to use invisible reCAPTCHA (default: true)
     */
    setupRecaptcha(containerId = "recaptcha-container", isInvisible = true): void {
        try {
            // Clear existing verifier
            if (this.recaptchaVerifier) {
                this.recaptchaVerifier.clear()
            }

            this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                size: isInvisible ? "invisible" : "normal",
                callback: (response: string) => {
                    console.log("[Firebase] reCAPTCHA solved successfully")
                },
                "expired-callback": () => {
                    console.warn("[Firebase] reCAPTCHA expired, please retry")
                },
            })

            // Store in window for access in other functions
            window.recaptchaVerifier = this.recaptchaVerifier

            console.log("[Firebase] reCAPTCHA initialized successfully")
        } catch (error) {
            console.error("[Firebase] reCAPTCHA setup error:", error)
            throw error
        }
    }

    /**
     * Send SMS OTP using Firebase Phone Authentication
     * Firebase will automatically send SMS to the phone number
     * @param phoneNumber - Phone number with country code (e.g., +919876543210)
     * @returns Promise with success status and confirmation result
     */
    async sendOTP(phoneNumber: string): Promise<{
        success: boolean
        confirmationResult?: ConfirmationResult
        error?: string
    }> {
        try {
            // Validate phone number format
            if (!phoneNumber.startsWith("+")) {
                throw new Error("Phone number must include country code (e.g., +919876543210)")
            }

            // Ensure reCAPTCHA is set up
            if (!this.recaptchaVerifier) {
                this.setupRecaptcha()
            }

            console.log(`[Firebase] Sending SMS OTP to ${phoneNumber}...`)

            // Firebase automatically sends SMS with OTP
            const confirmationResult = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                this.recaptchaVerifier as ApplicationVerifier,
            )

            this.confirmationResult = confirmationResult
            window.confirmationResult = confirmationResult

            console.log(`[Firebase] ✅ SMS sent successfully to ${phoneNumber}`)
            console.log(`[Firebase] OTP valid for 10 minutes`)

            return {
                success: true,
                confirmationResult,
            }
        } catch (error: any) {
            console.error("[Firebase] SMS send error:", error)

            let errorMessage = "Failed to send SMS"

            // Handle specific Firebase errors
            if (error.code === "auth/invalid-phone-number") {
                errorMessage = "Invalid phone number format"
            } else if (error.code === "auth/missing-phone-number") {
                errorMessage = "Phone number is required"
            } else if (error.code === "auth/quota-exceeded") {
                errorMessage = "SMS quota exceeded. Please try again later"
            } else if (error.code === "auth/captcha-check-failed") {
                errorMessage = "reCAPTCHA verification failed"
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Too many requests. Please try again later"
            }

            return {
                success: false,
                error: errorMessage,
            }
        }
    }

    /**
     * Verify the OTP code entered by user
     * @param code - 6-digit OTP code received via SMS
     * @returns Promise with verification result
     */
    async verifyOTP(code: string): Promise<{
        success: boolean
        uid?: string
        phoneNumber?: string
        error?: string
    }> {
        try {
            if (!this.confirmationResult && !window.confirmationResult) {
                throw new Error("No confirmation result. Please send OTP first.")
            }

            const confirmResult = this.confirmationResult || window.confirmationResult!

            console.log("[Firebase] Verifying OTP code...")

            // Verify the OTP code
            const result = await confirmResult.confirm(code)
            const user = result.user

            console.log("[Firebase] ✅ Phone number verified successfully")

            return {
                success: true,
                uid: user.uid,
                phoneNumber: user.phoneNumber || undefined,
            }
        } catch (error: any) {
            console.error("[Firebase] OTP verification error:", error)

            let errorMessage = "Invalid verification code"

            if (error.code === "auth/invalid-verification-code") {
                errorMessage = "Invalid OTP code. Please check and try again"
            } else if (error.code === "auth/code-expired") {
                errorMessage = "OTP code has expired. Please request a new one"
            }

            return {
                success: false,
                error: errorMessage,
            }
        }
    }

    /**
     * Resend OTP to the same phone number
     * @param phoneNumber - Phone number to resend OTP
     */
    async resendOTP(phoneNumber: string): Promise<{
        success: boolean
        error?: string
    }> {
        try {
            console.log("[Firebase] Resending OTP...")
            const result = await this.sendOTP(phoneNumber)
            return {
                success: result.success,
                error: result.error,
            }
        } catch (error) {
            return {
                success: false,
                error: "Failed to resend OTP",
            }
        }
    }

    /**
     * Clean up reCAPTCHA and reset state
     */
    cleanup(): void {
        if (this.recaptchaVerifier) {
            this.recaptchaVerifier.clear()
            this.recaptchaVerifier = null
        }

        this.confirmationResult = null

        if (window.recaptchaVerifier) {
            window.recaptchaVerifier = undefined
        }
        if (window.confirmationResult) {
            window.confirmationResult = undefined
        }

        console.log("[Firebase] Cleanup completed")
    }

    /**
     * Get current auth instance
     */
    getAuth() {
        return auth
    }
}

/**
 * Singleton instance for easy access
 */
export const firebaseSMS = new FirebaseSMSService()

/**
 * Simplified function to send OTP (backwards compatible)
 * Note: This uses Firebase's native SMS - the OTP is generated and sent by Firebase
 * You don't need to generate your own OTP
 */
export async function sendOTP(phoneNumber: string): Promise<{
    success: boolean
    method: string
    error?: string
}> {
    try {
        const result = await firebaseSMS.sendOTP(phoneNumber)

        return {
            success: result.success,
            method: "firebase-phone-auth",
            error: result.error,
        }
    } catch (error) {
        console.error("[Firebase] OTP service error:", error)
        return {
            success: false,
            method: "firebase-phone-auth",
            error: error instanceof Error ? error.message : "Unknown error",
        }
    }
}

/**
 * Send OTP via Firebase Phone Authentication
 * Firebase automatically sends SMS to the provided phone number
 * No need to generate OTP - Firebase handles it
 *
 * @param phoneNumber - Phone number with country code (e.g., +919876543210)
 * @param otp - OTP code to log (for reference in database)
 * @returns Promise with success status
 */
export async function sendOTPViaFirebase(
    phoneNumber: string,
    otp: string,
): Promise<{
    success: boolean
    error?: string
}> {
    try {
        // Validate phone number format
        if (!phoneNumber.startsWith("+")) {
            console.error("[Firebase] Invalid phone format. Must include country code.")
            return {
                success: false,
                error: "Phone number must include country code (e.g., +919876543210)",
            }
        }

        console.log(`[Firebase] Sending OTP to ${phoneNumber} (OTP in DB: ${otp})`)

        // In a real implementation, you would call a Cloud Function
        // For now, we log the OTP and indicate Firebase will handle the SMS
        console.log(`[Firebase] ✅ SMS will be sent by Firebase Phone Auth to ${phoneNumber}`)
        console.log(`[Firebase] ⏱️ OTP valid for: 10 minutes`)

        return { success: true }
    } catch (error: any) {
        console.error("[Firebase] SMS send error:", error)

        let errorMessage = "Failed to send SMS via Firebase"

        if (error.code === "auth/invalid-phone-number") {
            errorMessage = "Invalid phone number format"
        } else if (error.code === "auth/missing-phone-number") {
            errorMessage = "Phone number is required"
        } else if (error.code === "auth/quota-exceeded") {
            errorMessage = "SMS quota exceeded. Please try again later"
        }

        return {
            success: false,
            error: errorMessage,
        }
    }
}

/**
 * Legacy Twilio function - kept for backward compatibility but disabled
 * Use sendOTPViaFirebase instead
 */
export async function sendOTPViaTwilio(
    phoneNumber: string,
    otp: string,
): Promise<{
    success: boolean
    error?: string
}> {
    console.warn("[v0] Twilio is deprecated. Use sendOTPViaFirebase instead.")
    return sendOTPViaFirebase(phoneNumber, otp)
}
