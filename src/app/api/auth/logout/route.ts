import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { logout } from "@/src/lib/auth"

export async function POST(request: NextRequest) {
    try {
        await logout()
        console.log("User logout successful")
        return NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json(
            { message: "Logged out", error: "Cleanup error occurred" },
            { status: 200 }
        )
    }
}
