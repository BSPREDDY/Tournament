import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { getCurrentUser } from "@/src/lib/auth"
import { UserContactFormTable, UserTable } from "@/src/db/schema/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get all contact forms with user details
        const contactForms = await db
            .select({
                id: UserContactFormTable.id,
                userId: UserContactFormTable.userId,
                name: UserContactFormTable.name,
                email: UserContactFormTable.email,
                subject: UserContactFormTable.subject,
                message: UserContactFormTable.message,
                createdAt: UserContactFormTable.createdAt,
                userName: UserTable.firstName,
                userLastName: UserTable.lastName,
                userEmail: UserTable.email,
            })
            .from(UserContactFormTable)
            .innerJoin(UserTable, eq(UserContactFormTable.userId, UserTable.id))
            .orderBy(desc(UserContactFormTable.createdAt))

        console.log("[v0] Contact forms fetched successfully:", contactForms?.length || 0)
        return NextResponse.json(contactForms, { status: 200 })
    } catch (error) {
        console.error("[v0] Error fetching contact forms:", error)
        return NextResponse.json(
            { error: "Failed to fetch contact forms" },
            { status: 500 }
        )
    }
}