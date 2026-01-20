// firebase-otp.ts
import admin from "./firebase-admin"

/**
 * Store OTP in Firestore (for reference / verification)
 * Real SMS should be done via Cloud Function or Firebase Phone Auth
 */
export async function storeOTP(phoneNumber: string, otp: string) {
    try {
        await admin.firestore().collection("otps").doc(phoneNumber).set({
            otp,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        })

        console.log(`[OTP] Stored for ${phoneNumber}: ${otp}`)
        return { success: true }
    } catch (error) {
        console.error("[OTP] Store error:", error)
        throw error
    }
}
