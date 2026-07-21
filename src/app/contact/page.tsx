"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Trophy, Mail, Phone, MapPin, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))
            toast.success("Message sent successfully! We'll get back to you soon.")
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
        } catch (error) {
            toast.error("Failed to send message. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Premium Background */}
            <div className="fixed inset-0 w-full h-full -z-10">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
                    style={{ backgroundImage: 'url(/bgmi-bg.png)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-b border-amber-500/20 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                            <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-2 rounded-lg text-black shadow-lg shadow-amber-400/30">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text hidden sm:block">NAG • IronmanYT</h1>
                        </Link>

                        <Link href="/">
                            <Button variant="ghost" className="text-amber-300 hover:bg-amber-500/10 gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto py-32 px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Contact Us</h1>
                    <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                        Have questions? We&apos;re here to help. Get in touch with our support team anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Contact Info Cards */}
                    <div className="border border-amber-500/20 backdrop-blur-md bg-black/40 rounded-2xl p-8 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-gradient-to-br from-amber-400/20 to-amber-600/10 w-14 h-14 rounded-lg flex items-center justify-center">
                                <Mail className="w-7 h-7 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold text-amber-300">Email</h3>
                        </div>
                        <p className="text-amber-100/80 mb-2">support@nag-ironmanyt.com</p>
                        <p className="text-amber-100/60 text-sm">We respond within 24 hours</p>
                    </div>

                    <div className="border border-cyan-500/20 backdrop-blur-md bg-black/40 rounded-2xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-gradient-to-br from-cyan-400/20 to-blue-600/10 w-14 h-14 rounded-lg flex items-center justify-center">
                                <Phone className="w-7 h-7 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-cyan-300">Phone</h3>
                        </div>
                        <p className="text-cyan-100/80 mb-2">+91 XXXXX XXXXX</p>
                        <p className="text-cyan-100/60 text-sm">Mon-Fri, 10 AM - 6 PM IST</p>
                    </div>

                    <div className="border border-emerald-500/20 backdrop-blur-md bg-black/40 rounded-2xl p-8 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 w-14 h-14 rounded-lg flex items-center justify-center">
                                <MapPin className="w-7 h-7 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-300">Location</h3>
                        </div>
                        <p className="text-emerald-100/80 mb-2">India</p>
                        <p className="text-emerald-100/60 text-sm">Serving gaming community nationwide</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="border border-amber-500/20 backdrop-blur-md bg-black/40 rounded-2xl p-12 shadow-xl hover:shadow-amber-500/10 transition-all">
                    <h2 className="text-3xl font-bold text-white mb-8">Send us a Message</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-amber-200">Full Name</label>
                                <Input
                                    type="text"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-amber-200">Email</label>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-amber-200">Phone Number</label>
                            <Input
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-amber-200">Subject</label>
                            <Input
                                type="text"
                                placeholder="How can we help?"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-amber-200">Message</label>
                            <textarea
                                placeholder="Tell us more about your inquiry..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                rows={6}
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-400 focus:border-amber-400 focus:ring-amber-400/20 rounded-lg p-3 resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold py-3 rounded-lg transition-all shadow-lg shadow-amber-400/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </Button>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-b from-black/60 via-black/80 to-black border-t border-amber-500/20 mt-24 relative">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <p className="text-amber-100/60 text-sm">
                        &copy; {new Date().getFullYear()} NAG • IronmanYT. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}