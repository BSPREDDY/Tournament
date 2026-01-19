"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { toast } from "sonner"
import { Search, Edit2, Trash2, Save, Download, Eye, EyeOff, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog"

function FormManagementContent() {
    const [forms, setForms] = useState<any[]>([])
    const [search, setSearch] = useState("")
    const [editingForm, setEditingForm] = useState<any>(null)
    const [open, setOpen] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [formData, setFormData] = useState({
        teamName: "",
        iglName: "",
        player1: "",
        playerId1: "",
        player2: "",
        playerId2: "",
        player3: "",
        playerId3: "",
        player4: "",
        playerId4: "",
        iglMail: "",
        iglAlternateMail: "",
        iglNumber: "",
        iglAlternateNumber: "",
    })

    useEffect(() => {
        loadForms()
    }, [])

    const loadForms = () => {
        fetch("/api/admin/forms")
            .then((res) => res.json())
            .then((data) => setForms(data))
            .catch((err) => toast.error("Failed to load forms"))
    }

    const filteredForms = forms.filter(
        (f) =>
            f.teamName.toLowerCase().includes(search.toLowerCase()) ||
            f.iglName.toLowerCase().includes(search.toLowerCase()) ||
            f.iglMail.toLowerCase().includes(search.toLowerCase()),
    )

    const handleDownloadExcel = () => {
        if (filteredForms.length === 0) {
            toast.error("No forms to download")
            return
        }

        setIsDownloading(true)

        const headers = [
            "Team Name",
            "IGL Name",
            "Player 1",
            "Player 1 ID",
            "Player 2",
            "Player 2 ID",
            "Player 3",
            "Player 3 ID",
            "Player 4",
            "Player 4 ID",
            "IGL Email",
            "Alt Email",
            "IGL Phone",
            "Alt Phone",
            "Submitted Date",
        ]

        const rows = filteredForms.map((form) => [
            form.teamName,
            form.iglName,
            form.player1,
            form.playerId1,
            form.player2,
            form.playerId2,
            form.player3,
            form.playerId3,
            form.player4,
            form.playerId4,
            form.iglMail,
            form.iglAlternateMail,
            form.iglNumber,
            form.iglAlternateNumber,
            new Date(form.createdAt).toLocaleString(),
        ])

        const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

        const blob = new Blob([csv], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `forms-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)

        setIsDownloading(false)
        toast.success("Forms exported successfully")
    }

    const handleEdit = (form: any) => {
        setEditingForm(form)
        setFormData({
            teamName: form.teamName,
            iglName: form.iglName,
            player1: form.player1,
            playerId1: form.playerId1,
            player2: form.player2,
            playerId2: form.playerId2,
            player3: form.player3,
            playerId3: form.playerId3,
            player4: form.player4,
            playerId4: form.playerId4,
            iglMail: form.iglMail,
            iglAlternateMail: form.iglAlternateMail,
            iglNumber: form.iglNumber,
            iglAlternateNumber: form.iglAlternateNumber,
        })
        setOpen(true)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/admin/forms/${editingForm.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                toast.success("Form updated successfully")
                setOpen(false)
                loadForms()
            } else {
                toast.error("Failed to update form")
            }
        } catch {
            toast.error("Failed to update form")
        }
    }

    const handleDelete = async (formId: string) => {
        if (!confirm("Are you sure you want to delete this form?")) return
        try {
            const res = await fetch(`/api/admin/forms/${formId}`, {
                method: "DELETE",
            })
            if (res.ok) {
                toast.success("Form deleted successfully")
                loadForms()
            } else {
                toast.error("Failed to delete form")
            }
        } catch {
            toast.error("Failed to delete form")
        }
    }

    const toggleFormEnabled = async (formId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/forms/${formId}/toggle`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isEnabled: !currentStatus }),
            })
            if (res.ok) {
                setForms(forms.map((f) => (f.id === formId ? { ...f, isEnabled: !currentStatus } : f)))
                toast.success(`Form ${!currentStatus ? "enabled" : "disabled"} successfully`)
            }
        } catch {
            toast.error("Failed to update form status")
        }
    }

    return (
        <div className="space-y-6 w-full">
            <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Form Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">Total Submissions: {forms.length}</p>
                </div>
                <Button
                    onClick={handleDownloadExcel}
                    disabled={isDownloading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg text-white gap-2 w-full sm:w-auto"
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Downloading...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Download Excel
                        </>
                    )}
                </Button>
            </div>

            <Card className="card-glow w-full">
                <CardHeader>
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by team name, IGL name, or email..."
                            className="pl-10 bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 w-full overflow-x-auto">
                        {filteredForms.map((form) => (
                            <div
                                key={form.id}
                                className={`border rounded-lg p-4 space-y-3 hover:shadow-md transition-all duration-200 bg-gradient-to-r ${form.isEnabled
                                    ? "from-card to-card/50 border-primary/10 hover:border-primary/30"
                                    : "from-card/50 to-card/30 border-destructive/20 hover:border-destructive/40 opacity-75"
                                    }`}
                            >
                                <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                                    <div className="space-y-1 flex-1">
                                        <h3 className={`font-semibold text-lg ${form.isEnabled ? "text-primary" : "text-destructive"}`}>
                                            {form.teamName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">IGL: {form.iglName}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleFormEnabled(form.id, form.isEnabled)}
                                            className={`text-xs ${form.isEnabled ? "hover:bg-destructive/10" : "hover:bg-green-500/10"}`}
                                        >
                                            {form.isEnabled ? (
                                                <>
                                                    <EyeOff className="w-4 h-4 mr-1" />
                                                    Disable
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Enable
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(form)}
                                            className="hover:bg-primary/10 text-xs"
                                        >
                                            <Edit2 className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                                            onClick={() => handleDelete(form.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Player 1:</span> {form.player1} ({form.playerId1})
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Player 2:</span> {form.player2} ({form.playerId2})
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Player 3:</span> {form.player3 || "N/A"} (
                                        {form.playerId3 || "N/A"})
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Player 4:</span> {form.player4 || "N/A"} (
                                        {form.playerId4 || "N/A"})
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Email:</span> {form.iglMail}
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Phone:</span> {form.iglNumber}
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Submitted: {new Date(form.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {filteredForms.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">No forms found</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto w-[95vw] rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Form Submission</DialogTitle>
                        <DialogDescription>Make changes to the tournament registration form</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4 max-h-[calc(80vh-150px)] overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="teamName" className="text-sm">
                                        Team Name
                                    </Label>
                                    <Input
                                        id="teamName"
                                        value={formData.teamName}
                                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="iglName" className="text-sm">
                                        IGL Name
                                    </Label>
                                    <Input
                                        id="iglName"
                                        value={formData.iglName}
                                        onChange={(e) => setFormData({ ...formData, iglName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Players</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((num) => (
                                        <div key={num} className="space-y-2">
                                            <Label htmlFor={`player${num}`} className="text-sm">
                                                Player {num} Name
                                            </Label>
                                            <Input
                                                id={`player${num}`}
                                                value={formData[`player${num}` as keyof typeof formData]}
                                                onChange={(e) => setFormData({ ...formData, [`player${num}`]: e.target.value })}
                                                required={num <= 2}
                                            />
                                            <Label htmlFor={`playerId${num}`} className="text-sm">
                                                Player {num} ID
                                            </Label>
                                            <Input
                                                id={`playerId${num}`}
                                                value={formData[`playerId${num}` as keyof typeof formData]}
                                                onChange={(e) => setFormData({ ...formData, [`playerId${num}`]: e.target.value })}
                                                required={num <= 2}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Contact Information</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="iglMail" className="text-sm">
                                            Primary Email
                                        </Label>
                                        <Input
                                            id="iglMail"
                                            type="email"
                                            value={formData.iglMail}
                                            onChange={(e) => setFormData({ ...formData, iglMail: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="iglAlternateMail" className="text-sm">
                                            Alternate Email
                                        </Label>
                                        <Input
                                            id="iglAlternateMail"
                                            type="email"
                                            value={formData.iglAlternateMail}
                                            onChange={(e) => setFormData({ ...formData, iglAlternateMail: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="iglNumber" className="text-sm">
                                            Primary Phone
                                        </Label>
                                        <Input
                                            id="iglNumber"
                                            value={formData.iglNumber}
                                            onChange={(e) => setFormData({ ...formData, iglNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="iglAlternateNumber" className="text-sm">
                                            Alternate Phone
                                        </Label>
                                        <Input
                                            id="iglAlternateNumber"
                                            value={formData.iglAlternateNumber}
                                            onChange={(e) => setFormData({ ...formData, iglAlternateNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex gap-2 flex-col sm:flex-row">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                                Cancel
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default function FormManagementPage() {
    return (
        <Suspense fallback={<div>Loading form management...</div>}>
            <FormManagementContent />
        </Suspense>
    )
}
