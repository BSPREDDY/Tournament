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
    // Get registration config
    const config = await db.query.RegistrationConfigTable.findFirst()

    if (!config) {
      return { allowed: true, reason: null }
    }

    // Check if registration is manually closed
    if (!config.isRegistrationOpen) {
      return { allowed: false, reason: "Registration is closed by administrator" }
    }

    // Check if deadline has passed
    if (config.registrationStopAt) {
      const deadline = new Date(config.registrationStopAt)
      const now = new Date()
      if (deadline <= now) {
        return { allowed: false, reason: "Registration deadline has passed" }
      }
    }

    // Check if max teams limit reached
    if (config.maxTeams) {
      const maxTeamsNum = typeof config.maxTeams === 'string' ? parseInt(config.maxTeams, 10) : config.maxTeams
      const currentTeams = await db.query.FormDataTable.findMany()

      if (currentTeams.length >= maxTeamsNum) {
        return { allowed: false, reason: "Maximum teams allowed has been reached" }
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
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Check registration status before accepting submission
    const registrationStatus = await checkRegistrationStatus()
    if (!registrationStatus.allowed) {
      return NextResponse.json({ error: registrationStatus.reason }, { status: 403 })
    }

    const formData = tournamentFormSchema.parse(body)
    const dynamicFields = await getFormConfig()
    const dynamicData: Record<string, any> = {}

    dynamicFields.forEach((field: any) => {
      if (body[field.name]) {
        dynamicData[field.name] = body[field.name]
      }
    })

    // Check if user already submitted a form
    const existingForm = await db.query.FormDataTable.findFirst({
      where: (form) => eq(form.userId, user.id),
    })

    if (existingForm) {
      return NextResponse.json({ error: "You have already submitted a form" }, { status: 400 })
    }

    // Create form submission
    const [submission] = await db
      .insert(FormDataTable)
      .values({
        userId: user.id,
        ...formData,
      })
      .returning()

    return NextResponse.json({ message: "Form submitted successfully", submission, dynamicData }, { status: 201 })
  } catch (error) {
    console.error("Form submission error:", error)
    return NextResponse.json({ error: "Form submission failed" }, { status: 500 })
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

    return NextResponse.json({ formData })
  } catch (error) {
    console.error("Error fetching form data:", error)
    return NextResponse.json({ error: "Failed to fetch form data" }, { status: 500 })
  }
}
