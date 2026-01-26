import { getCurrentUser } from "@/src/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/src/components/admin/sidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) redirect("/auth/login")
    if (user.role !== "admin") redirect("/dashboard")

    return (
        <>
            <Sidebar />

            <main className="lg:ml-64 min-h-screen flex flex-col bg-background w-full">
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
                    {children}
                </div>
            </main>
        </>
    )
}
