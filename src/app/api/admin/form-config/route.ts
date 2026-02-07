import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { FormConfigTable } from "@/src/db/schema/schema"
import { getCurrentUser } from "@/src/lib/auth"

export async function GET() {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const config = await db.query.FormConfigTable.findFirst()
        return NextResponse.json(config || { fields: "[]" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { fields } = await req.json()
        const existing = await db.query.FormConfigTable.findFirst()

        if (existing) {
            await db.update(FormConfigTable).set({ fields: JSON.stringify(fields) })
        } else {
            await db.insert(FormConfigTable).values({ fields: JSON.stringify(fields) })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to save config" }, { status: 500 })
    }
}
