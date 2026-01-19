import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { verifyPassword } from '@/src/lib/hash';
import { createSession } from '@/src/lib/auth';
import { UserTable } from '@/src/db/schema/schema';
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
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session
        await createSession(user.id);

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
