import { neon } from "@neondatabase/serverless"

export async function POST(req: Request) {
    try {
        const { phoneNumber, otp } = await req.json()

        if (!phoneNumber || !otp) {
            return Response.json({ error: "Phone number and OTP are required" }, { status: 400 })
        }

        const sql = neon(process.env.DATABASE_URL!)

        // Verify OTP against database
        const result = await sql`
      SELECT * FROM verification_tokens 
      WHERE identifier = ${phoneNumber} 
      AND token = ${otp} 
      AND expires_at > NOW()
    `

        if (result.length === 0) {
            return Response.json({ error: "Invalid or expired OTP" }, { status: 400 })
        }

        // Delete OTP after successful verification
        await sql`DELETE FROM verification_tokens WHERE identifier = ${phoneNumber}`

        return Response.json({ success: true, message: "OTP verified successfully" })
    } catch (error) {
        console.error("[v0] Verify OTP error:", error)
        return Response.json({ error: "Failed to verify OTP" }, { status: 500 })
    }
}
