import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { getCurrentUser } from "@/src/lib/auth"
import { FormDataTable } from "@/src/db/schema/schema"
import { tournamentFormSchema } from "@/src/lib/validations"
import { eq } from "drizzle-orm"

async function getFormConfig() {
  const config = await db.query.FormConfigTable.findFirst()
  return JSON.parse(config?.fields || "[]")
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

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
