import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/src/lib/db'
import { MatchTeamsTable, FormDataTable, MatchesTable } from '@/src/db/schema/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')?.value

        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Session cookie is JWT encoded, extract user ID from it
        // For now, just get the user from the request
        let userId: string | null = null

        try {
            // Try to decode JWT if it's valid
            const parts = sessionCookie.split('.')
            if (parts.length === 3) {
                const decoded = Buffer.from(parts[1], 'base64').toString('utf-8')
                const sessionData = JSON.parse(decoded)
                userId = sessionData.userId || sessionData.sub
            }
        } catch (e) {
            // If JWT parsing fails, return no credentials
            return NextResponse.json({ roomId: null, roomPassword: null })
        }

        if (!userId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        // Get user's form data
        const userFormData = await db
            .select()
            .from(FormDataTable)
            .where(eq(FormDataTable.userId, userId))
            .limit(1)

        if (!userFormData || userFormData.length === 0) {
            return NextResponse.json({ roomId: null, roomPassword: null })
        }

        // Find the match this user is assigned to
        const matchTeam = await db
            .select({
                matchId: MatchTeamsTable.matchId,
            })
            .from(MatchTeamsTable)
            .where(eq(MatchTeamsTable.formDataId, userFormData[0].id))
            .limit(1)

        if (!matchTeam || matchTeam.length === 0) {
            return NextResponse.json({ roomId: null, roomPassword: null })
        }

        // Get the match details with room credentials
        const match = await db
            .select({
                roomId: MatchesTable.roomId,
                roomPassword: MatchesTable.roomPassword,
                matchNumber: MatchesTable.matchNumber,
                passwordShareTime: MatchesTable.passwordShareTime,
                visibleToAll: MatchesTable.visibleToAll,
            })
            .from(MatchesTable)
            .where(eq(MatchesTable.id, matchTeam[0].matchId))
            .limit(1)

        if (!match || match.length === 0) {
            return NextResponse.json({ roomId: null, roomPassword: null })
        }

        // Only show credentials if:
        // 1. Admin set visibleToAll to true, OR
        // 2. User has registered in the tournament
        const showCredentials = match[0].visibleToAll || userFormData.length > 0

        return NextResponse.json({
            roomId: showCredentials ? match[0].roomId : null,
            roomPassword: showCredentials ? match[0].roomPassword : null,
            matchNumber: match[0].matchNumber,
            passwordShareTime: match[0].passwordShareTime,
            visibleToAll: match[0].visibleToAll,
        })
    } catch (error) {
        console.error('Error fetching room credentials:', error)
        return NextResponse.json({ error: 'Failed to fetch room credentials' }, { status: 500 })
    }
}
