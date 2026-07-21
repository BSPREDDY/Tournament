'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!googleClientId) {
        console.error('[v0] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google OAuth will not work.')
        return <>{children}</>
    }

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            {children}
        </GoogleOAuthProvider>
    )
}
