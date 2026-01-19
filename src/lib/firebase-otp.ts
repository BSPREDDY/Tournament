import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin SDK for server-side operations
let adminApp: any

function getAdminApp() {
    if (!adminApp) {
        try {
            // Get service account from environment
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}")

            adminApp = initializeApp({
                credential: cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            })
        } catch (error) {
            console.error("[v0] Firebase Admin initialization error:", error)
            // Return null if not configured
            return null
        }
    }
    return adminApp
}

/**
 * Send OTP via database storage
 * In production, integrate with an SMS service like Twilio, AWS SNS, or Firebase Cloud Functions
 * For now, OTP is stored in database and logged to console
 */
export async function sendFirebaseOTP(phoneNumber: string, otp: string) {
    try {
        const app = getAdminApp()
        const db = getFirestore(app)

        // Store OTP in the database
        await db.collection("otps").doc(phoneNumber).set({ otp })

        // OTP is already stored in the database by the send-otp route
        // In production, call your SMS service here
        console.log(`[v0] OTP for ${phoneNumber}: ${otp}`)

        // Example: Send via email or SMS service
        // await sendSMSViaService(phoneNumber, `Your OTP is: ${otp}`)

        return { success: true, mode: "development" }
    } catch (error) {
        console.error("[v0] OTP error:", error)
        throw error
    }
}

/**
 * Alternative: Send OTP via external SMS service
 * Replace with your preferred SMS provider (Twilio, AWS SNS, etc.)
 */
export async function sendOTPViaSMSService(phoneNumber: string, otp: string) {
    try {
        // Example implementation for sending SMS
        // You would use your SMS service API here

        console.log(`[v0] OTP sent via SMS to ${phoneNumber}: ${otp}`)
        return { success: true }
    } catch (error) {
        console.error("[v0] SMS service error:", error)
        throw error
    }
}

/**
 * Alternative: Send OTP via Firebase Cloud Function (recommended for production)
 * Set up a Cloud Function that handles SMS/Email sending
 */
export async function sendOTPViaCloudFunction(phoneNumber: string, otp: string) {
    try {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        if (!projectId) {
            throw new Error("Firebase project ID not configured")
        }

        // Call your Firebase Cloud Function
        const response = await fetch(`https://us-central1-${projectId}.cloudfunctions.net/sendOtp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber, otp }),
        })

        if (!response.ok) {
            throw new Error(`Cloud Function error: ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error("[v0] Cloud Function OTP error:", error)
        throw error
    }
}
