import { db } from '@/src/lib/db'
import { MatchesTable, MatchTeamsTable } from '@/src/db/schema/schema'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { eq, count } from 'drizzle-orm'

// GET: Fetch all rooms or filter by registered teams
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')?.value

        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch all matches with team counts
        const matches = await db
            .select({
                id: MatchesTable.id,
                matchNumber: MatchesTable.matchNumber,
                roomId: MatchesTable.roomId,
                roomPassword: MatchesTable.roomPassword,
                maxTeams: MatchesTable.maxTeams,
                registeredTeams: MatchesTable.registeredTeams,
                isLocked: MatchesTable.isLocked,
                visibleToAll: MatchesTable.visibleToAll,
                createdAt: MatchesTable.createdAt,
            })
            .from(MatchesTable)
            .orderBy(MatchesTable.createdAt)

        const formattedMatches = matches.map((match) => ({
            ...match,
            registeredTeams: parseInt(match.registeredTeams || '0'),
            maxTeams: parseInt(match.maxTeams || '25'),
            visibleToAll: match.visibleToAll ?? false,
        }))

        return NextResponse.json(formattedMatches)
    } catch (error) {
        console.error('Error fetching rooms:', error)
        return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
    }
}

// POST: Create a new room/match
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')?.value

        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { roomId, roomPassword } = body

        if (!roomId || !roomPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Get the current number of matches to generate match number
        const existingMatches = await db.select().from(MatchesTable)
        const matchNumber = `Match ${existingMatches.length + 1}`

        // Create new match
        const newMatch = await db
            .insert(MatchesTable)
            .values({
                matchNumber,
                roomId,
                roomPassword,
                maxTeams: '25',
                registeredTeams: '0',
                isLocked: false,
                visibleToAll: false, // Default to showing only registered teams
            })
            .returning()

        return NextResponse.json(newMatch[0], { status: 201 })
    } catch (error) {
        console.error('Error creating room:', error)
        return NextResponse.json({ error: 'Failed to create room' }, { status: 500 })
    }
}
