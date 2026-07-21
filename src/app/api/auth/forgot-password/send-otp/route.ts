import { neon } from "@neondatabase/serverless"
import { generateOTP, sendOTPEmail } from "@/src/lib/email-service"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            console.warn("Send OTP request without email")
            return Response.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.warn("Invalid email format:", email)
            return Response.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        const sql = neon(process.env.DATABASE_URL!)

        // Check if user exists
        const userResult = await sql`
            SELECT id FROM users 
            WHERE email = ${email}
        `

        if (userResult.length === 0) {
            console.warn("Email not registered:", email)
            return Response.json(
                { error: "Email not registered" },
                { status: 404 }
            )
        }

        // Generate OTP
        const otp = generateOTP()

        // Delete any existing OTP for this email
        await sql`DELETE FROM verification_tokens WHERE identifier = ${email}`

        // Calculate expiry time: 10 minutes from now
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000)

        console.log("[v0] OTP Generation - Email:", email, "OTP:", otp, "Now:", new Date().toISOString(), "Expires:", expiryTime.toISOString())

        // Insert new OTP - let database handle the timezone
        await sql`
            INSERT INTO verification_tokens (identifier, token, expires_at)
            VALUES (${email}, ${otp}, to_timestamp(${expiryTime.getTime()} / 1000.0))
        `

        // Send OTP to email
        const emailSent = await sendOTPEmail(email, otp)

        if (!emailSent) {
            console.error("Failed to send OTP email to:", email)
            return Response.json(
                { error: "Failed to send OTP email" },
                { status: 500 }
            )
        }

        console.log("[v0] OTP sent to email:", email)
        return Response.json({
            success: true,
            message: "OTP sent to email",
        }, { status: 200 })
    } catch (error) {
        console.error("[v0] Send OTP error:", error)

        // Check if it's a credentials issue
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS_2) {
            console.error("[v0] Missing email credentials: EMAIL_USER or EMAIL_PASS_2")
            return Response.json(
                { error: "Email service not configured. Please contact administrator." },
                { status: 500 }
            )
        }

        return Response.json(
            { error: "Failed to send OTP", success: false },
            { status: 500 }
        )
    }
}
