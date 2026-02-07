import { NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { FormDataTable } from "@/src/db/schema/schema"
import { getCurrentUser } from "@/src/lib/auth"
import { desc } from "drizzle-orm"

export async function GET() {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const forms = await db.query.FormDataTable.findMany({
            orderBy: [desc(FormDataTable.createdAt)],
        })

        const serializedForms = forms.map((f) => ({
            ...f,
            createdAt: f.createdAt instanceof Date ? f.createdAt.toISOString() : f.createdAt,
            updatedAt: f.updatedAt instanceof Date ? f.updatedAt.toISOString() : f.updatedAt,
        }))

        return NextResponse.json(serializedForms)
    } catch (error) {
        console.error("[v0] Forms fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
    }
}
