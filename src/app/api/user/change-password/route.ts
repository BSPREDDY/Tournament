import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { UserTable } from "@/src/db/schema/schema"
import { getCurrentUser } from "@/src/lib/auth"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { currentPassword, newPassword } = await req.json()

        // Verify current password
        const userWithPassword = await db.query.UserTable.findFirst({
            where: eq(UserTable.id, user.id),
        })

        if (!userWithPassword) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const isValid = await bcrypt.compare(currentPassword, userWithPassword.password)
        if (!isValid) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await db.update(UserTable).set({ password: hashedPassword }).where(eq(UserTable.id, user.id))

        return NextResponse.json({ message: "Password updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
    }
}
