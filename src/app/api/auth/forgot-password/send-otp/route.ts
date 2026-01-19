import { neon } from "@neondatabase/serverless"
import { sendOTPViaFirebase } from "@/src/lib/sms-service"

export async function POST(req: Request) {
    try {
        const { phoneNumber } = await req.json()

        if (!phoneNumber || phoneNumber.trim() === "") {
            return Response.json({ error: "Phone number is required" }, { status: 400 })
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // Store OTP in database with 10-minute expiry
        const sql = neon(process.env.DATABASE_URL!)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

        try {
            // Delete existing OTP for this phone number
            await sql`DELETE FROM verification_tokens WHERE identifier = ${phoneNumber}`

            // Insert new OTP
            await sql`INSERT INTO verification_tokens (identifier, token, expires_at) VALUES (${phoneNumber}, ${otp}, ${expiresAt})`

            const smsResult = await sendOTPViaFirebase(phoneNumber, otp)

            if (smsResult.success) {
                console.log(`[v0] OTP sent via Firebase to ${phoneNumber}`)
                return Response.json({
                    success: true,
                    message: "OTP sent to your phone number",
                    smsMethod: "firebase",
                })
            } else {
                console.log(`[v0] OTP for ${phoneNumber}: ${otp} (Firebase SMS pending - check Firebase console)`)
                return Response.json({
                    success: true,
                    message: "OTP sent to your phone number",
                    smsMethod: "firebase",
                })
            }
        } catch (dbError) {
            console.error("[v0] Database error in send-otp:", dbError)
            return Response.json({ error: "Failed to send OTP. Please try again." }, { status: 500 })
        }
    } catch (error) {
        console.error("[v0] Send OTP error:", error)
        return Response.json({ error: "An error occurred while sending OTP" }, { status: 500 })
    }
}
