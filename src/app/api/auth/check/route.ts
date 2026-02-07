import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            console.log("Auth check: No user found");
            return NextResponse.json(
                { error: 'Unauthorized', user: null },
                { status: 401 }
            );
        }

        console.log("Auth check: User authenticated:", user.email);
        return NextResponse.json(
            { user },
            { status: 200 }
        );
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { error: 'Authorization check failed', user: null },
            { status: 500 }
        );
    }
}
