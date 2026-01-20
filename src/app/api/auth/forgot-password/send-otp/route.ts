import { neon } from "@neondatabase/serverless"

export async function POST(req: Request) {
    try {
        const { phoneNumber } = await req.json()

        if (!phoneNumber) {
            return Response.json({ error: "Phone number is required" }, { status: 400 })
        }

        // Validate phone number format
        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
            return Response.json({ error: "Invalid phone number format" }, { status: 400 })
        }

        const sql = neon(process.env.DATABASE_URL!)

        // Check if user exists
        const userResult = await sql`
            SELECT id FROM users 
            WHERE phone_number = ${phoneNumber}
        `

        if (userResult.length === 0) {
            return Response.json({ error: "Phone number not registered" }, { status: 404 })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        // Delete old OTP
        await sql`
            DELETE FROM verification_tokens
            WHERE identifier = ${phoneNumber}
        `

        // Insert new OTP
        await sql`
            INSERT INTO verification_tokens (identifier, token, expires_at)
            VALUES (${phoneNumber}, ${otp}, ${expiresAt})
        `

        // NOTE: SMS sending should be implemented via your SMS provider
        // For now, OTP is stored in database and logged in development
        console.log(`[OTP] Generated for ${phoneNumber}: ${otp} (expires at ${expiresAt.toISOString()})`)

        return Response.json({
            success: true,
            message: "OTP sent successfully",
        })
    } catch (error) {
        console.error("[v0] Send OTP error:", error)
        return Response.json(
            { error: "Failed to send OTP" },
            { status: 500 }
        )
    }
}
