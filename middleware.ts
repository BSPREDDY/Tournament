// import { NextRequest, NextResponse } from 'next/server'

// function verifyAuth(token: string) {
//     try {
//         // Basic token validation
//         return !!token
//     } catch (err) {
//         return false
//     }
// }

// export async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl

//     // Get the session cookie
//     const session = request.cookies.get('session')?.value

//     // Public routes that don't need authentication
//     const publicRoutes = ['/', '/auth/login', '/auth/register']
//     const isPublicRoute = publicRoutes.includes(pathname)

//     // Protected routes
//     const protectedRoutes = ['/dashboard', '/form', '/admin']
//     const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

//     if (isPublicRoute) {
//         // If user is authenticated and tries to access auth pages, redirect appropriately
//         if (session && (pathname === '/auth/login' || pathname === '/auth/register')) {
//             return NextResponse.redirect(new URL('/dashboard', request.url))
//         }
//         return NextResponse.next()
//     }

//     if (isProtectedRoute) {
//         // If route requires auth and no session, redirect to login
//         if (!session) {
//             return NextResponse.redirect(new URL('/auth/login', request.url))
//         }

//         // Verify the token is still valid
//         const verified = verifyAuth(session)
//         if (!verified) {
//             const response = NextResponse.redirect(new URL('/auth/login', request.url))
//             response.cookies.delete('session')
//             return response
//         }
//     }

//     return NextResponse.next()
// }

// export const config = {
//     matcher: [
//         /*
//          * Match all request paths except for the ones starting with:
//          * - _next/static (static files)
//          * - _next/image (image optimization files)
//          * - favicon.ico (favicon file)
//          * - public folder
//          */
//         '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.ico).*)',
//     ],
// }


import { NextRequest, NextResponse } from 'next/server'

function verifyAuth(token: string) {
    try {
        // Basic token validation
        return !!token
    } catch (err) {
        return false
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get the session cookie
    const session = request.cookies.get('session')?.value

    // Public routes that don't need authentication
    const publicRoutes = ['/', '/auth/user/login', '/auth/user/signup', '/auth/admin/login', '/auth/admin/signup']
    const isPublicRoute = publicRoutes.includes(pathname) || publicRoutes.some(route => pathname.startsWith(route))

    // Protected routes
    const protectedRoutes = ['/dashboard', '/form', '/admin']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isPublicRoute) {
        // If user is authenticated and tries to access auth pages, redirect appropriately
        if (session && (pathname === '/auth/user/login' || pathname === '/auth/user/signup')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return NextResponse.next()
    }

    if (isProtectedRoute) {
        // If route requires auth and no session, redirect to login
        if (!session) {
            return NextResponse.redirect(new URL('/auth/user/login', request.url))
        }

        // Verify the token is still valid
        const verified = verifyAuth(session)
        if (!verified) {
            const response = NextResponse.redirect(new URL('/auth/user/login', request.url))
            response.cookies.delete('session')
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.ico).*)',
    ],
}
