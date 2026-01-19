import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from './db';
import { SessionTable, UserTable } from '@/src/db/schema/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserPayload {
    userId: string;
    email: string;
    role: string;
}

export async function createSession(userId: string): Promise<string> {
    const token = jwt.sign(
        { userId, iat: Math.floor(Date.now() / 1000) },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Store session in database
    await db.insert(SessionTable).values({
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // Set cookie
    (await cookies()).set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    return token;
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.id, decoded.userId),
        });

        return user;
    } catch (error) {
        return null;
    }
}

export async function logout() {
    (await cookies()).delete('session');
}
