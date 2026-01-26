import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { getCurrentUser } from "@/src/lib/auth"
import { Sidebar } from "@/src/components/admin/sidebar"
import { UserNavbar } from "@/src/components/user/navbar"
import { Footer } from "@/src/components/user/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tournament Registration",
  description: "Tournament registration and management system",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ADMIN */}
        {user?.role === "admin" ? (
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              {children}
            </main>
          </div>
        ) : user ? (
          /* USER */
          <div className="flex flex-col min-h-screen bg-background">
            <UserNavbar user={user} />
            <main className="flex-1 pt-20 px-4 sm:px-6 md:px-8">
              {children}
            </main>
            <Footer />
          </div>
        ) : (
          /* GUEST (login / register pages) */
          <>{children}</>
        )}

        <Toaster position="top-right" />
      </body>
    </html>
  )
}
