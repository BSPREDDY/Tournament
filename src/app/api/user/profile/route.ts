import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { UserTable } from "@/src/db/schema/schema"
import { getCurrentUser } from "@/src/lib/auth"
import { eq } from "drizzle-orm"

export async function GET() {
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { firstName, lastName, email, phoneNumber } = await req.json()

        const [updatedUser] = await db
            .update(UserTable)
            .set({
                firstName,
                lastName,
                email,
                phoneNumber,
            })
            .where(eq(UserTable.id, user.id))
            .returning()

        return NextResponse.json(updatedUser)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
