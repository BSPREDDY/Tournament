import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { newPassword, phoneNumber } = await req.json()

        if (!newPassword || !phoneNumber) {
            return Response.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Validate phone number format
        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
            return Response.json({ error: "Invalid phone number format" }, { status: 400 })
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 })
        }

        const sql = neon(process.env.DATABASE_URL!)

        // Find user by phone number
        const userResult = await sql`
            SELECT id FROM users 
            WHERE phone_number = ${phoneNumber}
        `

        if (userResult.length === 0) {
            return Response.json({ error: "User not found" }, { status: 404 })
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

        return Response.json({ success: true, message: "Password reset successfully" })
    } catch (error) {
        console.error("[v0] Reset password error:", error)
        return Response.json({ error: "Failed to reset password" }, { status: 500 })
    }
}
