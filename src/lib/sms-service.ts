"use client"

import app from "./firebase"
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from "firebase/auth"

const auth = getAuth(app)

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier
        confirmationResult?: ConfirmationResult
    }
}

class FirebaseSMSService {
    private recaptcha: RecaptchaVerifier | null = null

    setupRecaptcha(containerId = "recaptcha-container") {
        if (this.recaptcha) return

        this.recaptcha = new RecaptchaVerifier(auth, containerId, {
            size: "invisible",
        })

        window.recaptchaVerifier = this.recaptcha
    }

    async sendOTP(phoneNumber: string) {
        try {
            if (!phoneNumber.startsWith("+")) {
                throw new Error("Phone number must include country code")
            }

            this.setupRecaptcha()

            const confirmation = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                window.recaptchaVerifier!
            )

            window.confirmationResult = confirmation

            return { success: true }
        } catch (error: any) {
            console.error("[Firebase SMS]", error)
            return {
                success: false,
                error: error.message || "Failed to send OTP",
            }
        }
    }

    async verifyOTP(code: string) {
        try {
            const confirmation = window.confirmationResult
            if (!confirmation) throw new Error("OTP not sent")

            const result = await confirmation.confirm(code)

            return {
                success: true,
                uid: result.user.uid,
                phoneNumber: result.user.phoneNumber,
            }
        } catch (error: any) {
            return {
                success: false,
                error: "Invalid or expired OTP",
            }
        }
    }

    cleanup() {
        this.recaptcha?.clear()
        this.recaptcha = null
        window.recaptchaVerifier = undefined
        window.confirmationResult = undefined
    }
}

export const firebaseSMS = new FirebaseSMSService()
