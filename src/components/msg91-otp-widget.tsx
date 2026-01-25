"use client"

import { useEffect, useRef, useCallback } from "react"

interface MSG91OTPWidgetProps {
    widgetId: string
    token: string
    phoneNumber: string
    onSuccess: (data: { token: string; phone: string }) => void
    onFailure: (error: string) => void
}

declare global {
    interface Window {
        msg91initSendOTP?: (config: MSG91WidgetConfig) => void
        msg91VerifyOTP?: (otp: string) => void
    }
}

interface MSG91WidgetConfig {
    widgetId: string
    tokenAuth: string
    identifier: string
    exposeMethods: boolean
    success: (data: { token: string; phone: string }) => void
    failure: (error: string) => void
}

export default function MSG91OTPWidget({
    widgetId,
    token,
    phoneNumber,
    onSuccess,
    onFailure,
}: MSG91OTPWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const scriptLoadedRef = useRef(false)
    const initAttemptedRef = useRef(false)

    const initWidget = useCallback(() => {
        if (initAttemptedRef.current || !token || !widgetId) return

        initAttemptedRef.current = true

        try {
            const configuration: MSG91WidgetConfig = {
                widgetId: widgetId,
                tokenAuth: token,
                identifier: phoneNumber,
                exposeMethods: true,
                success: (data: { token: string; phone: string }) => {
                    console.log("[v0] MSG91 OTP success:", data)
                    onSuccess(data)
                },
                failure: (error: string) => {
                    console.error("[v0] MSG91 OTP failure:", error)
                    onFailure(error || "OTP verification failed")
                },
            }

            // Call the widget init function if available
            if (typeof window.msg91initSendOTP === "function") {
                window.msg91initSendOTP(configuration)
                scriptLoadedRef.current = true
            } else {
                console.warn("[v0] MSG91 OTP script not loaded yet, will retry...")
                initAttemptedRef.current = false
            }
        } catch (error) {
            console.error("[v0] Error initializing MSG91 widget:", error)
            onFailure("Failed to initialize OTP widget")
        }
    }, [token, widgetId, phoneNumber, onSuccess, onFailure])

    useEffect(() => {
        if (!containerRef.current || scriptLoadedRef.current) return

        // Load MSG91 OTP provider script with fallback URLs
        const loadOtpScript = (urls: string[]) => {
            let currentIndex = 0

            function loadFromUrl(index: number) {
                if (index >= urls.length) {
                    console.error("[v0] Failed to load OTP script from all URLs")
                    onFailure("Failed to load OTP widget - network error")
                    return
                }

                const scriptTag = document.createElement("script")
                scriptTag.src = urls[index]
                scriptTag.async = true
                scriptTag.type = "text/javascript"

                scriptTag.onload = () => {
                    console.log(`[v0] MSG91 script loaded from ${urls[index]}`)
                    // Give script time to initialize and set global
                    setTimeout(() => {
                        initWidget()
                    }, 100)
                }

                scriptTag.onerror = () => {
                    console.warn(`[v0] Failed to load from ${urls[index]}, trying next...`)
                    currentIndex++
                    loadFromUrl(currentIndex)
                }

                document.head.appendChild(scriptTag)
            }

            loadFromUrl(0)
        }

        // Load from MSG91 CDN with fallback URLs
        loadOtpScript([
            "https://verify.msg91.com/otp-provider.js",
            "https://verify-sms.msg91.com/otp-provider.js",
        ])

        return () => {
            // Cleanup if needed
            scriptLoadedRef.current = false
            initAttemptedRef.current = false
        }
    }, [initWidget, onFailure])

    return (
        <div
            ref={containerRef}
            id="msg91-otp-widget-container"
            className="w-full min-h-20 flex items-center justify-center"
            data-msg91-widget-id={widgetId}
        >
            <div className="text-sm text-gray-500">Loading OTP verification...</div>
        </div>
    )
}
