import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getCurrentUser } from "@/src/lib/auth"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { title, description, url, thumbnailUrl, category, isLive, views, duration } = body

        if (!title || !url || !category) {
            return NextResponse.json({ error: "Title, Video URL, and Category are required" }, { status: 400 })
        }

        const sql = neon(process.env.DATABASE_URL!)

        const result = await sql`
            UPDATE videos
            SET title = ${title},
                description = ${description || null},
                url = ${url},
                thumbnail_url = ${thumbnailUrl || null},
                category = ${category},
                is_live = ${isLive || false},
                views = ${views || "0"},
                duration = ${duration || null},
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING id, title, description, url, thumbnail_url as "thumbnailUrl", category, is_live as "isLive", views, duration, updated_at as "updatedAt"
        `

        if (result.length === 0) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 })
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error("Failed to update video:", error)
        return NextResponse.json({ error: "Failed to update video" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const sql = neon(process.env.DATABASE_URL!)

        await sql`
            DELETE FROM videos
            WHERE id = ${id}
        `

        return NextResponse.json({ message: "Video deleted successfully" })
    } catch (error) {
        console.error("Failed to delete video:", error)
        return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
    }
}
