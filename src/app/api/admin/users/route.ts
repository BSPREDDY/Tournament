import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { UserTable } from "@/src/db/schema/schema"
import { getCurrentUser } from "@/src/lib/auth"
import { desc } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await db.query.UserTable.findMany({
      orderBy: [desc(UserTable.createdAt)],
    })

    const serializedUsers = users.map((u) => ({
      ...u,
      createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
      updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : u.updatedAt,
    }))

    return NextResponse.json(serializedUsers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser()
  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { firstName, lastName, email, password, phoneNumber, role } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)

    const [newUser] = await db
      .insert(UserTable)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
        role: role || "user",
      })
      .returning()

    return NextResponse.json(newUser)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
