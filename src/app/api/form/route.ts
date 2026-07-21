// import { type NextRequest, NextResponse } from "next/server"
// import { db } from "@/src/lib/db"
// import { getCurrentUser } from "@/src/lib/auth"
// import { FormDataTable, RegistrationConfigTable } from "@/src/db/schema/schema"
// import { tournamentFormSchema } from "@/src/lib/validations"
// import { eq } from "drizzle-orm"

// async function getFormConfig() {
//   const config = await db.query.FormConfigTable.findFirst()
//   return JSON.parse(config?.fields || "[]")
// }

// async function checkRegistrationStatus() {
//   try {
//     const config = await db.query.RegistrationConfigTable.findFirst()

//     if (!config) return { allowed: true, reason: null }

//     if (!config.isRegistrationOpen) {
//       return { allowed: false, reason: "Registration is closed by administrator" }
//     }

//     if (config.registrationStopAt) {
//       const deadline = new Date(config.registrationStopAt)
//       if (deadline <= new Date()) {
//         return { allowed: false, reason: "Registration deadline has passed" }
//       }
//     }

//     if (config.maxTeams) {
//       const maxTeamsNum =
//         typeof config.maxTeams === "string"
//           ? parseInt(config.maxTeams, 10)
//           : config.maxTeams

//       const currentTeams = await db.query.FormDataTable.findMany()
//       if (currentTeams.length >= maxTeamsNum) {
//         return { allowed: false, reason: "Maximum teams allowed has been reached" }
//       }
//     }

//     return { allowed: true, reason: null }
//   } catch (error) {
//     console.error("[v0] Error checking registration status:", error)
//     return { allowed: true, reason: null }
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()

//     const registrationStatus = await checkRegistrationStatus()
//     if (!registrationStatus.allowed) {
//       return NextResponse.json({ error: registrationStatus.reason }, { status: 403 })
//     }

//     // Validate input
//     const formData = tournamentFormSchema.parse(body)

//     // IMPORTANT FIX: convert empty strings → null
//     const sanitizedData = {
//       ...formData,

//       player1: formData.player1 || null,
//       playerId1: formData.playerId1 || null,

//       player2: formData.player2 || null,
//       playerId2: formData.playerId2 || null,

//       player3: formData.player3 || null,
//       playerId3: formData.playerId3 || null,

//       player4: formData.player4 || null,
//       playerId4: formData.playerId4 || null,

//       iglAlternateMail: formData.iglAlternateMail || null,

//       iglAlternateNumber:
//         formData.iglAlternateNumber?.trim() || null,
//     }

//     // Get current user if logged in, otherwise allow guest submission
//     const user = await getCurrentUser()
//     const guestUserId = body.guestUserId

//     // If user is logged in, check for duplicate submission
//     if (user) {
//       const existingForm = await db.query.FormDataTable.findFirst({
//         where: (form) => eq(form.userId, user.id),
//       })

//       if (existingForm) {
//         return NextResponse.json(
//           { error: "You have already submitted a form" },
//           { status: 400 }
//         )
//       }
//     } else if (guestUserId) {
//       // Check for duplicate guest submission
//       const existingGuestForm = await db.query.FormDataTable.findFirst({
//         where: (form) => eq(form.guestUserId, guestUserId),
//       })

//       if (existingGuestForm) {
//         return NextResponse.json(
//           { error: "You have already submitted a form with this session" },
//           { status: 400 }
//         )
//       }
//     }

//     // Use authenticated user ID or null for guest submission
//     const userId = user?.id || null

//     // Insert form with user ID (guest or authenticated)
//     const [submission] = await db
//       .insert(FormDataTable)
//       .values({
//         userId: userId,
//         guestUserId: guestUserId || null,
//         ...sanitizedData,
//       })
//       .returning()

//     return NextResponse.json(
//       { message: "Form submitted successfully", submission },
//       { status: 201 }
//     )
//   } catch (error: any) {
//     if (error?.name === "ZodError") {
//       const validationErrors = error.errors.map((err: any) => ({
//         field: err.path.join("."),
//         message: err.message,
//       }))

//       return NextResponse.json(
//         {
//           error: "Validation failed. Please check your input.",
//           details: validationErrors,
//         },
//         { status: 400 }
//       )
//     }

