import { getCurrentUser } from "@/src/lib/auth"
import { db } from "@/src/lib/db"
import { BgmiScheduleTable } from "@/src/db/schema/schema"
import { eq } from "drizzle-orm"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = params

        const result = await db.delete(BgmiScheduleTable).where(eq(BgmiScheduleTable.id, id)).returning()

        if (result.length === 0) {
            return Response.json({ error: "Schedule not found" }, { status: 404 })
        }

        return Response.json({ message: "Schedule deleted successfully" })
    } catch (error) {
        console.error("Failed to delete schedule:", error)
        return Response.json({ error: "Failed to delete schedule" }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = params
        const body = await request.json()
        const { date, time, maps, type } = body

        const result = await db
            .update(BgmiScheduleTable)
            .set({
                date: date || undefined,
                time: time || undefined,
                maps: maps || undefined,
                type: type || undefined,
                updatedAt: new Date(),
            })
            .where(eq(BgmiScheduleTable.id, id))
            .returning()

        if (result.length === 0) {
            return Response.json({ error: "Schedule not found" }, { status: 404 })
        }

        return Response.json(result[0])
    } catch (error) {
        console.error("Failed to update schedule:", error)
        return Response.json({ error: "Failed to update schedule" }, { status: 500 })
    }
}
