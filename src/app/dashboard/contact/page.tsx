"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import { redirect } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

import { toast } from "sonner"
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react"
import type { User } from "@/src/db/schema/schema"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [pageLoading, setPageLoading] = useState(true)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userResponse = await fetch("/api/auth/check")
                if (!userResponse.ok) {
                    redirect("/auth/login")
                }
                const userData = await userResponse.json()
                setUser(userData.user)
            } catch (error) {
                redirect("/auth/login")
            } finally {
                setPageLoading(false)
            }
        }
        fetchUser()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate fields
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all fields")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                toast.success("Message sent successfully! We'll get back to you soon.")
                setSubmitted(true)
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                })
                setTimeout(() => setSubmitted(false), 5000)
            } else {
                const data = await response.json()
                toast.error(data.error || "Failed to send message")
            }
        } catch (error) {
            toast.error("Failed to send message")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (pageLoading || !user) {
        return (
            <div className="min-h-screen pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center pt-28">
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="w-full pb-8 sm:pb-12">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12 animate-fade-in">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-3 sm:mb-4">
                            Get In Touch
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-12">
                        {/* Contact Info Cards */}
                        <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-primary/5 to-transparent group cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 sm:p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                    <CardTitle className="text-base sm:text-lg">Email</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Send us an email</p>
                                <a href="mailto:contact@tournament.com" className="text-primary hover:underline font-medium text-xs sm:text-sm break-all">
                                    contact@tournament.com
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-secondary/5 to-transparent group cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 sm:p-3 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                                    </div>
                                    <CardTitle className="text-base sm:text-lg">Phone</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Call us</p>
                                <a href="tel:+15551234567" className="text-secondary hover:underline font-medium text-xs sm:text-sm">
                                    +1 (555) 123-4567
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-green-500/5 to-transparent group cursor-pointer" onClick={() => window.open('https://chat.whatsapp.com', '_blank')}>
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 sm:p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.006a9.87 9.87 0 00-5.031 1.378c-1.567.897-2.727 2.627-2.727 4.608 0 1.0.264 1.957.732 2.817l-1.1 4.018 4.213-1.097c.860.464 1.83.743 2.882.743h.006c5.338 0 9.705-4.368 9.705-9.706 0-2.584-.994-5.007-2.8-6.82-1.806-1.812-4.237-2.808-6.805-2.808m8.5-1c-7.338 0-13.3 5.962-13.3 13.3s5.962 13.3 13.3 13.3 13.3-5.962 13.3-13.3-5.962-13.3-13.3-13.3m0-1c7.887 0 14.3 6.413 14.3 14.3s-6.413 14.3-14.3 14.3S.7 21.887.7 14 7.113-.7 15-.7" />
                                        </svg>
                                    </div>
                                    <CardTitle className="text-base sm:text-lg">WhatsApp</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Join our group</p>
                                <p className="font-medium text-xs sm:text-sm text-green-600 group-hover:text-green-700">Click to join</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Success Message */}
                    {submitted && (
                        <div className="mb-8 max-w-2xl mx-auto">
                            <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-green-900 dark:text-green-100">Message sent successfully!</p>
                                            <p className="text-sm text-green-800 dark:text-green-200">We'll get back to you as soon as possible.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Contact Form */}
                    <Card className="max-w-2xl mx-auto border-primary/10 shadow-lg animate-slide-up">
                        <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/2 to-secondary/5 rounded-t-lg">
                            <CardTitle className="text-xl sm:text-2xl">Send us a Message</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Fill out the form below and we'll get back to you as soon as possible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 sm:pt-8">
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs sm:text-sm font-medium">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            disabled={isLoading}
                                            className="text-xs sm:text-sm border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            disabled={isLoading}
                                            className="text-xs sm:text-sm border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40"
                                        />
                                    </div>
                                </div>

                                {/* Subject Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-xs sm:text-sm font-medium">
                                        Subject
                                    </Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        disabled={isLoading}
                                        className="text-xs sm:text-sm border-primary/20 focus:border-primary transition-all duration-300 hover:border-primary/40"
                                    />
                                </div>

                                {/* Message Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-xs sm:text-sm font-medium">
                                        Message
                                    </Label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your message here..."
                                        disabled={isLoading}
                                        rows={4}
                                        className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-primary/20 rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all duration-300 hover:border-primary/40 resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-xs sm:text-sm"
                                >
                                    <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                                    {isLoading ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
