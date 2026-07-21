import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Helper to ensure the videos table exists
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

// Fallback seed videos if database has none posted yet
const SEED_VIDEOS = [
    {
        id: "seed-hero-1",
        title: "BGMI Championship 2026 - Final Highlight Moments",
        description: "Watch the thrilling final clash between top Esports teams in the BGMI Championship 2026.",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
        category: "hero",
        isLive: false,
        views: "125.4K",
        duration: "14:20",
    },
    {
        id: "seed-hero-2",
        title: "Top 10 Clutch Plays - BGMI Masters Pro League",
        description: "Insane 1v4 clutches and squad wipes from the recent Pro League qualifiers.",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
        category: "hero",
        isLive: false,
        views: "98.2K",
        duration: "08:45",
    },
    {
        id: "seed-hero-3",
        title: "Eragel Final Zone Warfare - Tournament Highlights",
        description: "High stakes Eragel end-game strategy and intense firefights.",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop",
        category: "hero",
        isLive: false,
        views: "74.8K",
        duration: "11:15",
    },
    {
        id: "seed-live-1",
        title: "🔴 LIVE: BGMI Grand Finals Day 3 - Official Stream",
        description: "Live broadcasting of the BGMI Grand Finals Day 3. Team Soul vs GodLike vs 7Sea!",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
        category: "live_stream",
        isLive: true,
        views: "42.1K Live",
        duration: "LIVE",
    },
    {
        id: "seed-latest-1",
        title: "Best Sniping Spots & Rotations in Miramar 2026",
        description: "Pro guide on positioning and tactical rotations for Miramar ranked matches.",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
        category: "latest_videos",
        isLive: false,
        views: "45.1K",
        duration: "16:30",
    },
    {
        id: "seed-latest-2",
        title: "Weapon Balance Update Breakdown - Patch 3.2",
        description: "In-depth review of M416 recoil adjustments, DBS nerfs, and new weapon additions.",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop",
        category: "latest_videos",
        isLive: false,
        views: "32.9K",
        duration: "10:05",
    },
    {
        id: "seed-tourney-1",
        title: "BGMI Invitational Round 4 - Match 1 Highlights",
        description: "Official match replay from Round 4 Eragel match.",
        url: "https://www.youtube.com/embed/dQw4w9WgWgQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
        category: "latest_tournament",
        isLive: false,
        views: "61.3K",
        duration: "22:10",
    },
    {
        id: "seed-tourney-2",
        title: "Semi Finals Decider Match - Miramar Showdown",
        description: "Watch the heart-pounding last match that decided the top 16 finalists.",
        url: "https://www.youtube.com/embed/dQw4w9WgWgQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
        category: "latest_tournament",
        isLive: false,
        views: "89.5K",
        duration: "25:40",
    },
]

export async function GET() {
    try {
        const sql = neon(process.env.DATABASE_URL!)
        await ensureVideosTable(sql)

        const rows = await sql`
            SELECT id, title, description, url, thumbnail_url as "thumbnailUrl", category, is_live as "isLive", views, duration, created_at as "createdAt"
            FROM videos
            ORDER BY created_at DESC
        `

        if (rows.length === 0) {
            return NextResponse.json({ videos: SEED_VIDEOS })
        }

        return NextResponse.json({ videos: rows })
    } catch (error) {
        console.error("Failed to fetch public videos:", error)
        // Fallback to seed videos on database connection errors
        return NextResponse.json({ videos: SEED_VIDEOS })
    }
}
