/**
 * MSG91 OTP Widget Service
 * Handles widget token generation and verification
 */

/**
 * Generate access token for MSG91 OTP widget
 * Token is used to initialize the widget on frontend
 */
export async function generateMSG91WidgetToken(phoneNumber: string) {
    try {
        const authKey = process.env.MSG91_AUTH_KEY
        const widgetId = process.env.MSG91_WIDGET_ID

        if (!authKey || !widgetId) {
            console.error("[MSG91] Missing MSG91_AUTH_KEY or MSG91_WIDGET_ID")
            return {
                success: false,
                error: "MSG91 widget not configured",
            }
        }

        // Remove '+' from phone number if present
        const cleanPhone = phoneNumber.startsWith("+") ? phoneNumber.slice(1) : phoneNumber

        // Generate token via MSG91 API
        const url = "https://control.msg91.com/api/v5/widget/generateAccessToken"

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                authkey: authKey,
                identifier: cleanPhone,
            }),
        })

        const data = await response.json()

        if (response.ok && data.type === "success") {
            console.log(`[MSG91] Widget token generated for ${phoneNumber}`)
            return {
                success: true,
                token: data.token,
            }
        }

        console.error("[MSG91] Failed to generate widget token:", data)
        return {
            success: false,
            error: data.message || "Failed to generate widget token",
        }
    } catch (error) {
        console.error("[MSG91] Error generating widget token:", error)
        return {
            success: false,
            error: "Failed to generate widget token",
        }
    }
}

/**
 * Verify access token from MSG91 OTP widget
 * Called after user enters OTP in widget
 */
export async function verifyMSG91WidgetToken(accessToken: string) {
    try {
        const authKey = process.env.MSG91_AUTH_KEY

        if (!authKey) {
            console.error("[MSG91] Missing MSG91_AUTH_KEY")
            return {
                success: false,
                error: "MSG91 not configured",
            }
        }

        const url = "https://control.msg91.com/api/v5/widget/verifyAccessToken"

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                authkey: authKey,
                "access-token": accessToken,
            }),
        })

        const data = await response.json()

        if (response.ok && data.type === "success") {
            console.log("[MSG91] Widget token verified successfully")
            return {
                success: true,
                phone: data.phone || data.identifier,
            }
        }

        console.error("[MSG91] Failed to verify widget token:", data)
        return {
            success: false,
            error: data.message || "Failed to verify OTP",
        }
    } catch (error) {
        console.error("[MSG91] Error verifying widget token:", error)
        return {
            success: false,
            error: "Failed to verify OTP",
        }
    }
}
