import { db } from '@/src/lib/db'
import { MatchesTable } from '@/src/db/schema/schema'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'

// PATCH: Update room visibility
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get('session')?.value

        if (!sessionCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { visibleToAll } = body

        if (typeof visibleToAll !== 'boolean') {
            return NextResponse.json({ error: 'Invalid visibility value' }, { status: 400 })
        }

        const updatedMatch = await db
            .update(MatchesTable)
            .set({ visibleToAll })
            .where(eq(MatchesTable.id, id))
            .returning()

        if (!updatedMatch.length) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 })
        }

        return NextResponse.json(updatedMatch[0])
    } catch (error) {
        console.error('Error updating room visibility:', error)
        return NextResponse.json({ error: 'Failed to update room visibility' }, { status: 500 })
    }
}
