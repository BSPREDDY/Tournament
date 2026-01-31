import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { getCurrentUser } from "@/src/lib/auth"
import { UserContactFormTable } from "@/src/db/schema/schema"
import { eq } from "drizzle-orm"

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = params

        // Delete the contact form
        const result = await db
            .delete(UserContactFormTable)
            .where(eq(UserContactFormTable.id, id))

        console.log("[v0] Contact form deleted successfully:", id)
        return NextResponse.json(
            { message: "Contact form deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.log("[v0] Error deleting contact form:", error)
        return NextResponse.json(
            { error: "Failed to delete contact form", details: String(error) },
            { status: 500 }
        )
    }
}