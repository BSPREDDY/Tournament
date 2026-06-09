// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/src/lib/db"
// import { createSession } from "@/src/lib/auth"
// import { UserTable } from "@/src/db/schema/schema"
// import { eq } from "drizzle-orm"

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json()
//         const { token } = body

//         if (!token) {
//             return NextResponse.json(
//                 { error: "Token is required" },
//                 { status: 400 }
//             )
//         }

//         // Verify token with Google (in production, verify with Google's API)
//         // For now, we'll extract claims from the JWT token
//         const tokenParts = token.split(".")
//         if (tokenParts.length !== 3) {
//             return NextResponse.json(
//                 { error: "Invalid token format" },
//                 { status: 400 }
//             )
//         }

//         // Decode the payload (without verification for now - should verify with Google in production)
//         const payload = JSON.parse(
//             Buffer.from(tokenParts[1], "base64").toString()
//         )

//         const { sub: googleId, email, given_name, family_name } = payload

//         if (!googleId || !email) {
//             return NextResponse.json(
//                 { error: "Invalid token claims" },
//                 { status: 400 }
//             )
//         }

//         // Check if user exists by Google ID
//         let user = await db.query.UserTable.findFirst({
//             where: eq(UserTable.googleId, googleId),
//         })

//         // If not found, check by email
//         if (!user) {
//             user = await db.query.UserTable.findFirst({
//                 where: eq(UserTable.email, email),
//             })
//         }

//         // Create new user if doesn't exist
//         if (!user) {
//             const newUser = await db
//                 .insert(UserTable)
//                 .values({
//                     firstName: given_name || "User",
//                     lastName: family_name || "",
//                     email,
//                     googleId,
//                     oauthProvider: "google",
//                     // OAuth users don't need phone or password
//                     phoneNumber: null,
//                     password: null,
//                 })
//                 .returning()

//             user = newUser[0]
//             console.log("[v0] New Google OAuth user created:", email)
//         } else if (!user.googleId) {
//             // Link Google ID to existing user
//             await db
//                 .update(UserTable)
//                 .set({
//                     googleId,
//                     oauthProvider: user.oauthProvider === "facebook" ? "both" : "google",
//                 })
//                 .where(eq(UserTable.id, user.id))

//             user.googleId = googleId
//             console.log("[v0] Google ID linked to existing user:", email)
//         }

//         // Create session
//         await createSession(user.id)

//         console.log("[v0] Google OAuth login successful:", email)
//         return NextResponse.json(
//             {
//                 message: "OAuth login successful",
//                 user: {
//                     id: user.id,
//                     email: user.email,
//                     firstName: user.firstName,
//                     lastName: user.lastName,
//                     role: user.role,
//                 },
//             },
//             { status: 200 }
//         )
//     } catch (error) {
//         console.error("[v0] Google OAuth error:", error)
//         return NextResponse.json(
//             { error: "OAuth authentication failed" },
//             { status: 500 }
//         )
//     }
// }


import { NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { createSession } from "@/src/lib/auth"
import { UserTable } from "@/src/db/schema/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token, role } = body

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            )
        }

        // Verify token with Google (in production, verify with Google's API)
        // For now, we'll extract claims from the JWT token
        const tokenParts = token.split(".")
        if (tokenParts.length !== 3) {
            return NextResponse.json(
                { error: "Invalid token format" },
                { status: 400 }
            )
        }

        // Decode the payload (without verification for now - should verify with Google in production)
        const payload = JSON.parse(
            Buffer.from(tokenParts[1], "base64").toString()
        )

        const { sub: googleId, email, given_name, family_name } = payload

        if (!googleId || !email) {
            return NextResponse.json(
                { error: "Invalid token claims" },
                { status: 400 }
            )
        }

        // Check if user exists by Google ID
        let user = await db.query.UserTable.findFirst({
            where: eq(UserTable.googleId, googleId),
        })

        // If not found, check by email
        if (!user) {
            user = await db.query.UserTable.findFirst({
                where: eq(UserTable.email, email),
            })
        }

        // Create new user if doesn't exist
        if (!user) {
            const newUser = await db
                .insert(UserTable)
                .values({
                    firstName: given_name || "User",
                    lastName: family_name || "",
                    email,
                    googleId,
                    oauthProvider: "google",
                    role: role || "user",
                    // OAuth users don't need phone or password
                    phoneNumber: null,
                    password: null,
                })
                .returning()

            user = newUser[0]
            console.log("[v0] New Google OAuth user created:", email)
        } else if (!user.googleId) {
            // Link Google ID to existing user
            await db
                .update(UserTable)
                .set({
                    googleId,
                    oauthProvider: user.oauthProvider === "facebook" ? "both" : "google",
                })
                .where(eq(UserTable.id, user.id))

            user.googleId = googleId
            console.log("[v0] Google ID linked to existing user:", email)
        }

        // Create session
        await createSession(user.id)

        console.log("[v0] Google OAuth login successful:", email)
        return NextResponse.json(
            {
                message: "OAuth login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("[v0] Google OAuth error:", error)
        return NextResponse.json(
            { error: "OAuth authentication failed" },
            { status: 500 }
        )
    }
}
