import { db } from "@/src/lib/db"
import { RegistrationConfigTable, FormDataTable } from "@/src/db/schema/schema"

export async function GET() {
    try {
        const configs = await db.select().from(RegistrationConfigTable).limit(1)

        if (configs.length === 0) {
            // No config, registration is open by default
            return Response.json({
                isOpen: true,
                message: "Registration is open",
                currentTeams: 0,
                maxTeams: null,
            })
        }

        const config = configs[0]

        // Get current team count
        const teamCountResult = await db.select().from(FormDataTable)
        const currentTeams = teamCountResult.length

        // Check if max teams reached (based on maxMatches where each match has 25 teams)
        const maxMatchesLimit = parseInt(config.maxMatches || "0", 10)
        const maxTeams = maxMatchesLimit * 25
        const isMaxReached = maxMatchesLimit > 0 && currentTeams >= maxTeams

        // Check if deadline passed
        let isDeadlinePassed = false
        if (config.registrationStopAt) {
            const now = new Date()
            const deadline = new Date(config.registrationStopAt)
            isDeadlinePassed = now > deadline
        }

        const isOpen = config.isRegistrationOpen && !isMaxReached && !isDeadlinePassed

        let message = ""
        if (!config.isRegistrationOpen) {
            message = "Registration is currently closed"
        } else if (isMaxReached) {
            message = `Maximum teams reached (${currentTeams}/${maxTeams}). Registration is now closed.`
        } else if (isDeadlinePassed) {
            message = "Registration deadline has passed"
        } else {
            message = "Registration is open"
        }

        return Response.json({
            isOpen,
            message,
            currentTeams,
            maxTeams,
            isMaxReached,
            isDeadlinePassed,
            isManualClosed: !config.isRegistrationOpen,
        })
    } catch (error) {
        console.error("[v0] Check registration error:", error)
        return Response.json({ error: "Failed to check registration status" }, { status: 500 })
    }
}
