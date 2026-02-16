"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react"

export function RegistrationModal() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Welcome to NAG Tournament!", {
                    description: "Account created successfully. You'll be redirected to login.",
                    duration: 4000,
                    richColors: true,
                })
                setIsOpen(false)
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    phoneNumber: "",
                })
                setTimeout(() => {
                    window.location.href = "/auth/login?step=team-registration&message=Please complete your team registration to secure your slot"
                }, 1500)
            } else {
                toast.error("Registration Failed", {
                    description: data.error || "Please check your information and try again.",
                    duration: 4000,
                })
            }
        } catch (error) {
            toast.error("Connection Error", {
                description: "Unable to connect. Please check your internet and try again.",
                duration: 4000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-2xl shadow-lg shadow-primary/40 rounded-full transition-all duration-300 hover:scale-105 hover:brightness-110 font-bold gap-2"
            >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Tournament Registration</span>
                <span className="sm:hidden">Register</span>
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/10 bg-card/95 backdrop-blur-xl shadow-2xl animate-[blurIn_0.3s_ease-out]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Tournament Registration
                        </DialogTitle>
                        <DialogDescription>
                            Create your account to register for the tournament
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                                    First Name
                                </label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full border border-primary/20 rounded-lg focus:border-primary focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                                    Last Name
                                </label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full border border-primary/20 rounded-lg focus:border-primary focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border border-primary/20 rounded-lg focus:border-primary focus:ring-primary/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-2">
                                Phone Number
                            </label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                required
                                placeholder="+1234567890"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full border border-primary/20 rounded-lg focus:border-primary focus:ring-primary/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    placeholder="Min. 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full border border-primary/20 rounded-lg focus:border-primary focus:ring-primary/20 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl shadow-lg shadow-primary/30 transition-all duration-300 font-bold rounded-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account & Register"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
