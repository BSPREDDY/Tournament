import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { newPassword, phoneNumber } = await req.json()

        if (!newPassword || !phoneNumber) {
            console.warn("Reset password missing required fields")
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Validate phone number format
        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
            console.warn("Invalid phone format for reset:", phoneNumber)
            return Response.json(
                { error: "Invalid phone number format" },
                { status: 400 }
            )
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return Response.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            )
        }

        const sql = neon(process.env.DATABASE_URL!)

        // Find user by phone number
        const userResult = await sql`
            SELECT id FROM users 
            WHERE phone_number = ${phoneNumber}
        `

        if (userResult.length === 0) {
            console.warn("User not found for phone number:", phoneNumber)
            return Response.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password
        await sql`
            UPDATE users 
            SET password = ${hashedPassword}, 
                updated_at = NOW() 
            WHERE phone_number = ${phoneNumber}
        `

        // Clean up any remaining OTP tokens for this phone
        await sql`
            DELETE FROM verification_tokens 
            WHERE identifier = ${phoneNumber}
        `

        console.log("Password reset successfully for phone:", phoneNumber)
        return Response.json(
            { success: true, message: "Password reset successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Reset password error:", error)
        return Response.json(
            { error: "Failed to reset password", success: false },
            { status: 500 }
        )
    }
}
