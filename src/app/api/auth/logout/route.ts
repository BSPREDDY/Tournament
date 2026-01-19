import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
    ; (await cookies()).delete("session")

    return NextResponse.json({ message: "Logged out successfully" })
}
