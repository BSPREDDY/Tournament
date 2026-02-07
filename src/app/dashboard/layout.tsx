import { getCurrentUser } from "@/src/lib/auth"
import { redirect } from "next/navigation"
import { UserNavbar } from "@/src/components/user/navbar"
import { Footer } from "@/src/components/user/footer"

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    if (!user) redirect("/auth/login")
    if (user.role === "admin") redirect("/admin")

    return (
        <div className="flex flex-col min-h-screen bg-background w-full">
            <UserNavbar user={user} />

            <main className="flex-1 pt-16 sm:pt-20 px-3 sm:px-4 md:px-6 lg:px-8 w-full">
                {children}
            </main>

            <Footer />
        </div>
    )
}
