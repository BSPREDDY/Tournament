import { verifyMSG91WidgetToken } from "@/src/lib/sms-service"

export async function POST(req: Request) {
    try {
        const { accessToken } = await req.json()

        if (!accessToken) {
            return Response.json({ error: "Access token is required" }, { status: 400 })
        }

        // Verify token with MSG91
        const result = await verifyMSG91WidgetToken(accessToken)

        if (!result.success) {
            return Response.json(
                { error: result.error || "Failed to verify OTP" },
                { status: 400 }
            )
        }

        // Return verified phone number
        return Response.json({
            success: true,
            message: "OTP verified successfully",
            phone: result.phone,
        })
    } catch (error) {
        console.error("[v0] Verify OTP error:", error)
        return Response.json({ error: "Failed to verify OTP" }, { status: 500 })
    }
}