//     console.error("[v0] Form submission error:", error)
//     return NextResponse.json(
//       { error: "Form submission failed. Please try again." },
//       { status: 500 }
//     )
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const user = await getCurrentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const formData = await db.query.FormDataTable.findFirst({
//       where: (form) => eq(form.userId, user.id),
//     })

//     return NextResponse.json({ formData: formData ?? null }, { status: 200 })
//   } catch (error) {
//     console.error("Error fetching form data:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch form data", formData: null },
//       { status: 500 }
//     )
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { getCurrentUser } from "@/src/lib/auth"
import { FormDataTable, RegistrationConfigTable } from "@/src/db/schema/schema"
import { tournamentFormSchema } from "@/src/lib/validations"
import { eq } from "drizzle-orm"

async function getFormConfig() {
  const config = await db.query.FormConfigTable.findFirst()
  return JSON.parse(config?.fields || "[]")
}

async function checkRegistrationStatus() {
  try {
    const config = await db.query.RegistrationConfigTable.findFirst()

    if (!config) return { allowed: true, reason: null }

    if (!config.isRegistrationOpen) {
      return { allowed: false, reason: "Registration is closed by administrator" }
    }

    if (config.registrationStopAt) {
      const deadline = new Date(config.registrationStopAt)
      if (deadline <= new Date()) {
        return { allowed: false, reason: "Registration deadline has passed" }
      }
    }

    if (config.maxMatches) {
      const maxRegistrations =
        typeof config.maxMatches === "string"
          ? parseInt(config.maxMatches, 10)
          : config.maxMatches

      const currentTeams = await db.query.FormDataTable.findMany()
      const currentMatches = Math.ceil(currentTeams.length / 25)
      if (currentMatches >= maxRegistrations) {
        return { allowed: false, reason: "Maximum matches allowed has been reached" }
      }
    }

    return { allowed: true, reason: null }
  } catch (error) {
    console.error("[v0] Error checking registration status:", error)
    return { allowed: true, reason: null }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const registrationStatus = await checkRegistrationStatus()
    if (!registrationStatus.allowed) {
      return NextResponse.json({ error: registrationStatus.reason }, { status: 403 })
    }

    // Validate input with Zod schema
    const validationResult = tournamentFormSchema.safeParse(body)
    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }))

      return NextResponse.json(
        {
          error: "Validation failed. Please check your input.",
          details: validationErrors,
        },
        { status: 400 }
      )
    }

    const formData = validationResult.data

    // Sanitize form data: convert empty strings to null, trim whitespace
    const sanitizedData = {
      ...formData,
      teamName: formData.teamName.trim(),
      iglName: formData.iglName.trim(),
      player1: formData.player1.trim(),
      playerId1: formData.playerId1.trim(),
      player2: formData.player2.trim(),
      playerId2: formData.playerId2.trim(),
      player3: formData.player3?.trim() || null,
      playerId3: formData.playerId3?.trim() || null,
      player4: formData.player4?.trim() || null,
      playerId4: formData.playerId4?.trim() || null,
      iglMail: formData.iglMail.trim().toLowerCase(),
      iglAlternateMail: formData.iglAlternateMail?.trim().toLowerCase() || null,
      iglNumber: formData.iglNumber.trim(),
      iglAlternateNumber: formData.iglAlternateNumber?.trim() || null,
    }

    // Get current user if logged in, otherwise allow guest submission
    const user = await getCurrentUser()
    const guestUserId = body.guestUserId

    // Check for duplicate submission based on email (most important)
    const existingFormByEmail = await db.query.FormDataTable.findFirst({
      where: (form) => eq(form.iglMail, sanitizedData.iglMail),
    })

    if (existingFormByEmail) {
      return NextResponse.json(
        { error: "A team with this email address has already been registered. Please use a different email." },
        { status: 400 }
      )
    }

    // If user is logged in, check for duplicate user submission
    if (user) {
      const existingForm = await db.query.FormDataTable.findFirst({
        where: (form) => eq(form.userId, user.id),
      })

      if (existingForm) {
        return NextResponse.json(
          { error: "Your account has already submitted a team registration. You can only register one team per account." },
          { status: 400 }
        )
      }
    } else if (guestUserId) {
      // Check for duplicate guest submission
      const existingGuestForm = await db.query.FormDataTable.findFirst({
        where: (form) => eq(form.guestUserId, guestUserId),
      })

      if (existingGuestForm) {
        return NextResponse.json(
          { error: "You have already submitted a form with this session. Clear your browser storage and try again." },
          { status: 400 }
        )
      }
    }

    // Use authenticated user ID or null for guest submission
    const userId = user?.id || null

    // Insert form with user ID (guest or authenticated)
    const [submission] = await db
      .insert(FormDataTable)
      .values({
        userId: userId,
        guestUserId: guestUserId || null,
        ...sanitizedData,
      })
      .returning()

    return NextResponse.json(
      { message: "Form submitted successfully", submission },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[v0] Form submission error:", error)

    // Handle database unique constraint violations (error code 23505)
    if (error?.code === "23505") {
      const detail = error?.detail || ""

      // Specific error messages for different unique constraints
      if (detail.includes("igl_number")) {
        return NextResponse.json(
          { error: "This IGL phone number has already been registered. Please use a different phone number." },
          { status: 400 }
        )
      }

      if (detail.includes("igl_mail")) {
        return NextResponse.json(
          { error: "This IGL email has already been registered. Please use a different email address." },
          { status: 400 }
        )
      }

      // Fallback for any other unique constraint violation
      return NextResponse.json(
        { error: "A team with this information has already been registered. Please use different details." },
        { status: 400 }
      )
    }

    // Handle database foreign key constraint violations
    if (error?.code === "23503") {
      return NextResponse.json(
        { error: "Invalid data reference. Please check your submission." },
        { status: 400 }
      )
    }

    // Handle other database errors
    if (error?.code?.startsWith("23")) {
      return NextResponse.json(
        { error: "Database constraint violation. Please check your input data." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Form submission failed. Please try again later." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await db.query.FormDataTable.findFirst({
      where: (form) => eq(form.userId, user.id),
    })

    return NextResponse.json({ formData: formData ?? null }, { status: 200 })
  } catch (error) {
    console.error("Error fetching form data:", error)
    return NextResponse.json(
      { error: "Failed to fetch form data", formData: null },
      { status: 500 }
    )
  }
}
