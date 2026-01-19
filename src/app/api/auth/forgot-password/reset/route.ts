import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { sessionId, newPassword, phoneNumber } = await req.json()

        if (!sessionId || !newPassword || !phoneNumber) {
            return Response.json({ error: "Missing required fields" }, { status: 400 })
        }

        if (newPassword.length < 8) {
            return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 })
        }

        const sql = neon(process.env.DATABASE_URL!)

        // Find user by phone number - using tagged template literal
        const userResult = await sql`
            SELECT * FROM users 
            WHERE phone_number = ${phoneNumber}
        `

        if (userResult.length === 0) {
            return Response.json({ error: "User not found" }, { status: 404 })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password - using tagged template literal
        await sql`
            UPDATE users 
            SET password = ${hashedPassword}, 
                updated_at = NOW() 
            WHERE phone_number = ${phoneNumber}
        `

        // Delete OTP token - using tagged template literal
        await sql`
            DELETE FROM verification_tokens 
            WHERE identifier = ${sessionId}
        `

        return Response.json({ success: true })
    } catch (error) {
        console.error("Reset password error:", error)
        return Response.json({ error: "Failed to reset password" }, { status: 500 })
    }
}
