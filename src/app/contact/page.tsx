'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Card } from '@/src/components/ui/card'
import { Trophy, Mail, Phone, MapPin, Send } from 'lucide-react'
import { useToast } from '@/src/hooks/use-toast'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: '',
    })

    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (
            !formData.name ||
            !formData.email ||
            !formData.subject ||
            !formData.message
        ) {
            toast({
                title: 'Error',
                description: 'Please fill in all required fields',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            toast({
                title: 'Success',
                description: 'Your message has been sent successfully!',
            })

            setFormData({
                name: '',
                email: '',
                phoneNumber: '',
                subject: '',
                message: '',
            })
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error instanceof Error ? error.message : 'Failed to send message',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-card via-card to-card border-b border-primary/10 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-bold gradient-text">
                                Nag <strong>•</strong> IronmanTY
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    className="hover:bg-primary/10"
                                >
                                    Home
                                </Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button
                                    variant="ghost"
                                    className="hover:bg-primary/10"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg">
                                    Register
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 mt-16">
                {/* Header */}
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-5xl sm:text-6xl font-bold gradient-text">
                        Get In Touch
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have questions or need support? We'd love to hear from you. Send us a
                        message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Contact Information Cards */}
                    <Card className="p-8 border-primary/20 hover:border-primary/50 transition-colors group">
                        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                            <Mail className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Email</h3>
                        <p className="text-muted-foreground text-sm">
                            contact@nagtournament.com
                        </p>
                    </Card>

                    <Card className="p-8 border-secondary/20 hover:border-secondary/50 transition-colors group">
                        <div className="bg-gradient-to-br from-secondary/20 to-primary/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:from-secondary/30 group-hover:to-primary/30 transition-colors">
                            <Phone className="w-7 h-7 text-secondary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Phone</h3>
                        <p className="text-muted-foreground text-sm">+91 XXXXXXXXXX</p>
                    </Card>

                    <Card className="p-8 border-primary/20 hover:border-primary/50 transition-colors group">
                        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                            <MapPin className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Location</h3>
                        <p className="text-muted-foreground text-sm">India</p>
                    </Card>
                </div>

                {/* Contact Form */}
                <Card className="p-8 md:p-12 border-primary/20 card-glow max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Send us a Message</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground">
                                    Full Name *
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border-primary/20 focus:border-primary/50"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground">
                                    Email Address *
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border-primary/20 focus:border-primary/50"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-foreground">
                                Phone Number
                            </Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                placeholder="+91 XXXXXXXXXX"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="border-primary/20 focus:border-primary/50"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-foreground">
                                Subject *
                            </Label>
                            <Input
                                id="subject"
                                name="subject"
                                type="text"
                                placeholder="What is this about?"
                                value={formData.subject}
                                onChange={handleChange}
                                className="border-primary/20 focus:border-primary/50"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-foreground">
                                Message *
                            </Label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Tell us more about your message..."
                                value={formData.message}
                                onChange={handleChange}
                                disabled={isLoading}
                                rows={5}
                                className="w-full px-4 py-2 border border-primary/20 rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-shadow gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {isLoading ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                </Card>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-card via-card to-card border-t border-primary/10 mt-24">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold gradient-text">
                                    Nag <strong>•</strong> IronmanTY
                                </h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                The ultimate platform for gaming tournament registrations and
                                team management.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link
                                        href="/auth/register"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Register
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/auth/login"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <Link
                                        href="/contact"
                                        className="hover:text-primary transition-colors"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-primary transition-colors"
                                    >
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-primary/10 pt-5 text-center text-sm text-muted-foreground">
                        <p>
                            &copy; {new Date().getFullYear()} Nag <strong>•</strong> IronmanTY.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
