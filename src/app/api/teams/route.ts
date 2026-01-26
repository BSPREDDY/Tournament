import { NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { FormDataTable } from "@/src/db/schema/schema"
import { desc } from "drizzle-orm"

export async function GET() {
    try {
        const forms = await db.query.FormDataTable.findMany({
            orderBy: [desc(FormDataTable.createdAt)],
        })

        const serializedForms = forms.map((f) => ({
            ...f,
            createdAt: f.createdAt instanceof Date ? f.createdAt.toISOString() : f.createdAt,
            updatedAt: f.updatedAt instanceof Date ? f.updatedAt.toISOString() : f.updatedAt,
        }))

        console.log("[v0] Teams fetched successfully:", serializedForms?.length || 0)
        return NextResponse.json(serializedForms)
    } catch (error) {
        console.log("[v0] Teams fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch teams", details: String(error) }, { status: 500 })
    }
}
