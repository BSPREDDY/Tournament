import { neon } from "@neondatabase/serverless"
import { generateMSG91WidgetToken } from "@/src/lib/sms-service"

export async function POST(req: Request) {
    try {
        const { phoneNumber } = await req.json()

        if (!phoneNumber) {
            console.warn("Send OTP request without phone number")
            return Response.json(
                { error: "Phone number is required" },
                { status: 400 }
            )
        }

        // Validate phone number format
        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
            console.warn("Invalid phone format:", phoneNumber)
            return Response.json(
                { error: "Invalid phone number format" },
                { status: 400 }
            )
        }

        const sql = neon(process.env.DATABASE_URL!)

        // Check if user exists
        const userResult = await sql`
            SELECT id FROM users 
            WHERE phone_number = ${phoneNumber}
        `

        if (userResult.length === 0) {
            console.warn("Phone number not registered:", phoneNumber)
            return Response.json(
                { error: "Phone number not registered" },
                { status: 404 }
            )
        }

        // Generate MSG91 widget token
        const tokenResult = await generateMSG91WidgetToken(phoneNumber)

        if (!tokenResult.success) {
            console.error("MSG91 widget token generation failed:", tokenResult.error)
            return Response.json(
                { error: tokenResult.error || "Failed to generate OTP widget token" },
                { status: 500 }
            )
        }

        console.log("[v0] OTP widget generated for phone:", phoneNumber)
        return Response.json({
            success: true,
            token: tokenResult.token,
            message: "OTP widget ready",
        }, { status: 200 })
    } catch (error) {
        console.error("[v0] Send OTP error:", error)
        return Response.json(
            { error: "Failed to send OTP", success: false },
            { status: 500 }
        )
    }
}
