import { NextResponse } from "next/server"
import { getCurrentUser } from "@/src/lib/auth"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        // Convert file to Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Ensure public/uploads directory exists
        const uploadsDir = path.join(process.cwd(), "public", "uploads")
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
        }

        // Create safe unique filename
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const filename = `${timestamp}_${safeName}`
        const filePath = path.join(uploadsDir, filename)

        // Write file to disk
        fs.writeFileSync(filePath, buffer)

        // Return public URL path
        const fileUrl = `/uploads/${filename}`

        return NextResponse.json({
            success: true,
            url: fileUrl,
            filename,
            size: file.size,
            type: file.type,
        })
    } catch (error: any) {
        console.error("Upload handler error:", error)
        return NextResponse.json({ error: "File upload failed" }, { status: 500 })
    }
}
