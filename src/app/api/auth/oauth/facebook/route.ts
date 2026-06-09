// import { NextRequest, NextResponse } from "next/server"
// import { db } from "@/src/lib/db"
// import { createSession } from "@/src/lib/auth"
// import { UserTable } from "@/src/db/schema/schema"
// import { eq } from "drizzle-orm"

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json()
//         const { accessToken, userID, name, email } = body

//         if (!accessToken || !userID) {
//             return NextResponse.json(
//                 { error: "AccessToken and userID are required" },
//                 { status: 400 }
//             )
//         }

//         // In production, verify the access token with Facebook API
//         // For now, we'll trust the client-provided data
//         // This should be verified server-side with Facebook's API

//         if (!email) {
//             return NextResponse.json(
//                 { error: "Email is required" },
//                 { status: 400 }
//             )
//         }

//         // Check if user exists by Facebook ID
//         let user = await db.query.UserTable.findFirst({
//             where: eq(UserTable.facebookId, userID),
//         })

//         // If not found, check by email
//         if (!user) {
//             user = await db.query.UserTable.findFirst({
//                 where: eq(UserTable.email, email),
//             })
//         }

//         // Parse name into firstName and lastName
//         const nameParts = name ? name.split(" ") : ["User", ""]
//         const firstName = nameParts[0] || "User"
//         const lastName = nameParts.slice(1).join(" ") || ""

//         // Create new user if doesn't exist
//         if (!user) {
//             const newUser = await db
//                 .insert(UserTable)
//                 .values({
//                     firstName,
//                     lastName,
//                     email,
//                     facebookId: userID,
//                     oauthProvider: "facebook",
//                     // OAuth users don't need phone or password
//                     phoneNumber: null,
//                     password: null,
//                 })
//                 .returning()

//             user = newUser[0]
//             console.log("[v0] New Facebook OAuth user created:", email)
//         } else if (!user.facebookId) {
//             // Link Facebook ID to existing user
//             await db
//                 .update(UserTable)
//                 .set({
//                     facebookId: userID,
//                     oauthProvider: user.oauthProvider === "google" ? "both" : "facebook",
//                 })
//                 .where(eq(UserTable.id, user.id))

//             user.facebookId = userID
//             console.log("[v0] Facebook ID linked to existing user:", email)
//         }

//         // Create session
//         await createSession(user.id)

//         console.log("[v0] Facebook OAuth login successful:", email)
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
//         console.error("[v0] Facebook OAuth error:", error)
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
        const { accessToken, userID, name, email, role } = body

        if (!accessToken || !userID) {
            return NextResponse.json(
                { error: "AccessToken and userID are required" },
                { status: 400 }
            )
        }

        // In production, verify the access token with Facebook API
        // For now, we'll trust the client-provided data
        // This should be verified server-side with Facebook's API

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        // Check if user exists by Facebook ID
        let user = await db.query.UserTable.findFirst({
            where: eq(UserTable.facebookId, userID),
        })

        // If not found, check by email
        if (!user) {
            user = await db.query.UserTable.findFirst({
                where: eq(UserTable.email, email),
            })
        }

        // Parse name into firstName and lastName
        const nameParts = name ? name.split(" ") : ["User", ""]
        const firstName = nameParts[0] || "User"
        const lastName = nameParts.slice(1).join(" ") || ""

        // Create new user if doesn't exist
        if (!user) {
            const newUser = await db
                .insert(UserTable)
                .values({
                    firstName,
                    lastName,
                    email,
                    facebookId: userID,
                    oauthProvider: "facebook",
                    role: role || "user",
                    // OAuth users don't need phone or password
                    phoneNumber: null,
                    password: null,
                })
                .returning()

            user = newUser[0]
            console.log("[v0] New Facebook OAuth user created:", email)
        } else if (!user.facebookId) {
            // Link Facebook ID to existing user
            await db
                .update(UserTable)
                .set({
                    facebookId: userID,
                    oauthProvider: user.oauthProvider === "google" ? "both" : "facebook",
                })
                .where(eq(UserTable.id, user.id))

            user.facebookId = userID
            console.log("[v0] Facebook ID linked to existing user:", email)
        }

        // Create session
        await createSession(user.id)

        console.log("[v0] Facebook OAuth login successful:", email)
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
        console.error("[v0] Facebook OAuth error:", error)
        return NextResponse.json(
            { error: "OAuth authentication failed" },
            { status: 500 }
        )
    }
}
