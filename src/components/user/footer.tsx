"use client"

import Link from "next/link"
import { Instagram, Youtube, Mail, Phone } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-gradient-to-r from-card via-card to-card border-t border-primary/10 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg text-white">
                                <span className="text-md font-bold">Nag • IronmanTY</span>
                            </div>
                            {/* <span className="text-lg font-bold">Tournament</span> */}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            A comprehensive tournament registration and management platform
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/dashboard" className="hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/form" className="hover:text-primary transition-colors">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/schedule" className="hover:text-primary transition-colors">
                                    Schedule
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/registered-teams" className="hover:text-primary transition-colors">
                                    Registered Teams
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* More Links */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/dashboard/profile" className="hover:text-primary transition-colors">
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/security" className="hover:text-primary transition-colors">
                                    Security
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/contact" className="hover:text-primary transition-colors">
                                    Contact Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Contact</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                                <a href="mailto:nagcustomrooms@gmail.com" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    nagcustomrooms@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                                <a href="tel:+15551234567" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    +1 (555) 123-4567
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Follow Us</h3>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/nagironman?igsh=b3NvMmhsdHFkaWVh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.youtube.com/@nagironmanyt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:nagcustomrooms@gmail.com"
                                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-primary/10 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                        <p>&copy; 2026 Tournament Registration. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="#" className="hover:text-primary transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="hover:text-primary transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
