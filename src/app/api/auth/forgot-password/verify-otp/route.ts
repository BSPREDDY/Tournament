import { neon } from "@neondatabase/serverless"

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json()

        if (!email || !otp) {
            console.warn("Verify OTP request missing email or otp")
            return Response.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            )
        }

        const sql = neon(process.env.DATABASE_URL!)

        // Verify OTP from database
        const tokenResult = await sql`
            SELECT token, expires_at FROM verification_tokens 
            WHERE identifier = ${email}
        `

        if (tokenResult.length === 0) {
            console.warn("No OTP found for email:", email)
            return Response.json(
                { error: "OTP not found or expired" },
                { status: 400 }
            )
        }

        const { token, expires_at } = tokenResult[0]

        // Convert expires_at to Date object (timezone-safe)
        // Since database stores it in UTC but pg driver might parse it in local server time,
        // we reconstruct the date object by treating its local components as UTC.
        let expiresAtDate: Date
        if (expires_at instanceof Date) {
            expiresAtDate = new Date(Date.UTC(
                expires_at.getFullYear(),
                expires_at.getMonth(),
                expires_at.getDate(),
                expires_at.getHours(),
                expires_at.getMinutes(),
                expires_at.getSeconds(),
                expires_at.getMilliseconds()
            ))
        } else if (typeof expires_at === 'string') {
            let str = expires_at.trim()
            if (!str.endsWith("Z") && !/[+-]\d{2}(:\d{2})?$/.test(str)) {
                str = str.replace(" ", "T") + "Z"
            }
            expiresAtDate = new Date(str)
        } else {
            console.error("[v0] Invalid expires_at format:", typeof expires_at, expires_at)
            return Response.json(
                { error: "Invalid token format" },
                { status: 400 }
            )
        }

        const nowDate = new Date()
        const isExpired = expiresAtDate.getTime() < nowDate.getTime()

        console.log("[v0] OTP Verification - Email:", email, "OTP:", otp, "Token from DB:", token, "Now:", nowDate.toISOString(), "Expires:", expiresAtDate.toISOString(), "IsExpired:", isExpired)

        if (isExpired) {
            console.warn("[v0] OTP expired for email:", email, "Expires:", expiresAtDate.toISOString(), "Now:", nowDate.toISOString())
            return Response.json(
                { error: "OTP has expired" },
                { status: 400 }
            )
        }

        // Verify OTP matches
        if (token.toString().trim() !== otp.toString().trim()) {
            console.warn("[v0] Invalid OTP for email:", email, "Expected:", token, "Got:", otp)
            return Response.json(
                { error: "Invalid OTP" },
                { status: 400 }
            )
        }

        // Delete the used OTP
        await sql`
            DELETE FROM verification_tokens 
            WHERE identifier = ${email}
        `

        console.log("OTP verified successfully for email:", email)
        return Response.json({
            success: true,
            message: "OTP verified successfully",
            email: email,
        }, { status: 200 })
    } catch (error) {
        console.error("Verify OTP error:", error)
        return Response.json(
            { error: "Failed to verify OTP", success: false },
            { status: 500 }
        )
    }
}
