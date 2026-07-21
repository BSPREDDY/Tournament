"use client"

import { useState, useEffect, useRef } from "react"
import type { User } from "@/src/db/schema/schema"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog"
import { Play, Radio, Eye, Clock, ChevronLeft, ChevronRight, Sparkles, Trophy, Flame } from "lucide-react"

interface DashboardContentProps {
    user: User
}

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
}

// Check if a URL points to a local MP4 file or raw video file
function isDirectVideoFile(url: string): boolean {
    if (!url) return false
    const clean = url.trim().toLowerCase()
    return clean.startsWith("/uploads/") || clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".ogg") || clean.includes("blob:")
}

// Convert embed code, YouTube watch links, or raw links into valid embed URLs for full-screen modal
function getEmbedUrl(rawUrl: string): string {
    if (!rawUrl) return ""
    let str = rawUrl.trim()

    // Extract src from raw <iframe> HTML snippet if pasted
    const srcMatch = str.match(/src=["']([^"']+)["']/i)
    if (srcMatch && srcMatch[1]) {
        str = srcMatch[1]
    }

    // Convert standard YouTube watch/short link to embed URL
    const ytMatch = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
    }

    return str
}

// Convert links to muted autoplay embed URLs for hover and initial section previews
function getAutoplayEmbedUrl(rawUrl: string): string {
    if (!rawUrl) return ""
    let str = rawUrl.trim()

    const srcMatch = str.match(/src=["']([^"']+)["']/i)
    if (srcMatch && srcMatch[1]) {
        str = srcMatch[1]
    }

    const ytMatch = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytMatch[1]}`
    }

    if (str.includes("youtube.com/embed/")) {
        const joinChar = str.includes("?") ? "&" : "?"
        return `${str}${joinChar}autoplay=1&mute=1&controls=0`
    }

    return str
}

export default function DashboardContent({ user }: DashboardContentProps) {
    const [videos, setVideos] = useState<VideoItem[]>([])
    const [loading, setLoading] = useState(true)
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
    const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null)
    const heroScrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/videos")
            if (res.ok) {
                const data = await res.json()
                if (data.videos && Array.isArray(data.videos)) {
                    setVideos(data.videos)
                }
            }
        } catch (err) {
            console.error("Failed to fetch videos:", err)
        } finally {
            setLoading(false)
        }
    }

    // Filter videos into section categories
    const heroVideos = videos.filter((v) => v.category === "hero")
    const liveStreamVideos = videos.filter((v) => v.category === "live_stream" || v.isLive)
    const latestVideos = videos.filter((v) => v.category === "latest_videos")
    const latestTournamentVideos = videos.filter((v) => v.category === "latest_tournament")

    // Featured live stream video
    const featuredLive = liveStreamVideos.length > 0 ? liveStreamVideos[0] : null

    // Scroll controls for Hero Left-to-Right reel
    const scrollHero = (direction: "left" | "right") => {
        if (heroScrollRef.current) {
            const scrollAmount = direction === "left" ? -350 : 350
            heroScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }

    // Helper to render auto-playing thumbnail/preview or fallback image
    const renderCardMedia = (video: VideoItem, isFirstVideo: boolean) => {
        const shouldAutoplay = hoveredVideoId === video.id || (hoveredVideoId === null && isFirstVideo)

        if (shouldAutoplay) {
            if (isDirectVideoFile(video.url)) {
                return (
                    <video
                        src={video.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover pointer-events-none"
                    />
                )
            } else {
                return (
                    <iframe
                        src={getAutoplayEmbedUrl(video.url)}
                        title={video.title}
                        className="w-full h-full border-0 pointer-events-none scale-125 transition-transform duration-700"
                        allow="autoplay; encrypted-media"
                    />
                )
            }
        }

        return (
            <>
                <img
                    src={video.thumbnailUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 fill-current" />
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="relative min-h-screen w-full pb-16 text-white">
            {/* Background Video */}
            <video
                src="/dashboard-background.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover -z-20 opacity-30 pointer-events-none filter brightness-75 contrast-125"
            />

            {/* Ambient Background Gradient Overlay */}
            <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-8 sm:space-y-12">

                {/* 1. HERO SECTION: Left-to-Right Scrolling Highlight Videos */}
                <section className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="p-2 rounded-xl bg-primary/30 text-white border border-primary/40 shadow-lg">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                                    Hero Highlight Videos
                                </h2>
                                <p className="text-[11px] sm:text-xs text-slate-300">
                                    Hover over any video to preview • Scroll left to right
                                </p>
                            </div>
                        </div>

                        {/* Scroll Buttons */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => scrollHero("left")}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-white/20 bg-black/60 text-white hover:bg-primary/40 hover:text-white transition-all"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => scrollHero("right")}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-white/20 bg-black/60 text-white hover:bg-primary/40 hover:text-white transition-all"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Left-to-Right Scrolling Reel */}
                    <div
                        ref={heroScrollRef}
                        className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none py-2 scroll-smooth px-1"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[260px] sm:w-[320px] shrink-0 aspect-video rounded-2xl bg-black/50 animate-pulse border border-white/10"
                                />
                            ))
                            : heroVideos.map((video, idx) => (
                                <div
                                    key={video.id}
                                    onClick={() => setActiveVideo(video)}
                                    onMouseEnter={() => setHoveredVideoId(video.id)}
                                    onMouseLeave={() => setHoveredVideoId(null)}
                                    className="group relative w-[260px] sm:w-[320px] shrink-0 rounded-2xl overflow-hidden border border-white/20 bg-slate-900/80 backdrop-blur-md shadow-xl transition-all duration-500 cursor-pointer flex flex-col card-3d perspective-1000"
                                >
                                    <div className="relative aspect-video bg-black/80 overflow-hidden">
                                        {renderCardMedia(video, idx === 0)}

                                        {video.duration && (
                                            <div className="absolute bottom-2 right-2 bg-black/90 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono text-white flex items-center gap-1 border border-white/10 z-10">
                                                <Clock className="w-3 h-3 text-primary" /> {video.duration}
                                            </div>
                                        )}

                                        {video.views && (
                                            <div className="absolute bottom-2 left-2 bg-black/90 px-2 py-0.5 rounded text-[10px] sm:text-[11px] text-white flex items-center gap-1 border border-white/10 z-10">
                                                <Eye className="w-3 h-3 text-primary" /> {video.views}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-primary transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                        {video.description && (
                                            <p className="text-[11px] text-slate-300 line-clamp-1 mt-1">
                                                {video.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>

                {/* 2. LIVE STREAM SECTION */}
                <section className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="p-2 rounded-xl bg-red-500/20 text-red-500 border border-red-500/30 shadow-lg shadow-red-500/10">
                            <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide uppercase flex items-center gap-2">
                                Live Stream
                                <Badge className="bg-red-600 text-white animate-pulse px-2 py-0.5 text-[10px] sm:text-xs font-bold shadow-lg">
                                    ● LIVE NOW
                                </Badge>
                            </h2>
                            <p className="text-[11px] sm:text-xs text-slate-300">
                                Watch ongoing live broadcasts and official tournament stream channels
                            </p>
                        </div>
                    </div>

                    {featuredLive ? (
                        <div className="relative rounded-2xl overflow-hidden border border-red-500/40 bg-slate-900/90 backdrop-blur-xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 card-3d glow-3d">
                            {/* Player Preview */}
                            <div className="lg:col-span-8 relative aspect-video bg-black group overflow-hidden">
                                {isDirectVideoFile(featuredLive.url) ? (
                                    <video
                                        src={featuredLive.url}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain bg-black"
                                    />
                                ) : (
                                    <iframe
                                        src={getAutoplayEmbedUrl(featuredLive.url)}
                                        title={featuredLive.title}
                                        className="w-full h-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )}
                            </div>

                            {/* Details */}
                            <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-gradient-to-b from-slate-900 to-black">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="destructive" className="bg-red-600 text-white px-2.5 py-0.5 font-bold text-[10px] sm:text-xs flex items-center gap-1 animate-pulse">
                                            <Radio className="w-3 h-3" /> LIVE BROADCAST
                                        </Badge>
                                        <span className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5 text-primary" /> {featuredLive.views || "42.1K Live"}
                                        </span>
                                    </div>

                                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white leading-snug">
                                        {featuredLive.title}
                                    </h3>

                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        {featuredLive.description || "Tune in live to watch top-tier BGMI teams fight for the ultimate victory!"}
                                    </p>
                                </div>

                                <Button
                                    onClick={() => setActiveVideo(featuredLive)}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold gap-2 shadow-lg text-xs sm:text-sm h-9 sm:h-10"
                                >
                                    <Play className="w-4 h-4 fill-current" /> Watch Full Screen Stream
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 sm:p-8 text-center rounded-2xl border border-red-500/20 bg-slate-900/60 backdrop-blur-md">
                            <Radio className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-red-500/50 mb-2 animate-pulse" />
                            <p className="text-xs sm:text-sm font-semibold text-slate-200">No active live streams right now.</p>
                            <p className="text-[11px] text-slate-400 mt-1">Check back soon for upcoming live tournament broadcasts.</p>
                        </div>
                    )}
                </section>

                {/* 3. LATEST VIDEOS SECTION */}
                <section className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="p-2 rounded-xl bg-secondary/30 text-white border border-secondary/40 shadow-lg">
                            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-foreground" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                                Latest Videos
                            </h2>
                            <p className="text-[11px] sm:text-xs text-slate-300">
                                Explore recent gameplay, tutorials, and community uploads
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="aspect-video rounded-2xl bg-black/50 animate-pulse border border-white/10" />
                            ))
                            : latestVideos.map((video, idx) => (
                                <div
                                    key={video.id}
                                    onClick={() => setActiveVideo(video)}
                                    onMouseEnter={() => setHoveredVideoId(video.id)}
                                    onMouseLeave={() => setHoveredVideoId(null)}
                                    className="group relative rounded-2xl overflow-hidden border border-white/20 bg-slate-900/80 backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer flex flex-col card-3d"
                                >
                                    <div className="relative aspect-video bg-black/80 overflow-hidden">
                                        {renderCardMedia(video, idx === 0)}

                                        {video.duration && (
                                            <div className="absolute bottom-2.5 right-2.5 bg-black/90 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono text-white flex items-center gap-1 border border-white/10 z-10">
                                                <Clock className="w-3 h-3 text-primary" /> {video.duration}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-primary transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5 text-primary" /> {video.views || "0"} views
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>

                {/* 4. LATEST TOURNAMENT VIDEOS SECTION */}
                <section className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                                Latest Tournament Videos
                            </h2>
                            <p className="text-[11px] sm:text-xs text-slate-300">
                                Watch match replays, round breakdowns, and official tournament coverage
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="aspect-video rounded-2xl bg-black/50 animate-pulse border border-white/10" />
                            ))
                            : latestTournamentVideos.map((video, idx) => (
                                <div
                                    key={video.id}
                                    onClick={() => setActiveVideo(video)}
                                    onMouseEnter={() => setHoveredVideoId(video.id)}
                                    onMouseLeave={() => setHoveredVideoId(null)}
                                    className="group relative rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-900/80 backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer flex flex-col card-3d"
                                >
                                    <div className="relative aspect-video bg-black/80 overflow-hidden">
                                        {renderCardMedia(video, idx === 0)}

                                        {video.duration && (
                                            <div className="absolute bottom-2.5 right-2.5 bg-black/90 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono text-white flex items-center gap-1 border border-white/10 z-10">
                                                <Clock className="w-3 h-3 text-amber-400" /> {video.duration}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-amber-500/10">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5 text-amber-400" /> {video.views || "0"} views
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>
            </div>

            {/* Video Player Modal */}
            <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
                <DialogContent className="sm:max-w-4xl max-w-[95vw] bg-black/95 border-white/20 backdrop-blur-2xl p-0 overflow-hidden text-white rounded-2xl">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{activeVideo?.title || "Video Player"}</DialogTitle>
                        <DialogDescription className="sr-only">Watch video stream and details</DialogDescription>
                    </DialogHeader>
                    {activeVideo && (
                        <div className="flex flex-col">
                            {/* Player Container */}
                            <div className="relative aspect-video w-full bg-black">
                                {isDirectVideoFile(activeVideo.url) ? (
                                    <video
                                        src={activeVideo.url}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain bg-black"
                                    />
                                ) : (
                                    <iframe
                                        src={getEmbedUrl(activeVideo.url)}
                                        title={activeVideo.title}
                                        className="w-full h-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )}
                            </div>

                            {/* Info Container */}
                            <div className="p-4 sm:p-6 space-y-2.5 bg-gradient-to-b from-slate-900 to-black text-white">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-white leading-snug">
                                        {activeVideo.title}
                                    </h2>
                                    {activeVideo.isLive && (
                                        <Badge variant="destructive" className="bg-red-600 shrink-0 text-white font-bold text-xs">
                                            ● LIVE
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-300">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5 text-primary" /> {activeVideo.views || "0"} views
                                    </span>
                                    {activeVideo.duration && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-primary" /> {activeVideo.duration}
                                        </span>
                                    )}
                                </div>

                                {activeVideo.description && (
                                    <p className="text-xs text-slate-300 pt-2 border-t border-white/10 leading-relaxed">
                                        {activeVideo.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
