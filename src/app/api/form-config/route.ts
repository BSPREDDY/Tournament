import { NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { FormConfigTable } from "@/src/db/schema/schema"

export async function GET() {
    try {
        const config = await db.query.FormConfigTable.findFirst()

        if (!config) {
            return NextResponse.json(
                { fields: "[]", id: null },
                { status: 200 }
            )
        }

        return NextResponse.json(config, { status: 200 })
    } catch (error) {
        console.error("[v0] Form config fetch error:", error)
        return NextResponse.json(
            { fields: "[]", error: "Failed to fetch config" },
            { status: 200 }
        )
    }
}
