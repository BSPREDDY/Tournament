"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { toast } from "sonner"
import { Mail, User, Calendar, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import type { UserContactForm } from "@/src/db/schema/schema"

interface ContactFormWithUser extends Partial<UserContactForm> {
    userName?: string
    userLastName?: string
    userEmail?: string
}

export default function UserContactFormsPage() {
    const [contactForms, setContactForms] = useState<ContactFormWithUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    useEffect(() => {
        loadContactForms()
    }, [])

    const loadContactForms = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/admin/contact-forms")
            if (response.ok) {
                const data = await response.json()
                console.log("[v0] Contact forms loaded:", data?.length || 0)
                setContactForms(data)
            } else {
                console.log("[v0] Failed to load contact forms, status:", response.status)
            }
        } catch (error) {
            console.log("[v0] Error loading contact forms:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handleDelete = async (id: string | undefined) => {
        if (!id) return

        try {
            const response = await fetch(`/api/admin/contact-forms/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setContactForms(contactForms.filter(form => form.id !== id))
                toast.success("Contact form deleted successfully")
            } else {
                toast.error("Failed to delete contact form")
            }
        } catch (error) {
            console.log("[v0] Error deleting contact form:", error)
            toast.error("Error deleting contact form")
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                        User Contact Forms
                    </h1>
                    <p className="text-muted-foreground mt-1">View all submitted contact forms</p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Loading contact forms...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (contactForms.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                        User Contact Forms
                    </h1>
                    <p className="text-muted-foreground mt-1">View all submitted contact forms</p>
                </div>
                <Card className="border-primary/10">
                    <CardContent className="pt-6">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-center text-muted-foreground">No contact forms submitted yet</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                        User Contact Forms
                    </h1>
                    <p className="text-muted-foreground mt-1">View all submitted contact forms</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                    {contactForms.length} {contactForms.length === 1 ? "Form" : "Forms"}
                </Badge>
            </div>

            <div className="space-y-4">
                {contactForms.map((form) => (
                    <Card
                        key={form.id}
                        className="border-primary/10 hover:border-primary/30 transition-all cursor-pointer hover:shadow-lg overflow-hidden group"
                    >
                        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0" onClick={() => setExpandedId(expandedId === form.id ? null : form.id ?? null)}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                                            {form.subject}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="flex items-center gap-2 mt-2">
                                        <User className="w-4 h-4" />
                                        <span className="truncate">
                                            {form.userName} {form.userLastName}
                                        </span>
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge variant="secondary">
                                        {expandedId === form.id ? "Collapse" : "View"}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(form.id)
                                        }}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        title="Delete this contact form"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        {expandedId === form.id && (
                            <CardContent className="space-y-4 border-t border-primary/10 pt-4">
                                {/* Sender Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</p>
                                        <p className="font-medium">
                                            {form.userName} {form.userLastName}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</p>
                                        <a href={`mailto:${form.email}`} className="text-primary hover:underline break-all text-sm font-medium">
                                            {form.email}
                                        </a>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject</p>
                                    <p className="font-medium text-sm">{form.subject}</p>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</p>
                                    <div className="bg-muted/50 p-3 rounded-lg border border-primary/10">
                                        <p className="text-sm whitespace-pre-wrap text-foreground">{form.message}</p>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-primary/10 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Submitted: {formatDate(form.createdAt!)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>Contact Email: {form.email}</span>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
