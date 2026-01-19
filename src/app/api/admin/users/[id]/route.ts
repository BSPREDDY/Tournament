import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { UserTable } from "@/src/db/schema/schema"
import { getCurrentUser } from "@/src/lib/auth"
import { eq } from "drizzle-orm"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const [updatedUser] = await db.update(UserTable).set(body).where(eq(UserTable.id, params.id)).returning()

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await db.delete(UserTable).where(eq(UserTable.id, params.id))
    return NextResponse.json({ message: "User deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
