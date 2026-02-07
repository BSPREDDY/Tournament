import { NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { FormDataTable } from "@/src/db/schema/schema"
import { desc } from "drizzle-orm"

// Calculate slot based on team index (1 match = 25 teams)
function calculateSlot(index: number): number {
    return Math.floor(index / 25) + 1
}

export async function GET() {
    try {
        const forms = await db.query.FormDataTable.findMany({
            orderBy: [desc(FormDataTable.createdAt)],
        })

        // Reverse to get ascending order for slot calculation
        const reversedForms = [...forms].reverse()

        const serializedForms = reversedForms.map((f, index) => {
            const slot = calculateSlot(index)
            const matchNumber = Math.floor(index / 25) + 1
            const positionInMatch = (index % 25) + 1

            return {
                ...f,
                createdAt: f.createdAt instanceof Date ? f.createdAt.toISOString() : f.createdAt,
                updatedAt: f.updatedAt instanceof Date ? f.updatedAt.toISOString() : f.updatedAt,
                slot,
                matchNumber,
                positionInMatch,
            }
        })

        console.log("[v0] Teams fetched successfully:", serializedForms?.length || 0)
        return NextResponse.json({
            teams: serializedForms,
            totalTeams: serializedForms.length,
            totalMatches: Math.ceil(serializedForms.length / 25),
        })
    } catch (error) {
        console.log("[v0] Teams fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch teams", details: String(error) }, { status: 500 })
    }
}
