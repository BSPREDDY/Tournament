"use client"

import Link from "next/link"
import { Instagram, Youtube, Mail, Phone } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-gradient-to-b from-card via-card/80 to-background border-t border-primary/10 mt-16 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="space-y-4 slide-in">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                                <span className="text-md font-bold">Nag • IronmanTY</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            A comprehensive tournament registration and management platform for competitive gaming
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3 slide-in" style={{ animationDelay: '0.1s' }}>
                        <h3 className="font-semibold text-foreground uppercase text-xs tracking-widest">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/dashboard" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/form" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/schedule" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                                    Schedule
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/registered-teams" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                                    Registered Teams
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* More Links */}
                    <div className="space-y-3 slide-in" style={{ animationDelay: '0.2s' }}>
                        <h3 className="font-semibold text-foreground uppercase text-xs tracking-widest">Support</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/dashboard/profile" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/security" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                                    Security
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/contact" className="hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                                    Contact Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 slide-in" style={{ animationDelay: '0.3s' }}>
                        <h3 className="font-semibold text-foreground uppercase text-xs tracking-widest">Contact</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-1 cursor-pointer group">
                                <a href="mailto:nagcustomrooms@gmail.com" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
                                    nagcustomrooms@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 hover:text-primary transition-all duration-300 hover:translate-x-1 cursor-pointer group">
                                <a href="tel:+15551234567" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 group-hover:text-primary transition-colors" />
                                    +1 (555) 123-4567
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-3 slide-in" style={{ animationDelay: '0.4s' }}>
                        <h3 className="font-semibold text-foreground uppercase text-xs tracking-widest">Follow Us</h3>
                        <div className="flex gap-3">
                            <a
                                href="https://www.instagram.com/nagironman?igsh=b3NvMmhsdHFkaWVh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/30 hover:to-secondary/30 text-primary transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.youtube.com/@nagironmanyt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/30 hover:to-secondary/30 text-primary transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                                aria-label="YouTube"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:nagcustomrooms@gmail.com"
                                className="p-2.5 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/30 hover:to-secondary/30 text-primary transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-primary/10 mt-12 pt-8 slide-in" style={{ animationDelay: '0.5s' }}>
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
                        <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                            &copy; 2026 Tournament Registration. All rights reserved.
                        </p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="#" className="hover:text-primary transition-all duration-300 hover:underline underline-offset-4">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="hover:text-primary transition-all duration-300 hover:underline underline-offset-4">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
