"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog"
import { Plus, Video, Trash2, Edit, Radio, Eye, Clock, Loader2, Sparkles, Film, Upload, FileVideo, Image as ImageIcon, Link as LinkIcon, Code } from "lucide-react"
import { toast } from "sonner"

interface VideoItem {
    id: string
    title: string
    description?: string
    url: string
    thumbnailUrl?: string
    category: "hero" | "live_stream" | "latest_videos" | "latest_tournament"
    isLive: boolean
    views?: string
    duration?: string
    createdAt?: string
}

const CATEGORIES = [
    { key: "hero", title: "Hero Section (Highlight Videos)", description: "Scrolling left-to-right banner videos on user dashboard" },
    { key: "live_stream", title: "Live Stream Section", description: "Featured live broadcasts and stream events" },
    { key: "latest_videos", title: "Latest Videos Section", description: "Recently uploaded community and gameplay videos" },
    { key: "latest_tournament", title: "Latest Tournament Videos Section", description: "Official match replays and tournament highlights" },
] as const

// Robust URL cleaner to handle iframe code snippets, YouTube links, and local video paths
function cleanAndExtractVideoUrl(input: string): string {
    if (!input) return ""
    let str = input.trim()

    // Extract src URL if raw <iframe> HTML snippet was pasted
    const srcMatch = str.match(/src=["']([^"']+)["']/i)
    if (srcMatch && srcMatch[1]) {
        str = srcMatch[1]
    }

    // Convert standard YouTube watch links to embed URLs
    const ytMatch = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`
    }

    return str
}

export default function AdminVideosPage() {
    const [videos, setVideos] = useState<VideoItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploadingVideo, setIsUploadingVideo] = useState(false)
    const [isUploadingThumb, setIsUploadingThumb] = useState(false)
    const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)

    // Form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [url, setUrl] = useState("")
    const [thumbnailUrl, setThumbnailUrl] = useState("")
    const [category, setCategory] = useState<VideoItem["category"]>("hero")
    const [isLive, setIsLive] = useState(false)
    const [views, setViews] = useState("")
    const [duration, setDuration] = useState("")

    const videoFileInputRef = useRef<HTMLInputElement>(null)
    const thumbFileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/admin/videos")
            if (!res.ok) throw new Error("Failed to fetch videos")
            const data = await res.json()
            setVideos(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            toast.error("Failed to load videos")
        } finally {
            setLoading(false)
        }
    }

    const openModalForCategory = (targetCategory: VideoItem["category"]) => {
        setEditingVideo(null)
        setTitle("")
        setDescription("")
        setUrl("")
        setThumbnailUrl("")
        setCategory(targetCategory)
        setIsLive(targetCategory === "live_stream")
        setViews("0")
        setDuration(targetCategory === "live_stream" ? "LIVE" : "10:00")
        setIsDialogOpen(true)
    }

    const openEditModal = (video: VideoItem) => {
        setEditingVideo(video)
        setTitle(video.title)
        setDescription(video.description || "")
        setUrl(video.url)
        setThumbnailUrl(video.thumbnailUrl || "")
        setCategory(video.category)
        setIsLive(video.isLive)
        setViews(video.views || "0")
        setDuration(video.duration || "")
        setIsDialogOpen(true)
    }

    // Local Video File Upload Handler
    const handleLocalVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploadingVideo(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Upload failed")

            setUrl(data.url)
            toast.success("Local video uploaded successfully!")
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to upload video")
        } finally {
            setIsUploadingVideo(false)
        }
    }

    // Local Thumbnail Image Upload Handler
    const handleLocalThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploadingThumb(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Upload failed")

            setThumbnailUrl(data.url)
            toast.success("Local thumbnail uploaded successfully!")
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to upload thumbnail")
        } finally {
            setIsUploadingThumb(false)
        }
    }

    const handleSaveVideo = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !url.trim()) {
            toast.error("Please enter video title and URL / file")
            return
        }

        const cleanedUrl = cleanAndExtractVideoUrl(url)

        setIsSaving(true)
        try {
            const payload = {
                title: title.trim(),
                description: description.trim(),
                url: cleanedUrl,
                thumbnailUrl: thumbnailUrl.trim() || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
                category,
                isLive,
                views: views.trim() || "0",
                duration: isLive ? "LIVE" : (duration.trim() || "00:00"),
            }

            let res
            if (editingVideo) {
                res = await fetch(`/api/admin/videos/${editingVideo.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
            } else {
                res = await fetch("/api/admin/videos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })
            }

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.error || "Save failed")
            }

            toast.success(editingVideo ? "Video updated successfully!" : "Video posted successfully!")
            setIsDialogOpen(false)
            fetchVideos()
        } catch (err: any) {
            console.error(err)
            toast.error(err.message || "Failed to save video")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteVideo = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return

        try {
            const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Delete failed")
            toast.success("Video deleted")
            setVideos((prev) => prev.filter((v) => v.id !== id))
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete video")
        }
    }

    const getVideosByCategory = (catKey: VideoItem["category"]) => {
        return videos.filter((v) => v.category === catKey)
    }

    return (
        <div className="p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-card to-card/60 p-4 sm:p-6 rounded-2xl border border-primary/20 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 shrink-0">
                        <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold gradient-text">Videos Management</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Post local videos, YouTube links, or embed codes across all 4 section categories.
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => openModalForCategory("hero")}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 gap-2 text-xs sm:text-sm h-9 sm:h-10 shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Post New Video
                </Button>
            </div>

            {/* Video Categories Sections */}
            {CATEGORIES.map((cat) => {
                const categoryVideos = getVideosByCategory(cat.key)

                return (
                    <Card key={cat.key} className="border-primary/20 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/10 bg-primary/5 p-3.5 sm:p-5">
                            <div>
                                <CardTitle className="text-base sm:text-lg lg:text-xl font-bold flex items-center gap-2">
                                    <Film className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    {cat.title}
                                    <Badge variant="outline" className="ml-2 border-primary/30 text-primary text-[11px] sm:text-xs">
                                        {categoryVideos.length} {categoryVideos.length === 1 ? "Video" : "Videos"}
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                                    {cat.description}
                                </CardDescription>
                            </div>

                            {/* Section Add More Videos Button */}
                            <Button
                                onClick={() => openModalForCategory(cat.key)}
                                variant="outline"
                                size="sm"
                                className="border-primary/30 hover:bg-primary/20 gap-1.5 shrink-0 text-xs h-8 sm:h-9"
                            >
                                <Plus className="w-3.5 h-3.5 text-primary" />
                                Add More Videos
                            </Button>
                        </CardHeader>

                        <CardContent className="p-3.5 sm:p-5">
                            {loading ? (
                                <div className="py-10 flex justify-center items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    Loading videos...
                                </div>
                            ) : categoryVideos.length === 0 ? (
                                <div className="py-8 sm:py-10 text-center border-2 border-dashed border-primary/10 rounded-xl bg-card/40 p-4">
                                    <Video className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-muted-foreground/40 mb-2" />
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">No videos added to this section yet.</p>
                                    <Button
                                        onClick={() => openModalForCategory(cat.key)}
                                        size="sm"
                                        className="bg-primary/80 hover:bg-primary text-xs gap-1.5 mt-3 h-8"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Add More Videos
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryVideos.map((video) => (
                                        <div
                                            key={video.id}
                                            className="group relative bg-card border border-primary/15 rounded-xl overflow-hidden shadow-sm hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300 flex flex-col"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative aspect-video bg-black/40 overflow-hidden">
                                                <img
                                                    src={video.thumbnailUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                <div className="absolute top-2 left-2 flex gap-2">
                                                    {video.isLive && (
                                                        <Badge className="bg-red-600 text-white font-bold px-2 py-0.5 text-[10px] sm:text-xs flex items-center gap-1 animate-pulse shadow-lg">
                                                            <Radio className="w-3 h-3" /> LIVE
                                                        </Badge>
                                                    )}
                                                </div>

                                                {video.duration && (
                                                    <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-white flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {video.duration}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                                                <div>
                                                    <h3 className="font-bold text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                                        {video.title}
                                                    </h3>
                                                    {video.description && (
                                                        <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                            {video.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between pt-2 border-t border-primary/10 text-[11px] text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3 text-primary" /> {video.views || "0"} views
                                                    </span>

                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => openEditModal(video)}
                                                            className="w-7 h-7 hover:bg-primary/20 hover:text-primary"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteVideo(video.id)}
                                                            className="w-7 h-7 hover:bg-destructive/20 hover:text-destructive"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}

            {/* Hidden File Inputs */}
            <input
                type="file"
                ref={videoFileInputRef}
                onChange={handleLocalVideoUpload}
                accept="video/*"
                className="hidden"
            />
            <input
                type="file"
                ref={thumbFileInputRef}
                onChange={handleLocalThumbUpload}
                accept="image/*"
                className="hidden"
            />

            {/* Compact Responsive Modal Dialog for Adding / Editing Video */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md max-w-[94vw] rounded-xl bg-card border-primary/20 backdrop-blur-xl p-4 sm:p-5 max-h-[85vh] overflow-y-auto">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            {editingVideo ? "Edit Video" : "Post New Video"}
                        </DialogTitle>
                        <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground">
                            Upload a video file, paste a YouTube link, or paste embed code.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveVideo} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted-foreground">Video Title *</label>
                            <Input
                                placeholder="e.g. Final Match Clutch Highlights"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="h-8 sm:h-9 text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted-foreground">Target Section / Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="w-full h-8 sm:h-9 px-2.5 rounded-md bg-background border border-input text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="hero">Hero Section (Highlight Videos)</option>
                                <option value="live_stream">Live Stream Section</option>
                                <option value="latest_videos">Latest Videos Section</option>
                                <option value="latest_tournament">Latest Tournament Videos Section</option>
                            </select>
                        </div>

                        {/* Video Source Options */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-muted-foreground">
                                    Video Source (URL, Embed Code, or File) *
                                </label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => videoFileInputRef.current?.click()}
                                    disabled={isUploadingVideo}
                                    className="h-6 text-[10px] px-2 gap-1 border-primary/30"
                                >
                                    {isUploadingVideo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3 text-primary" />}
                                    Upload Local MP4
                                </Button>
                            </div>

                            <textarea
                                rows={2}
                                placeholder="Paste YouTube link, Embed iframe code, or local file path..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                className="w-full p-2.5 rounded-md bg-background border border-input text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                            />
                            {url && url.startsWith("/uploads/") && (
                                <p className="text-[10px] text-green-500 font-medium">✓ Local file selected: {url}</p>
                            )}
                        </div>

                        {/* Thumbnail Source Options */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold text-muted-foreground">Thumbnail Image</label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => thumbFileInputRef.current?.click()}
                                    disabled={isUploadingThumb}
                                    className="h-6 text-[10px] px-2 gap-1 border-primary/30"
                                >
                                    {isUploadingThumb ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3 text-primary" />}
                                    Upload Image
                                </Button>
                            </div>
                            <Input
                                placeholder="Thumbnail Image URL or upload file"
                                value={thumbnailUrl}
                                onChange={(e) => setThumbnailUrl(e.target.value)}
                                className="h-8 sm:h-9 text-xs"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-muted-foreground">Duration</label>
                                <Input
                                    placeholder="e.g. 14:20 or LIVE"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="h-8 sm:h-9 text-xs"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-muted-foreground">View Count</label>
                                <Input
                                    placeholder="e.g. 45.2K"
                                    value={views}
                                    onChange={(e) => setViews(e.target.value)}
                                    className="h-8 sm:h-9 text-xs"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-0.5">
                            <input
                                type="checkbox"
                                id="isLiveCheckbox"
                                checked={isLive}
                                onChange={(e) => setIsLive(e.target.checked)}
                                className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                            />
                            <label htmlFor="isLiveCheckbox" className="text-xs font-medium cursor-pointer">
                                Mark as Live Stream broadcast
                            </label>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted-foreground">Description</label>
                            <textarea
                                rows={2}
                                placeholder="Optional description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 rounded-md bg-background border border-input text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <DialogFooter className="pt-2 gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="h-8 text-xs">
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" disabled={isSaving || isUploadingVideo || isUploadingThumb} className="bg-primary hover:bg-primary/90 gap-1.5 h-8 text-xs">
                                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {editingVideo ? "Save Changes" : "Post Video"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
