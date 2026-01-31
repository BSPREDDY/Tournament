import { db } from "@/src/lib/db"
import { RegistrationConfigTable, FormDataTable } from "@/src/db/schema/schema"
import { eq } from "drizzle-orm"

export async function GET() {
    try {
        const configs = await db.select().from(RegistrationConfigTable).orderBy(RegistrationConfigTable.updatedAt).limit(1)

        // Get current team count
        const teamCountResult = await db.select().from(FormDataTable)
        const currentTeams = teamCountResult.length

        if (configs.length === 0) {
            // Create default config if none exists
            const newConfig = await db
                .insert(RegistrationConfigTable)
                .values({
                    isRegistrationOpen: true,
                    registrationStopAt: null,
                })
                .returning()

            return Response.json({ ...newConfig[0], currentTeams }, { status: 201 })
        }

        return Response.json({ ...configs[0], currentTeams }, { status: 200 })
    } catch (error) {
        console.error("[v0] Get registration config error:", error)
        return Response.json({ error: "Failed to fetch registration config" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        let body
        try {
            body = await req.json()
        } catch {
            return Response.json({ error: "Invalid request body" }, { status: 400 })
        }

        const { registrationStopAt, isRegistrationOpen, maxTeams } = body

        let stopAtDate: Date | null | undefined = undefined
        if (registrationStopAt !== undefined) {
            if (registrationStopAt === null) {
                stopAtDate = null
            } else if (typeof registrationStopAt === "string") {
                stopAtDate = new Date(registrationStopAt)
                if (isNaN(stopAtDate.getTime())) {
                    return Response.json({ error: "Invalid registrationStopAt date format" }, { status: 400 })
                }
            } else if (registrationStopAt instanceof Date) {
                stopAtDate = registrationStopAt
            } else {
                return Response.json({ error: "Invalid registrationStopAt format" }, { status: 400 })
            }
        }

        if (isRegistrationOpen !== undefined && typeof isRegistrationOpen !== "boolean") {
            return Response.json({ error: "isRegistrationOpen must be a boolean" }, { status: 400 })
        }

        // Get existing config or create if doesn't exist
        const configs = await db.select().from(RegistrationConfigTable).limit(1)

        if (configs.length === 0) {
            // Create new config if it doesn't exist
            const newConfig = await db
                .insert(RegistrationConfigTable)
                .values({
                    isRegistrationOpen: isRegistrationOpen !== undefined ? isRegistrationOpen : true,
                    registrationStopAt: stopAtDate !== undefined ? stopAtDate : null,
                    maxTeams: maxTeams || null,
                })
                .returning()

            // Get current team count
            const teamCountResult = await db.select().from(FormDataTable)
            const currentTeams = teamCountResult.length

            return Response.json({ ...newConfig[0], currentTeams }, { status: 201 })
        }

        const updateData: Record<string, any> = {}
        if (isRegistrationOpen !== undefined) {
            updateData.isRegistrationOpen = isRegistrationOpen
        }
        if (stopAtDate !== undefined) {
            updateData.registrationStopAt = stopAtDate
        }
        if (maxTeams !== undefined) {
            updateData.maxTeams = maxTeams
        }

        // Only update if there are fields to update
        if (Object.keys(updateData).length === 0) {
            // Get current team count
            const teamCountResult = await db.select().from(FormDataTable)
            const currentTeams = teamCountResult.length

            return Response.json({ ...configs[0], currentTeams }, { status: 200 })
        }

        const updatedConfig = await db
            .update(RegistrationConfigTable)
            .set(updateData)
            .where(eq(RegistrationConfigTable.id, configs[0].id))
            .returning()

        // Get current team count
        const teamCountResult = await db.select().from(FormDataTable)
        const currentTeams = teamCountResult.length

        // Auto-close registration if max teams reached
        if (maxTeams && currentTeams >= parseInt(maxTeams)) {
            if (updatedConfig[0].isRegistrationOpen) {
                await db
                    .update(RegistrationConfigTable)
                    .set({ isRegistrationOpen: false })
                    .where(eq(RegistrationConfigTable.id, configs[0].id))
                    .returning()
                updatedConfig[0].isRegistrationOpen = false
            }
        }

        return Response.json({ ...updatedConfig[0], currentTeams }, { status: 200 })
    } catch (error) {
        console.error("[v0] Update registration config error:", error)
        return Response.json({ error: "Failed to update registration config" }, { status: 500 })
    }
}
