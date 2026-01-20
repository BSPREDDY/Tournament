import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { FormDataTable } from "@/src/db/schema/schema"
import { getCurrentUser } from "@/src/lib/auth"
import { eq } from "drizzle-orm"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id } = await params
        const formId = id
        const data = await req.json()

        const [updatedForm] = await db
            .update(FormDataTable)
            .set({
                teamName: data.teamName,
                iglName: data.iglName,
                player1: data.player1,
                playerId1: data.playerId1,
                player2: data.player2,
                playerId2: data.playerId2,
                player3: data.player3,
                playerId3: data.playerId3,
                player4: data.player4,
                playerId4: data.playerId4,
                iglMail: data.iglMail,
                iglAlternateMail: data.iglAlternateMail,
                iglNumber: data.iglNumber,
                iglAlternateNumber: data.iglAlternateNumber,
                updatedAt: new Date(),
            })
            .where(eq(FormDataTable.id, formId))
            .returning()

        return NextResponse.json(updatedForm)
    } catch (error) {
        console.error("[v0] Form update error:", error)
        return NextResponse.json({ error: "Failed to update form" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { id } = await params
        const formId = id
        await db.delete(FormDataTable).where(eq(FormDataTable.id, formId))
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[v0] Form delete error:", error)
        return NextResponse.json({ error: "Failed to delete form" }, { status: 500 })
    }
}
