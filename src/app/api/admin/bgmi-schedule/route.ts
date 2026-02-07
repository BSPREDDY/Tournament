import { getCurrentUser } from "@/src/lib/auth"
import { db } from "@/src/lib/db"
import { BgmiScheduleTable } from "@/src/db/schema/schema"
import { eq } from "drizzle-orm"

export async function GET() {
    try {
        const schedules = await db.select().from(BgmiScheduleTable).orderBy(BgmiScheduleTable.date)
        return Response.json(schedules)
    } catch (error) {
        console.error("Failed to fetch schedules:", error)
        return Response.json({ error: "Failed to fetch schedules" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { date, time, maps, type } = body

        if (!date || !time || !maps || !type) {
            return Response.json({ error: "Missing required fields" }, { status: 400 })
        }

        const schedule = await db
            .insert(BgmiScheduleTable)
            .values({
                date,
                time,
                maps,
                type,
            })
            .returning()

        return Response.json(schedule[0], { status: 201 })
    } catch (error) {
        console.error("Failed to create schedule:", error)
        return Response.json({ error: "Failed to create schedule" }, { status: 500 })
    }
}
