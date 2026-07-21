import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getCurrentUser } from "@/src/lib/auth"

async function ensureVideosTable(sql: any) {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS videos (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(255) NOT NULL,
                description VARCHAR(1000),
                url VARCHAR(500) NOT NULL,
                thumbnail_url VARCHAR(500),
                category VARCHAR(50) NOT NULL,
                is_live BOOLEAN DEFAULT false NOT NULL,
                views VARCHAR(50) DEFAULT '0',
                duration VARCHAR(50),
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            );
        `
    } catch (e) {
        console.error("Error creating videos table:", e)
    }
}

export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const sql = neon(process.env.DATABASE_URL!)
        await ensureVideosTable(sql)

        const rows = await sql`
            SELECT id, title, description, url, thumbnail_url as "thumbnailUrl", category, is_live as "isLive", views, duration, created_at as "createdAt"
            FROM videos
            ORDER BY created_at DESC
        `

        return NextResponse.json(rows)
    } catch (error) {
        console.error("Failed to fetch admin videos:", error)
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, url, thumbnailUrl, category, isLive, views, duration } = body

        if (!title || !url || !category) {
            return NextResponse.json({ error: "Title, Video URL, and Category are required" }, { status: 400 })
        }

        const sql = neon(process.env.DATABASE_URL!)
        await ensureVideosTable(sql)

        const result = await sql`
            INSERT INTO videos (title, description, url, thumbnail_url, category, is_live, views, duration)
            VALUES (${title}, ${description || null}, ${url}, ${thumbnailUrl || null}, ${category}, ${isLive || false}, ${views || "0"}, ${duration || null})
            RETURNING id, title, description, url, thumbnail_url as "thumbnailUrl", category, is_live as "isLive", views, duration, created_at as "createdAt"
        `

        return NextResponse.json(result[0], { status: 201 })
    } catch (error) {
        console.error("Failed to create video:", error)
        return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
    }
}
