import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { hashPassword } from "@/src/lib/hash"
import { UserTable } from "@/src/db/schema/schema"
import { eq } from "drizzle-orm"
import { registerSchema } from "@/src/lib/validations"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, validatedData.email),
        })

        if (existingUser) {
            console.warn("[v0] Registration attempt for existing email:", validatedData.email);
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password)

        const [user] = await db
            .insert(UserTable)
            .values({
                ...validatedData,
                password: hashedPassword,
            })
            .returning()

        console.log("[v0] New user registered:", user.email);
        return NextResponse.json(
            {
                message: "Registration successful",
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            },
            { status: 201 },
        )
    } catch (error) {
        if (error instanceof Error && error.message.includes('validation')) {
            console.error("[v0] Register validation error:", error.message);
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            )
        }
        console.error("[v0] Registration error:", error)
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 }
        )
    }
}
