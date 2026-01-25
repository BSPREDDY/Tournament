"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import { redirect } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { UserNavbar } from "@/src/components/user/navbar"
import { Footer } from "@/src/components/user/footer"
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
                    <div className="text-center">
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <UserNavbar user={user} />
            <div className="min-h-screen pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
                            Get In Touch
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Contact Info Cards */}
                        <Card className="border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">Email</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">Send us an email</p>
                                <a href="mailto:contact@tournament.com" className="text-primary hover:underline font-medium text-sm break-all">
                                    contact@tournament.com
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg bg-gradient-to-br from-secondary/5 to-transparent">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 rounded-lg bg-secondary/10">
                                        <Phone className="w-5 h-5 text-secondary" />
                                    </div>
                                    <CardTitle className="text-lg">Phone</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">Call us</p>
                                <a href="tel:+15551234567" className="text-secondary hover:underline font-medium text-sm">
                                    +1 (555) 123-4567
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg bg-gradient-to-br from-accent/5 to-transparent">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 rounded-lg bg-accent/10">
                                        <MapPin className="w-5 h-5 text-accent" />
                                    </div>
                                    <CardTitle className="text-lg">Location</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">Visit us</p>
                                <p className="font-medium text-sm">123 Tournament Street</p>
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
                    <Card className="max-w-2xl mx-auto border-primary/10 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                            <CardTitle className="text-2xl">Send us a Message</CardTitle>
                            <CardDescription>
                                Fill out the form below and we'll get back to you as soon as possible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            disabled={isLoading}
                                            className="border-primary/20 focus:border-primary transition-colors"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
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
                                            className="border-primary/20 focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Subject Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-sm font-medium">
                                        Subject
                                    </Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        disabled={isLoading}
                                        className="border-primary/20 focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* Message Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-sm font-medium">
                                        Message
                                    </Label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your message here..."
                                        disabled={isLoading}
                                        rows={5}
                                        className="w-full px-3 py-2 border border-primary/20 rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity font-semibold"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {isLoading ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </>
    )
}
