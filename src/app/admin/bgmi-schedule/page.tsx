"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { toast } from "sonner"
import { Trash2, Plus, Edit2 } from "lucide-react"
import type { BgmiSchedule } from "@/src/db/schema/schema"

export default function BgmiSchedulePage() {
    const [schedules, setSchedules] = useState<BgmiSchedule[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        maps: "",
        type: "Online",
    })

    useEffect(() => {
        loadSchedules()
    }, [])

    const loadSchedules = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/admin/bgmi-schedule")
            if (response.ok) {
                const data = await response.json()
                setSchedules(data)
            }
        } catch (error) {
            toast.error("Failed to load schedules")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.date || !formData.time || !formData.maps || !formData.type) {
            toast.error("Please fill in all fields")
            return
        }

        setIsSubmitting(true)
        try {
            if (editingId) {
                // Update existing schedule
                const response = await fetch(`/api/admin/bgmi-schedule/${editingId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                })

                if (response.ok) {
                    toast.success("Schedule updated successfully")
                    await loadSchedules()
                    setIsOpen(false)
                    resetForm()
                } else {
                    toast.error("Failed to update schedule")
                }
            } else {
                // Create new schedule
                const response = await fetch("/api/admin/bgmi-schedule", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                })

                if (response.ok) {
                    toast.success("Schedule created successfully")
                    await loadSchedules()
                    setIsOpen(false)
                    resetForm()
                } else {
                    toast.error("Failed to create schedule")
                }
            }
        } catch (error) {
            toast.error("An error occurred")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this schedule?")) return

        try {
            const response = await fetch(`/api/admin/bgmi-schedule/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                toast.success("Schedule deleted successfully")
                await loadSchedules()
            } else {
                toast.error("Failed to delete schedule")
            }
        } catch (error) {
            toast.error("An error occurred")
            console.error(error)
        }
    }

    const handleEdit = (schedule: BgmiSchedule) => {
        setEditingId(schedule.id)
        setFormData({
            date: schedule.date,
            time: schedule.time,
            maps: schedule.maps,
            type: schedule.type,
        })
        setIsOpen(true)
    }

    const resetForm = () => {
        setFormData({
            date: "",
            time: "",
            maps: "",
            type: "Online",
        })
        setEditingId(null)
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            resetForm()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">BGMI Schedule</h1>
                    <p className="text-muted-foreground mt-1">Manage tournament schedules</p>
                </div>
                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Schedule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Schedule" : "Create New Schedule"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time">Time (comma-separated if multiple)</Label>
                                <Input
                                    id="time"
                                    placeholder="e.g., 10:30/11:30, 11:40/12:40"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maps">Maps (comma-separated if multiple)</Label>
                                <Input
                                    id="maps"
                                    placeholder="e.g., Erangel, Miramar, Sanhaok"
                                    value={formData.maps}
                                    onChange={(e) => setFormData({ ...formData, maps: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                >
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : editingId ? "Update Schedule" : "Create Schedule"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">Loading schedules...</p>
                    </CardContent>
                </Card>
            ) : schedules.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">No schedules created yet</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {schedules.map((schedule) => (
                        <Card key={schedule.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle>{schedule.date}</CardTitle>
                                        <CardDescription>Type: {schedule.type}</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(schedule)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(schedule.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground">Time</p>
                                        <p className="text-sm whitespace-pre-wrap">{schedule.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground">Maps</p>
                                        <p className="text-sm whitespace-pre-wrap">{schedule.maps}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
