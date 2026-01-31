import { db } from "@/src/lib/db"
import { FormDataTable, UserTable, RegistrationConfigTable } from "@/src/db/schema/schema"
import { count, sql } from "drizzle-orm"

export async function GET() {
    try {
        const totalRegistrations = await db.select({ count: count() }).from(FormDataTable)

        const registrationsByDate = await db
            .select({
                date: sql`DATE(${FormDataTable.createdAt})`.as("date"),
                count: count().as("count"),
            })
            .from(FormDataTable)
            .groupBy(sql`DATE(${FormDataTable.createdAt})`)
            .orderBy(sql`DATE(${FormDataTable.createdAt}) DESC`)
            .limit(30)

        const registrationConfig = await db.select().from(RegistrationConfigTable).limit(1)

        const totalUsers = await db.select({ count: count() }).from(UserTable)

        const recentRegistrations = await db
            .select({
                id: FormDataTable.id,
                teamName: FormDataTable.teamName,
                iglName: FormDataTable.iglName,
                createdAt: FormDataTable.createdAt,
            })
            .from(FormDataTable)
            .orderBy(sql`${FormDataTable.createdAt} DESC`)
            .limit(10)

        const config = registrationConfig.length > 0 ? registrationConfig[0] : null
        const isRegistrationOpen = config?.isRegistrationOpen ?? true
        const registrationDeadline = config?.registrationStopAt ?? null

        return Response.json(
            {
                totalRegistrations: totalRegistrations[0]?.count ?? 0,
                totalUsers: totalUsers[0]?.count ?? 0,
                isRegistrationOpen,
                registrationDeadline,
                registrationsByDate: registrationsByDate || [],
                recentRegistrations: recentRegistrations || [],
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("[v0] Get registration status error:", error)
        return Response.json({ error: "Failed to fetch registration status" }, { status: 500 })
    }
}
