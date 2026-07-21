import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { newPassword, email } = await req.json()

        if (!newPassword || !email) {
            console.warn("Reset password missing required fields")
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.warn("Invalid email format for reset:", email)
            return Response.json(
                { error: "Invalid email format" },
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

        // Find user by email
        const userResult = await sql`
            SELECT id FROM users 
            WHERE email = ${email}
        `

        if (userResult.length === 0) {
            console.warn("User not found for email:", email)
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
            WHERE email = ${email}
        `

        // Clean up any remaining OTP tokens for this email
        await sql`
            DELETE FROM verification_tokens 
            WHERE identifier = ${email}
        `

        console.log("Password reset successfully for email:", email)
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
