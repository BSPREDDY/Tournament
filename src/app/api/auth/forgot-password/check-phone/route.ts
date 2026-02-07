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

        // Check if user exists with this phone number
        const result = await sql`
            SELECT id FROM users 
            WHERE phone_number = ${phoneNumber}
            LIMIT 1
        `

        if (result.length === 0) {
            return Response.json({ error: "Phone number not registered" }, { status: 404 })
        }

        return Response.json({ success: true, message: "Phone number found" })
    } catch (error) {
        console.error("[v0] Check phone error:", error)
        return Response.json({ error: "Failed to verify phone number" }, { status: 500 })
    }
}
