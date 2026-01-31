import { verifyMSG91WidgetToken } from "@/src/lib/sms-service"

export async function POST(req: Request) {
    try {
        const { accessToken } = await req.json()

        if (!accessToken) {
            console.warn("Verify OTP request without access token")
            return Response.json(
                { error: "Access token is required" },
                { status: 400 }
            )
        }

        // Verify token with MSG91
        const result = await verifyMSG91WidgetToken(accessToken)

        if (!result.success) {
            console.warn("OTP verification failed:", result.error)
            return Response.json(
                { error: result.error || "Failed to verify OTP" },
                { status: 400 }
            )
        }

        // Return verified phone number
        console.log("OTP verified successfully for phone:", result.phone)
        return Response.json({
            success: true,
            message: "OTP verified successfully",
            phone: result.phone,
        }, { status: 200 })
    } catch (error) {
        console.error("Verify OTP error:", error)
        return Response.json(
            { error: "Failed to verify OTP", success: false },
            { status: 500 }
        )
    }
}
