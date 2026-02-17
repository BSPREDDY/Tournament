import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/src/components/theme-provider"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "Tournament Registration System",
  description: "Professional tournament registration and team management system with real-time slot allocation",
  keywords: ["tournament", "registration", "gaming", "tournament manager"],
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Tournament Registration System",
    description: "Professional tournament registration and team management",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster position="top-right" richColors={true} />
      </body>
    </html>
  )
}
