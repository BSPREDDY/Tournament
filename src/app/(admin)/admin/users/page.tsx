"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardHeader } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { toast } from "sonner"
import { UserPlus, Search, Edit2, Trash2, Shield, User, Download, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

function UsersList() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user",
  })

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => toast.error("Failed to load users"))
  }, [])

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDownloadExcel = () => {
    if (filteredUsers.length === 0) {
      toast.error("No users to download")
      return
    }

    setIsDownloading(true)

    const headers = ["First Name", "Last Name", "Email", "Phone Number", "Role", "Created Date"]

    const rows = filteredUsers.map((user) => [
      user.firstName,
      user.lastName,
      user.email,
      user.phoneNumber,
      user.role,
      new Date(user.createdAt).toLocaleString(),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    setIsDownloading(false)
    toast.success("Users exported successfully")
  }

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin"
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
        toast.success(`User updated to ${newRole}`)
      }
    } catch {
      toast.error("Update failed")
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (res.ok) {
        const updatedUser = await res.json()
        setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)))
        toast.success("User updated successfully")
        setOpen(false)
        resetForm()
      } else {
        toast.error("Failed to update user")
      }
    } catch (error) {
      toast.error("Failed to update user")
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId))
        toast.success("User deleted")
      }
    } catch {
      toast.error("Delete failed")
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      role: "user",
    })
    setEditingUser(null)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        const newUser = await res.json()
        setUsers([newUser, ...users])
        toast.success("User added successfully")
        setOpen(false)
        resetForm()
      } else {
        toast.error("Failed to add user")
      }
    } catch {
      toast.error("Failed to add user")
    }
  }

  const openEditDialog = (user: any) => {
    setEditingUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      phoneNumber: user.phoneNumber,
      role: user.role,
    })
    setOpen(true)
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text">User Management</h2>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <Button
            onClick={handleDownloadExcel}
            disabled={isDownloading}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg text-white gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Downloading...</span>
                <span className="sm:hidden">Download</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download Excel</span>
                <span className="sm:hidden">Export</span>
              </>
            )}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-secondary text-white gap-2 hover:shadow-lg flex-1 sm:flex-initial text-xs sm:text-sm">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto w-[95vw]">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  {editingUser ? "Update user account details" : "Create a new user account. All fields are required."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={editingUser ? handleEditUser : handleAddUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs sm:text-sm">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs sm:text-sm">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs sm:text-sm">
                      Password {editingUser && "(Leave blank to keep current)"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-xs sm:text-sm">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs sm:text-sm">
                      Role
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger className="text-xs sm:text-sm">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false)
                      resetForm()
                    }}
                    className="text-xs sm:text-sm"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="text-xs sm:text-sm">
                    {editingUser ? "Update User" : "Add User"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="card-glow">
        <CardHeader className="px-2 sm:px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10 bg-card/50 border-primary/20 focus:border-primary focus:ring-primary/20 text-xs sm:text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <div className="divide-y divide-primary/10 overflow-x-auto">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-primary/2 px-2 rounded transition-colors duration-200"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    {u.role === "admin" ? (
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    ) : (
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate text-xs sm:text-base">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRole(u.id, u.role)}
                    className="hover:bg-primary/10 text-xs px-2 h-8 flex-1 sm:flex-initial"
                  >
                    {u.role === "admin" ? "User" : "Admin"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(u)}
                    className="hover:bg-primary/10 h-8 w-8"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={() => deleteUser(u.id)}
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-xs sm:text-base">No users found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading users...</div>}>
      <UsersList />
    </Suspense>
  )
}
