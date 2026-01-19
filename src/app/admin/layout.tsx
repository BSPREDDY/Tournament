import type { ReactNode } from "react"
import { getCurrentUser } from "@/src/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/src/components/admin/sidebar"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:mt-0 mt-16 bg-gradient-to-br from-background via-background to-primary/2 w-full">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  )
}
