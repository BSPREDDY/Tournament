"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Trophy, ChevronDown, ArrowLeft } from "lucide-react"

interface FAQItem {
    id: number
    question: string
    answer: string
    category: string
}

const faqItems: FAQItem[] = [
    {
        id: 1,
        category: "Registration",
        question: "How do I register for the tournament?",
        answer: "Visit our signup page, create your account with your email, and then register your 4-player team with each member's game ID. Once verified, you'll get instant confirmation and access to your dashboard.",
    },
    {
        id: 2,
        category: "Registration",
        question: "What information do I need to register?",
        answer: "You'll need your name, email, phone number, and your team member's BGMI game IDs. Make sure all information is accurate as it will be used for tournament verification.",
    },
    {
        id: 3,
        category: "Registration",
        question: "Can I change my team members after registration?",
        answer: "Team changes are allowed within 48 hours of initial registration. Contact our support team for any modifications after that period.",
    },
    {
        id: 4,
        category: "Tournament",
        question: "When does the tournament start?",
        answer: "Tournament dates are announced on our homepage and through email notifications. Check your dashboard for real-time updates and schedule information.",
    },
    {
        id: 5,
        category: "Tournament",
        question: "What are the tournament rules?",
        answer: "All tournament rules are available in your dashboard once you register. Rules cover gameplay, communication guidelines, team conduct, and match procedures.",
    },
    {
        id: 6,
        category: "Tournament",
        question: "How is the prize money distributed?",
        answer: "Prize distribution is based on your team's final ranking. Details are provided in the tournament guidelines. Winners are notified within 7 days of tournament completion.",
    },
    {
        id: 7,
        category: "Technical",
        question: "What if I face technical issues during a match?",
        answer: "Contact our technical support team immediately through the dashboard. We have live support available during tournament hours. Delays due to technical issues will be documented.",
    },
    {
        id: 8,
        category: "Technical",
        question: "Which BGMI servers should we play on?",
        answer: "Tournament matches are played on official BGMI servers as specified in the match schedule. Consult the detailed rules for server specifications.",
    },
    {
        id: 9,
        category: "Account",
        question: "How do I reset my password?",
        answer: "Click on 'Forgot Password' on the login page. Enter your registered email address and follow the instructions sent to your inbox.",
    },
    {
        id: 10,
        category: "Account",
        question: "Can I have multiple teams registered?",
        answer: "Each player account can register only one team per tournament. Contact support if you need special arrangements.",
    },
    {
        id: 11,
        category: "Payments",
        question: "Is there a registration fee?",
        answer: "Tournament participation details including any fees are clearly displayed during registration. All costs are transparent upfront.",
    },
    {
        id: 12,
        category: "Support",
        question: "How do I contact support?",
        answer: "Use the Contact Us page to reach our support team. We respond to all inquiries within 24 hours. For urgent issues, use the live chat in your dashboard.",
    },
]

const categories = ["All", "Registration", "Tournament", "Technical", "Account", "Payments", "Support"]

export default function FAQPage() {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const filteredFAQs =
        selectedCategory === "All"
            ? faqItems
            : faqItems.filter((item) => item.category === selectedCategory)

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
                    <div className="absolute -top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-b border-cyan-500/20 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                            <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-2 rounded-lg text-black shadow-lg shadow-amber-400/30">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text hidden sm:block">NAG • IronmanYT</h1>
                        </Link>

                        <Link href="/">
                            <Button variant="ghost" className="text-cyan-300 hover:bg-cyan-500/10 gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto py-32 px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                        Find answers to common questions about registration, tournaments, and account management.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 justify-center mb-12">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full transition-all ${selectedCategory === category
                                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                                : "bg-slate-800/50 text-cyan-300 hover:bg-slate-700/50 border border-cyan-500/20"
                                }`}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                        <div
                            key={faq.id}
                            className="border border-cyan-500/20 backdrop-blur-md bg-black/40 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
                        >
                            <button
                                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-black/60 transition-colors"
                            >
                                <div className="flex items-start gap-4 text-left">
                                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold whitespace-nowrap mt-1">
                                        {faq.category}
                                    </span>
                                    <h3 className="text-lg font-semibold text-white leading-tight">{faq.question}</h3>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform ${expandedId === faq.id ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {expandedId === faq.id && (
                                <div className="px-6 py-4 bg-black/60 border-t border-cyan-500/10">
                                    <p className="text-cyan-100/80 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 p-8 border border-amber-500/20 backdrop-blur-md bg-black/40 rounded-2xl text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Didn&apos;t find what you&apos;re looking for?</h2>
                    <p className="text-amber-100/80 mb-6">
                        Our support team is here to help with any questions or concerns.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold px-8 rounded-full shadow-lg shadow-amber-400/20">
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-b from-black/60 via-black/80 to-black border-t border-cyan-500/20 mt-24 relative">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <p className="text-cyan-100/60 text-sm">
                        &copy; {new Date().getFullYear()} NAG • IronmanYT. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}