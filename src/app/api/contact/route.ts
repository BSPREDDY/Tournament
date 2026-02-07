import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { getCurrentUser } from "@/src/lib/auth"
import { UserContactFormTable } from "@/src/db/schema/schema"

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { name, email, subject, message } = body

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            )
        }

        // Create contact form submission
        const [submission] = await db
            .insert(UserContactFormTable)
            .values({
                userId: user.id,
                name,
                email,
                subject,
                message,
            })
            .returning()

        console.log("[v0] Contact form submitted successfully:", submission?.id)
        return NextResponse.json(
            { message: "Contact form submitted successfully", submission },
            { status: 201 }
        )
    } catch (error) {
        console.error("[v0] Contact form submission error:", error)
        return NextResponse.json(
            { error: "Failed to submit contact form" },
            { status: 500 }
        )
    }
}
