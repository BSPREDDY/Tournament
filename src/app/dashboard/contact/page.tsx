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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-12 ">
                        {/* Contact Info Cards */}
                        <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-primary/5 to-transparent group cursor-pointer" onClick={() => window.open('mailto:nagcustomrooms@gmail.com', '_blank')}>
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
                                <a href="mailto:nagcustomrooms@gmail.com" className="text-primary hover:underline font-medium text-xs sm:text-sm break-all">
                                    nagcustomrooms@gmail.com
                                </a>
                            </CardContent>
                        </Card>

                        {/* <Card className="border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-secondary/5 to-transparent group cursor-pointer" onClick={() => window.open('tel:+15551234567', '_blank')}>
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
                        </Card> */}

                        <Card className="border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-green-500/5 to-transparent group cursor-pointer" onClick={() => window.open('https://chat.whatsapp.com', '_blank')}>
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 sm:p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                                        <svg
                                            viewBox="0 0 512 512"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-10 h-10"
                                        >
                                            {/* Green rounded background */}
                                            <defs>
                                                <linearGradient id="waGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#60F673" />
                                                    <stop offset="100%" stopColor="#25D366" />
                                                </linearGradient>
                                            </defs>

                                            <rect
                                                x="0"
                                                y="0"
                                                width="512"
                                                height="512"
                                                rx="96"
                                                ry="96"
                                                fill="url(#waGradient)"
                                            />

                                            {/* WhatsApp logo */}
                                            <path
                                                fill="#FFFFFF"
                                                d="M256.064 96C167.36 96 96 167.36 96 256c0 31.296 9.024 61.184 25.984 86.784L96 416l74.368-25.088C194.432 406.848 224.32 416 256 416c88.64 0 160-71.36 160-160S344.704 96 256.064 96zm0 289.92c-28.224 0-55.104-8.192-78.208-23.68l-5.568-3.456-44.16 14.464 14.784-43.072-3.648-5.888c-15.808-25.344-24.256-54.784-24.256-85.12 0-87.296 71.04-158.336 158.336-158.336S414.72 151.872 414.72 239.168 343.68 385.92 256.064 385.92zm87.296-116.8c-4.8-2.432-28.672-14.144-33.152-15.744-4.48-1.664-7.744-2.432-11.008 2.432-3.264 4.8-12.544 15.744-15.424 19.008-2.88 3.264-5.696 3.648-10.496 1.216-4.8-2.432-20.352-7.488-38.784-23.936-14.336-12.8-24-28.672-26.88-33.472-2.816-4.8-.256-7.424 2.176-9.856 2.176-2.176 4.8-5.696 7.168-8.512 2.432-2.816 3.264-4.8 4.8-8.064 1.536-3.264.768-6.144-.384-8.512-1.216-2.432-11.008-26.432-15.04-36.16-3.968-9.536-8-8.256-11.008-8.448h-9.408c-3.264 0-8.512 1.216-12.928 6.144-4.48 4.8-17.024 16.64-17.024 40.576 0 23.936 17.408 47.104 19.84 50.368 2.432 3.264 34.24 52.224 83.072 73.216 11.648 5.056 20.736 8.064 27.84 10.368 11.648 3.712 22.272 3.2 30.656 1.92 9.344-1.408 28.672-11.712 32.768-23.04 4.096-11.328 4.096-21.056 2.88-23.04-1.216-1.984-4.48-3.264-9.28-5.696z"
                                            />
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
