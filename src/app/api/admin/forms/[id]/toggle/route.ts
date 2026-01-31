import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { FormStatusTable } from "@/src/db/schema/schema"
import { getCurrentUser } from "@/src/lib/auth"
import { eq } from "drizzle-orm"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id } = await params
        const formId = id
        const { isEnabled } = await req.json()

        // Check if status record exists, if not create it
        const existingStatus = await db.query.FormStatusTable.findFirst({
            where: eq(FormStatusTable.formId, formId),
        })

        let updatedStatus
        if (existingStatus) {
            ;[updatedStatus] = await db
                .update(FormStatusTable)
                .set({ isEnabled, updatedAt: new Date() })
                .where(eq(FormStatusTable.formId, formId))
                .returning()
        } else {
            ;[updatedStatus] = await db.insert(FormStatusTable).values({ formId, isEnabled }).returning()
        }

        return NextResponse.json(updatedStatus)
    } catch (error) {
        console.error("[v0] Form status toggle error:", error)
        return NextResponse.json({ error: "Failed to toggle form status" }, { status: 500 })
    }
}
