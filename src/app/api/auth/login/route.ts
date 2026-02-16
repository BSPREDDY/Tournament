import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { verifyPassword } from '@/src/lib/hash';
import { createSession } from '@/src/lib/auth';
import { UserTable, FormDataTable } from '@/src/db/schema/schema';
import { eq } from 'drizzle-orm';
import { loginSchema } from '@/src/lib/validations';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        // Find user
        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, email),
        });

        if (!user) {
            console.warn("Login attempt for non-existent email:", email);
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            console.warn("Invalid password for user:", email);
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session
        await createSession(user.id);

        // Link any guest submissions to this user
        const guestUserId = request.headers.get('x-guest-user-id');
        if (guestUserId) {
            await db
                .update(FormDataTable)
                .set({ userId: user.id, guestUserId: null })
                .where(eq(FormDataTable.guestUserId, guestUserId))
        }

        console.log("User logged in:", email);
        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            }
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error && error.message.includes('validation')) {
            console.error("Login validation error:", error.message);
            return NextResponse.json(
                { error: 'Invalid request format' },
                { status: 400 }
            );
        }
        console.error("Login error:", error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
